import type { NextPage } from "next";
import Head from "next/head";
import * as React from "react";
import Web3Profile from "../components/Web3Profile";
import { useWeb3React } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";
import { Web3Provider } from "@ethersproject/providers";

const Home: NextPage = () => {
  const injectedConnector = new InjectedConnector({ supportedChainIds: [1] });
  const { activate, account, deactivate } = useWeb3React<Web3Provider>();
  const handleConnect = () => {
    activate(injectedConnector);
  };

  return (
    <div className="flex w-full flex-col items-center p-2">
      <Head>
        <title>Web3 Profile Snap Demo</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex w-fit flex-col content-center justify-center p-4">
        <h1 className="pt-20 text-4xl font-semibold">
          Welcome to the Web3 Profile Snap Demo!
        </h1>

        {!account ? (
          <button onClick={handleConnect}>Connect Wallet</button>
        ) : (
          <div className="text-center">
            <span>{account} connected</span>
            <br />
            <button onClick={deactivate}>Disconnect Wallet</button>
          </div>
        )}

        <p className="pt-2">
          Get started by enabling the snap, if you have not done so already.
          <br />
          To change your image, click the edit button.
        </p>

        <h2 className="flex w-full flex-col content-center justify-center pt-10">
          <div className="w-fit text-3xl font-semibold">Demo</div>
          <div className="w-fit rounded-2xl border p-4">
            <Web3Profile />
          </div>
        </h2>
      </main>
    </div>
  );
};

export default Home;
