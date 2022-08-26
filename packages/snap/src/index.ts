import { JsonRpcId, JsonRpcVersion } from "@metamask/types";
// TODO: can connect to a provider?
// const provider = new ethers.providers.JsonRpcProvider('https://mainnet.infura.io/v3/<project_id>')
const RANDOM_PIC_API= "https://picsum.photos/200"

export interface JsonRpcRequest<T, M> {
  jsonrpc: JsonRpcVersion;
  method: M,
  id: JsonRpcId;
  params?: T;
}

export interface Profile {
  address: string,
  avatarUrl?: string,
  screenName?: string,
  ens?: string,
  bio: string
}
export interface SnapState {
  profile?: Profile
}

async function saveState(newState: SnapState) {
  await wallet.request({
    'method': 'snap_manageState',
    params: ['update', { ...newState }]
  })
}

async function getState(): Promise<SnapState> {
  const state = await wallet.request({
    method: 'snap_manageState',
    params: ['get'],
  });
  if ( state === null ) {
    return {}
  };
  return state;
}

// TODO: export these as types for the front end
type UpdateProfileRequest = JsonRpcRequest<{avatarUrl:string, screenName:string, address:string,bio:string }, 'update_profile'>
type GetProfileRequest = JsonRpcRequest<{}, 'get_profile'>
type RandomizeAvatarRequest = JsonRpcRequest<{}, 'randomize_avatar'>
type ClearProfileRequest = JsonRpcRequest<{}, 'clear_profile'>

module.exports.onRpcRequest = async ({ request }: {
  origin: string;
  request: UpdateProfileRequest | GetProfileRequest | ClearProfileRequest | RandomizeAvatarRequest
}) => {
  const state: SnapState = await getState();
  switch (request.method) {
    case 'update_profile':
          const { avatarUrl, screenName, address, bio } = request.params;
          // TODO: get ENS for address
          // const ens = await provider.lookupAddress(address) (request timing out)

          const newState: SnapState = {
            ...state,
            profile: {
              ...state.profile,
              ...address && {address},
              ...bio && {bio},
              ...avatarUrl && {avatarUrl},
              ...screenName && {screenName},
            }
          }
          await saveState(newState)
          return {
            newState,
            request,
            success:true
          }

    case 'get_profile':
      return { profile: state.profile}


    case 'randomize_avatar':
      const { url } = await fetch(RANDOM_PIC_API)
        const newProfile = {
        ...state.profile,
          avatarUrl: url
        }
        let newStateRandomAvatar: SnapState = {
          ...state,
          profile: newProfile
        }
        await saveState(newStateRandomAvatar)
        return { newState: newStateRandomAvatar, success:true }


    case 'clear_profile':
      const result = await wallet.request({
        method: 'snap_confirm',
        params: [
          {
            prompt: 'Clear Profile?',
            description: 'Are you sure you want to clear your profile?',
            textAreaContent: 'This will not affect your keys or assets. This action will only erase your additional user data such as avatar, bio, username, etc.',
          },
        ],
      });
      if (result) {
        delete state.profile
        await saveState(state)
        return {profile: state.profile, success:true, }
      }
      else {
        return {profile: state.profile, success:false}
      }

    default:
      throw new Error('Method not found.');
  }
};
