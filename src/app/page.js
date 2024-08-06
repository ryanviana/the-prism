"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Hero from "@/components/hero";
import ActionSections from "@/components/actionSections";
import MarketplaceHighlights from "@/components/marketplaceHighlights";

const Home = () => {
  const router = useRouter();

  const handleNavigateToArtPage = () => {
    router.push("/art");
  };

  return (
    <div className="flex items-center flex-col flex-grow py-20">
      <Hero />
      <div className="w-full flex justify-center py-10">
        <button
          onClick={handleNavigateToArtPage}
          className="bg-transparent border border-blue-300 text-blue-300 px-4 py-2 text-lg rounded-full hover:bg-blue-300 hover:text-white transition duration-200"
        >
          Create your customized T-Shirt Right now
        </button>
      </div>
      <div className="w-full flex justify-center"></div>
      <ActionSections />
      <MarketplaceHighlights />
    </div>
  );
};

export default Home;
