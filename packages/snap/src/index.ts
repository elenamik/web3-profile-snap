import { JsonRpcId, JsonRpcVersion } from "@metamask/types";
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

type UpdateProfileRequest = JsonRpcRequest<{avatarUrl:string, screenName:string, address:string,bio:string }, 'update_profile'>
type GetProfileRequest = JsonRpcRequest<{}, 'get_profile'>
type ClearProfileRequest = JsonRpcRequest<{}, 'clear_profile'>

module.exports.onRpcRequest = async ({ request }: {
  origin: string;
  request: UpdateProfileRequest | GetProfileRequest | ClearProfileRequest
}) => {
  const state: SnapState = await getState();
  switch (request.method) {
    case 'update_profile':
          const { avatarUrl, screenName, address, bio } = request.params;
          // TODO: get ENS for address
          const newState: SnapState = {
            ...state,
            profile: {
              address, avatarUrl, screenName, bio
            }
          }
          //await saveState(newState)
          return {
            newState,
            request,
          }

    case 'get_profile':
      return { profile: state.profile}


    case 'clear_profile':
      // TODO: send a confirm first
      return {profile: state.profile}

    default:
      throw new Error('Method not found.');
  }
};
