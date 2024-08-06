import React, { useState } from "react";
import Image from "next/image";

const ArtGenerator = () => {
  const [prompt, setPrompt] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [latestDesign, setLatestDesign] = useState(null);

  const handleSubmit = async () => {
    setLoading(true); // Start loading
    setShowResult(true); // Immediately show result area
    try {
      // Create a new design with the provided prompt using the API route
      const createResponse = await fetch("/api/designs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!createResponse.ok) {
        throw new Error("Failed to create design");
      }

      // Fetch the latest design to update the UI
      const fetchResponse = await fetch("/api/designs");
      if (!fetchResponse.ok) {
        throw new Error("Failed to fetch designs");
      }

      const designs = await fetchResponse.json();
      const newLatestDesign = designs[designs.length - 1];
      setLatestDesign(newLatestDesign);
    } catch (error) {
      console.error("Failed to create or fetch designs", error);
    }
    setLoading(false); // End loading
  };

  // Helper function to convert image data to base64 string
  const imageToBase64 = (imageData) => {
    return btoa(String.fromCharCode(...new Uint8Array(imageData)));
  };

  const LoadingPlaceholder = () => (
    <div className="animate-pulse flex flex-col items-center justify-center h-40 w-full blue-glassmorphism rounded-lg">
      <div className="text-lg text-gray-500">Your art is being created...</div>
    </div>
  );

  return (
    <div className="flex flex-col sm:min-w-[700px] items-center justify-center sm:px-5 px-2">
      <div className="blue-glassmorphism rounded-3xl shadow-md shadow-secondary border border-base-300 flex flex-col p-5 w-full">
        <div className="flex flex-col gap-3 py-5 first:pt-0 last:pb-1">
          <p className="font-medium my-0 break-words">AI Art Generator</p>
          <div className="flex flex-row items-center gap-1.5 w-full">
            <div className="flex border-2 border-base-300 blue-glassmorphism rounded-full text-accent w-full">
              <input
                className="input input-ghost focus-within:border-transparent focus:outline-none focus:bg-transparent focus:text-gray-400 h-[2.2rem] min-h-[2.2rem] px-4 border w-full font-medium placeholder:text-accent/50 text-gray-400"
                placeholder="Describe your art idea"
                onChange={(e) => setPrompt(e.target.value)}
                value={prompt}
              />
            </div>
            <button
              type="button"
              onClick={handleSubmit}
              className="btn btn-secondary btn-sm"
            >
              Create Art ✨
            </button>
          </div>
        </div>
      </div>
      {showResult && (
        <div className="w-full mt-4 flex flex-col items-center gap-4">
          {loading ? (
            <LoadingPlaceholder />
          ) : latestDesign ? (
            <div className="flex flex-col items-center w-full blue-glassmorphism shadow-lg image-full">
              <div className="card-body p-6">
                <figure>
                  <Image
                    src={`data:image/jpeg;base64,${imageToBase64(
                      latestDesign.image.data
                    )}`}
                    alt="Generated Art"
                    width={200}
                    height={200}
                    objectFit="cover"
                  />
                </figure>
              </div>
            </div>
          ) : (
            <div>No art generated yet.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default ArtGenerator;
