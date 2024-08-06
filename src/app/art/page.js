"use client";

import React from "react";
import ArtGenerator from "@/components/artGenerator";

const ArtPage = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen py-20 gradient-bg-welcome">
      <div className="text-center mb-10">
        <h1 className="text-4xl sm:text-6xl font-bold text-white mb-5">
          Create Your Custom Artwork
        </h1>
        <p className="text-lg sm:text-xl text-gray-300">
          Use our AI-powered tool to design your unique t-shirt. Simply describe
          your idea, and our AI will generate a custom artwork for you.
        </p>
      </div>
      <div className="w-full max-w-3xl">
        <ArtGenerator />
      </div>
      <div className="mt-10 text-center">
        <p className="text-gray-400">
          Want to see your artwork on other products? Contact us for more
          customization options!
        </p>
        <button className="mt-4 bg-transparent border border-blue-300 text-blue-300 px-4 py-2 rounded-full hover:bg-blue-300 hover:text-white transition duration-200">
          Contact Us
        </button>
      </div>
    </div>
  );
};

export default ArtPage;
