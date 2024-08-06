"use client";

import React from "react";
import Hero from "@/components/hero";
import ArtGenerator from "@/components/ArtGenerator";
import ActionSections from "@/components/actionSections";
import MarketplaceHighlights from "@/components/marketplaceHighlights";

const Home = () => {
  return (
    <div className="flex items-center flex-col flex-grow">
      <div className="flex flex-grow flex-col items-center w-full pt-32 pb-20 gradient-bg-welcome">
        <div className="flex sm:flex-row flex-col sm:items-start items-center sm:justify-start justify-start">
          <Hero />
          <ArtGenerator />
        </div>
      </div>
      <ActionSections />
      <MarketplaceHighlights />
    </div>
  );
};

export default Home;
