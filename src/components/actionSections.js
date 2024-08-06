"use client";

import {
  CubeIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";

const ActionSections = () => {
  return (
    <div className="flex-grow w-full gradient-bg-pitch px-8">
      <div className="flex flex-1 flex-col justify-start items-center mx-auto mt-24">
        <h1 className="text-3xl sm:text-5xl py-2 text-center text-gradient bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          Revolutionizing Digital <br /> Art and Fashion
        </h1>
        <p className="text-center my-2 font-light sm:w-1/2 w-full text-lg px-4 text-gray-300">
          Dive into the future where creativity meets technology. Generate and
          turn your AI-powered art into tangible products, then wear your
          innovation with custom-designed t-shirts.
        </p>
      </div>
      <div className="flex justify-center items-center gap-12 flex-col sm:flex-row mt-6">
        <div className="flex flex-col white-glassmorphism px-10 py-10 text-center items-center max-w-sm rounded-3xl">
          <GlobeAltIcon className="h-8 w-8 text-blue-500" />
          <p className="text-white">
            Create art using AI technology and express your creativity like
            never before.
          </p>
        </div>
        <div className="flex flex-col white-glassmorphism px-10 py-10 text-center items-center max-w-sm rounded-3xl">
          <ShieldCheckIcon className="h-8 w-8 text-green-500" />
          <p className="text-white">
            Ensure the uniqueness of your creations with secure and transparent
            processes.
          </p>
        </div>
        <div className="flex flex-col white-glassmorphism px-10 py-10 text-center items-center max-w-sm rounded-3xl">
          <CubeIcon className="h-8 w-8 text-purple-500" />
          <p className="text-white">
            Bring your digital creations to life through customized fashion
            pieces.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ActionSections;
