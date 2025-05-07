"use client";

import React from "react";
import { useWallet } from "@solana/wallet-adapter-react";

import {
  Preloader,
  Mouse,
  PopUp,
  Footer,
  Header,
  Hero,
  Tokens,
} from "@/components";


export default function Home() {
  const {
    publicKey,
  } = useWallet();

  // function removeLastItemFromLocalStorage() {
  //   const storedArray = localStorage.getItem("SOLANA_NFTS");
  //   if (storedArray) {
  //     const array = JSON.parse(storedArray);
  //     array.pop();
  //     const updatedArray = JSON.stringify(array);
  //     localStorage.setItem("SOLANA_NFTS", updatedArray);
  //   }
  // }

  return (
    <>
      <Preloader />
      <div id="wrapper">
        <div id="page" className="pt-40">
          <Header />
          <Hero />
          {/* ZK Compression cToken Mint/Claim UI */}
          {publicKey && <Tokens publicKey={publicKey} />}
          {/* End ZK Compression UI */}
    
          {/* {nfts?.length && publicKey ? <Featured nfts={nfts} publicKey={publicKey} /> : null}          */}
          {/* {publicKey && <Action publicKey={publicKey} />} */}
          {/* {publicKey && <Discover nfts={nfts} publicKey={publicKey} />} */}
          <Footer />
        </div>
        <PopUp />
      </div>
      <Mouse />
    </>
  );
}