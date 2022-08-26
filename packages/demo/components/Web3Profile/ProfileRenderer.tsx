import * as React from "react";
import { useQuery } from "react-query";
import { Loading } from "@web3uikit/core";
import { Edit } from "@web3uikit/icons";
import { snapId } from "./index";
import { ethers } from "ethers";
export const provider = new ethers.providers.JsonRpcProvider(
  "https://mainnet.infura.io/v3/527dda19139543ecbcdbca38a6d78b79"
);
export const ProfileRenderer: React.FC<{ handleEdit: () => void }> = ({
  handleEdit,
}) => {
  const getENS = async () => {
    const ens = await provider.lookupAddress(
      "0x74503D89E994e5e6FE44Ba3BBD09e048F0185403"
    );
    console.log("ENS", ens);
  };
  getENS();
  const { data: profile, isLoading } = useQuery({
    queryFn: async () => {
      const { profile } = await window.ethereum.request({
        method: "wallet_invokeSnap",
        params: [
          snapId,
          {
            method: "get_profile",
          },
        ],
      });
      console.log("queried prof", profile);
      return profile;
    },
  });

  if (isLoading) {
    return <Loading spinnerColor="black" text="Loading avatar" />;
  }
  if (!profile) {
    return (
      <div>
        <span>No profile defined yet</span>
        <br />
        <button onClick={handleEdit}>Click here to create a profile</button>
      </div>
    );
  }
  return (
    <div className="flex flex-col text-center">
      <img className="h-64 object-scale-down" src={profile.avatarUrl} />
      <div>Screen Name: {profile.screenName}</div>
      <div>Bio: {profile.bio}</div>

      <div className="grid">
        <button className="justify-self-end">
          <Edit fontSize="20px" onClick={handleEdit} />
        </button>
      </div>
    </div>
  );
};
