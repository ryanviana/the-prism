import React, { useState } from "react";
import Image from "next/image";

const ArtGenerator = () => {
  const [option, setOption] = useState("text"); // "text" or "sketch"
  const [prompt, setPrompt] = useState("");
  const [sketch, setSketch] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [latestDesign, setLatestDesign] = useState(null);

  const handleOptionChange = (newOption) => {
    setOption(newOption);
    setPrompt("");
    setSketch(null);
    setShowResult(false);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setShowResult(true);

    try {
      let body;
      if (option === "text") {
        body = JSON.stringify({ prompt });
      } else if (option === "sketch") {
        const formData = new FormData();
        formData.append("sketch", sketch);
        body = formData;
      }

      const createResponse = await fetch("/api/designs", {
        method: "POST",
        headers:
          option === "text" ? { "Content-Type": "application/json" } : {},
        body,
      });

      if (!createResponse.ok) {
        throw new Error("Failed to create design");
      }

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

    setLoading(false);
  };

  const imageToBase64 = (imageData) => {
    return btoa(String.fromCharCode(...new Uint8Array(imageData)));
  };

  const LoadingPlaceholder = () => (
    <div className="animate-pulse flex flex-col items-center justify-center h-40 w-full blue-glassmorphism rounded-lg">
      <div className="text-lg text-gray-500">Your art is being created...</div>
    </div>
  );

  const handleSketchUpload = (event) => {
    setSketch(event.target.files[0]);
    setShowResult(false);
  };

  return (
    <div className="flex flex-col sm:min-w-[700px] items-center justify-center sm:px-5 px-2">
      <div className="blue-glassmorphism rounded-3xl shadow-md shadow-secondary border border-base-300 flex flex-col p-5 w-full">
        <div className="flex flex-col gap-3 py-5 first:pt-0 last:pb-1">
          <p className="font-medium my-0 break-words text-white">
            AI Art Generator
          </p>
          <div className="flex justify-center gap-4 mb-4">
            <button
              onClick={() => handleOptionChange("text")}
              className={`px-4 py-2 rounded-full ${
                option === "text"
                  ? "bg-blue-300 text-white"
                  : "bg-transparent border border-blue-300 text-blue-300"
              } transition duration-200`}
            >
              Create from Text
            </button>
            <button
              onClick={() => handleOptionChange("sketch")}
              className={`px-4 py-2 rounded-full ${
                option === "sketch"
                  ? "bg-blue-300 text-white"
                  : "bg-transparent border border-blue-300 text-blue-300"
              } transition duration-200`}
            >
              Create from Sketch
            </button>
          </div>
          {option === "text" ? (
            <div className="flex flex-row items-center gap-1.5 w-full">
              <div className="flex border-2 border-base-300 blue-glassmorphism rounded-full w-full">
                <input
                  className="input input-ghost border-none focus:outline-none focus:ring-0 h-[2.2rem] min-h-[2.2rem] px-4 w-full font-medium text-gray-400 bg-transparent placeholder:text-gray-400"
                  placeholder="Describe your art idea"
                  onChange={(e) => setPrompt(e.target.value)}
                  value={prompt}
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center w-full">
              <input
                type="file"
                accept="image/*"
                onChange={handleSketchUpload}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {sketch && (
                <div className="mt-4 text-gray-400">
                  Selected file: {sketch.name}
                </div>
              )}
            </div>
          )}
          <div className="flex justify-center mt-4">
            <button
              type="button"
              onClick={handleSubmit}
              className="bg-transparent border border-blue-300 text-blue-300 px-3 py-1 text-sm rounded-full hover:bg-blue-300 hover:text-white transition duration-200"
            >
              Create
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
            <div className="text-white">No art generated yet.</div>
          )}
        </div>
      )}
    </div>
  );
};

export default ArtGenerator;
