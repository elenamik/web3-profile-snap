# web3-profile-snap
MetaMask snap + React component that attaches an avatar photo to your wallet 


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
