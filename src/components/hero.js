"use client";

import React from "react";

const Hero = () => {
  return (
    <div className="flex flex-col justify-center items-center px-4">
      <div className="flex flex-col max-w-[600px] items-start justify-start gap-2">
        <h1 className="text-3xl sm:text-5xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          Create your unique art. <br /> Make it your own t-shirt.
        </h1>
        <p className="text-left font-light text-lg my-0 text-gray-300">
          Make your ideas the art you always dreamed about with our AI tool.{" "}
          <br />
          Then, easily bring those designs to life through expert producers.
        </p>
      </div>
    </div>
  );
};

export default Hero;
