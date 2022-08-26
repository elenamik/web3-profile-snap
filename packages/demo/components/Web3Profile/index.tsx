import * as React from "react";
import { isSnapInstalled } from "./utils";
import { QueryClientProvider, QueryClient, useQuery } from "react-query";
import EditProfile from "./EditProfile";
import { ProfileRenderer } from "./ProfileRenderer";
import { useWeb3React } from "@web3-react/core";
import { Web3Provider } from "@ethersproject/providers";

/***
 * Initial Setup for Rendering Details of Snap
 */
declare global {
  interface Window {
    ethereum: {
      isMetaMask: boolean;
      request: <T>(request: { method: string; params?: any[] }) => Promise<T>;
      on: (eventName: unknown, callback: unknown) => unknown;
    };
  }
}
export const snapId = process.env.NEXT_PUBLIC_SNAP_ID ?? "";
if (snapId === "") {
  console.error("Please add snap ID in .env.local");
}
/***
 * End of setup
 */

const Web3Profile: React.FC = () => {
  const [mode, setMode] = React.useState<"VIEW" | "EDIT" | "UNINSTALLED">(
    "UNINSTALLED"
  );

  const installSnap = async (snapId: string) => {
    try {
      await window?.ethereum?.request({
        method: "wallet_enable",
        params: [
          {
            [`wallet_snap_${snapId}`]: {},
          },
        ],
      });
      setMode("VIEW");
    } catch (err) {
      console.error("Failed to install snap, please try again");
    }
  };

  React.useEffect(() => {
    const checkInstalled = async () => {
      const result = await isSnapInstalled(snapId);
      if (result) {
        setMode("VIEW");
      }
    };
    if (window.ethereum) {
      checkInstalled();
    }
  }, []);

  if (mode === "UNINSTALLED") {
    return (
      <div>
        Not installed.
        <button
          onClick={() => {
            installSnap(snapId);
          }}
        >
          Click here to install snap
        </button>
      </div>
    );
  } else if (mode === "EDIT") {
    return <EditProfile onClose={() => setMode("VIEW")} />;
  }
  return (
    <ProfileRenderer
      handleEdit={() => {
        setMode("EDIT");
      }}
    />
  );
};

export const Wrapped = () => {
  const [queryClient] = React.useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <Web3Profile />
    </QueryClientProvider>
  );
};

export default Wrapped;
