"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DesignCard from "@/components/designCard";
import { ArrowRightIcon } from "@heroicons/react/24/outline";

const MarketplaceHighlights = () => {
  const [designs, setDesigns] = useState([]);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const fetchDesigns = async () => {
      setIsLoading(true); // Start loading
      try {
        const response = await fetch("/api/designs", { method: "GET" });
        if (!response.ok) {
          throw new Error("Failed to fetch designs");
        }
        const fetchedDesigns = await response.json();
        setDesigns(fetchedDesigns.reverse().slice(0, 5));
      } catch (error) {
        console.error("Failed to fetch designs:", error);
        setHasError(true);
      }
      setIsLoading(false); // End loading
    };

    fetchDesigns();
  }, []);

  const handleViewAll = () => {
    router.push("/marketplace");
  };

  const SkeletonPlaceholder = () => (
    <div className="animate-pulse flex flex-wrap justify-center gap-4">
      {[...Array(5)].map((_, index) => (
        <div
          key={index}
          className="w-[14rem] h-[22rem] my-5 mx-5 rounded-2xl bg-gray-300"
        ></div>
      ))}
    </div>
  );

  return (
    <div className="flex flex-col flex-grow py-20 gradient-bg-marketplacehl">
      <div className="flex flex-grow flex-col items-start justify-start mt-20">
        <h1 className="text-3xl sm:text-5xl text-gradient">
          Latest Collections
        </h1>
        <div className="flex items-center justify-between w-full my-8">
          {isLoading ? (
            <SkeletonPlaceholder />
          ) : hasError ? (
            <p className="text-red-500">Failed to load collections.</p>
          ) : designs.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 justify-center items-center">
                {designs.map((design) => (
                  <DesignCard
                    key={design._id}
                    designItem={{
                      id: design._id,
                      image: `data:image/jpeg;base64,${Buffer.from(
                        design.image.data
                      ).toString("base64")}`,
                      name: design.prompt,
                      likes: 10,
                    }}
                    title="Latest Collection"
                  />
                ))}
              </div>
              <div className="flex flex-col items-center justify-center gap-2 ml-10">
                <button
                  className="flex items-center justify-center bg-blue-500 text-white py-2 px-4 rounded-full cursor-pointer hover:bg-blue-700 transition duration-300 ease-in-out"
                  onClick={handleViewAll}
                >
                  View All
                  <ArrowRightIcon className="h-4 w-4 ml-2" />
                </button>
              </div>
            </>
          ) : (
            <p>No collections available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarketplaceHighlights;
