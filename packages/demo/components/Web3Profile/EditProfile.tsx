import * as React from "react";
import { IPFSHTTPClient } from "ipfs-http-client";
import { AddResult } from "ipfs-core-types/dist/src/root";
import { CrossCircle } from "@web3uikit/icons";
import { snapId } from ".";
import { useIpfs } from "../../utils/ipfs";
import { Loading } from "@web3uikit/core";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";
import { useForm } from "react-hook-form";
import { Bin } from "@web3uikit/icons";

type FormValues = {
  screenName: string;
  bio: string;
  files: FileList;
};

const EditProfile: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { account } = useWeb3React<Web3Provider>();

  const [loading, setLoading] = React.useState(false);

  const { ipfs } = useIpfs();

  const updateProfile = async (profile: {
    imageUrl?: string;
    screenName?: string;
    bio?: string;
  }) => {
    if (!account) {
      return alert("Please connect wallet first");
    }
    const result = await window?.ethereum.request({
      method: "wallet_invokeSnap",
      params: [
        snapId,
        {
          method: "update_profile",
          params: {
            avatarUrl: profile.imageUrl,
            address: account,
            bio: profile.bio,
            screenName: profile.screenName,
          },
        },
      ],
    });
    console.log(result);
  };

  const clearProfile = async () => {
    const result: { success: boolean } = await window?.ethereum.request({
      method: "wallet_invokeSnap",
      params: [
        snapId,
        {
          method: "clear_profile",
        },
      ],
    });
    if (result.success) {
      onClose();
    }
  };

  const randomizeAvatar = async () => {
    setLoading(true);
    const result: { success: boolean } = await window?.ethereum.request({
      method: "wallet_invokeSnap",
      params: [
        snapId,
        {
          method: "randomize_avatar",
        },
      ],
    });
    if (result.success) {
      onClose();
    }
  };

  const uploadToIpfs = async (file: File) => {
    return (ipfs as IPFSHTTPClient).add(file);
  };

  const handleFormSubmit = async (formValues: FormValues) => {
    const { screenName, bio, files } = formValues;

    setLoading(true);

    let imageUrl: string | undefined = undefined;
    if (files && files.length > 0) {
      const file = files[0];
      const uploadResult: AddResult = await uploadToIpfs(file);
      imageUrl = `https://ipfs.infura.io/ipfs/${uploadResult.path}`;
    }

    await updateProfile({ imageUrl, screenName, bio });
    onClose();
  };

  const { register, handleSubmit } = useForm();

  if (loading) {
    return <Loading spinnerColor="black" text="Uploading" />;
  }

  return (
    <div className="w-64">
      <p className="text-lg font-semibold">Edit Profile</p>
      {ipfs ? (
        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="flex flex-col pt-6"
        >
          <label htmlFor="screenName">Screen Name: </label>
          <input
            {...register("screenName")}
            name="screenName"
            type="text"
            className="bg-gray-100 text-sm "
          />
          <label htmlFor="bio">Bio: </label>
          <input
            {...register("bio")}
            name="bio"
            type="textarea"
            className="bg-gray-100 text-sm "
          />
          <label htmlFor="files">Profile Avatar (Uploaded to IPFS):</label>
          <input
            {...register("files")}
            name="files"
            type="file"
            className="text-sm"
          />
          <button
            type="submit"
            className="mt-4 w-fit rounded-2xl border-2 border-teal-900 bg-teal-100 p-2 font-semibold text-teal-900"
          >
            Update Profile
          </button>
        </form>
      ) : (
        <div>Could not connect to IPFS at this time</div>
      )}

      <button
        onClick={randomizeAvatar}
        className="mt-4 w-fit rounded-2xl border-2 border-orange-700 bg-orange-100 p-2 font-semibold text-orange-700"
      >
        Randomize avatar
      </button>

      <div className="grid">
        <button className="flex justify-self-end">
          <Bin onClick={clearProfile} fontSize="26px" />
          <CrossCircle fontSize="26px" onClick={onClose} />
        </button>
      </div>
    </div>
  );
};

export default EditProfile;
