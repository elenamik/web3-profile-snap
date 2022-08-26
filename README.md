# web3-profile-snap
MetaMask snap + React component that attaches a user profile to your wallet. It maintains a photo, screen name, bio, and your wallet address.



## Getting set up
1. clone repo, yarn install
2. `yarn snap-dev` to start snap
3. create a `packages/demo/.env.local` and populate the post at which snap is being served, as well as Infura project info (used to upload images to IPFS):
```
NEXT_PUBLIC_SNAP_ID=local:http://localhost:8086
NEXT_PUBLIC_INFURA_ID=<fill here>
NEXT_PUBLIC_INFURA_API_KEY=<fill here>

```
4. `yarn demo-start` to start nextjs web app


## Resources:
- IPFS: https://www.becomebetterprogrammer.com/upload-files-using-react-ipfs-infura/
- ens: 
  - https://github.com/ensdomains/ensjs
  - https://docs.ens.domains/dapp-developer-guide/resolving-names#reverse-resolution
- web3react: https://dev.to/yakult/how-to-use-web3-react-to-develop-dapp-1cgn
