import Image from "next/image";
import { useState } from "react";

const ArtGenerator = () => {
  const [option, setOption] = useState("text"); // "text" or "sketch"
  const [prompt, setPrompt] = useState("");
  const [auxPrompt, setAuxPrompt] = useState(""); // Auxiliary prompt for sketches
  const [sketch, setSketch] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [latestDesign, setLatestDesign] = useState(null);

  const handleOptionChange = (newOption) => {
    setOption(newOption);
    setPrompt("");
    setAuxPrompt("");
    setSketch(null);
    setShowResult(false);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setShowResult(true);

    try {
      let response;

      if (option === "text") {
        response = await fetch("/api/txt-to-img", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt }),
        });
      } else if (option === "sketch") {
        const formData = new FormData();
        formData.append("file", sketch);
        formData.append("prompt", auxPrompt);

        let uploadResponse;
        try {
          uploadResponse = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          });
        } catch (uploadError) {
          console.error("Upload request failed:", uploadError);
          throw uploadError;
        }

        console.log("Upload response received:", uploadResponse);

        if (!uploadResponse.ok) {
          throw new Error(
            `Upload failed with status: ${uploadResponse.status}`
          );
        }

        let uploadData;
        try {
          uploadData = await uploadResponse.json();
        } catch (parseError) {
          console.error("Failed to parse upload response as JSON:", parseError);
          throw parseError;
        }

        console.log("LOG: Uploaded sketch file:", uploadData);

        const bodySketch = JSON.stringify({
          prompt: auxPrompt,
          sketchPath: uploadData.filepath,
        });

        try {
          response = await fetch("/api/sketch-to-img", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: bodySketch,
          });
        } catch (fetchError) {
          console.error("Sketch-to-img request failed:", fetchError);
          throw fetchError;
        }
      }

      if (!response.ok) {
        throw new Error("Failed to create design");
      }

      const data = await response.json();

      setLatestDesign({
        image: data.artifacts[0].base64, // Assuming backend returns this key
      });
    } catch (error) {
      console.error("Failed to create or fetch designs", error);
    }

    setLoading(false);
  };

  const LoadingPlaceholder = () => (
    <div className="animate-pulse flex flex-col items-center justify-center h-40 w-full blue-glassmorphism rounded-lg">
      <div className="text-lg text-gray-500">Your art is being created...</div>
    </div>
  );

  const handleSketchUpload = (event) => {
    const file = event.target.files[0];
    setSketch(file);
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
            <div className="flex flex-col items-center w-full gap-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleSketchUpload}
                className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {sketch && (
                <div className="text-gray-400">
                  Selected file: {sketch.name}
                </div>
              )}
              <div className="flex flex-row items-center gap-1.5 w-full">
                <div className="flex border-2 border-base-300 blue-glassmorphism rounded-full w-full">
                  <input
                    className="input input-ghost border-none focus:outline-none focus:ring-0 h-[2.2rem] min-h-[2.2rem] px-4 w-full font-medium text-gray-400 bg-transparent placeholder:text-gray-400"
                    placeholder="Enter an auxiliary prompt"
                    onChange={(e) => setAuxPrompt(e.target.value)}
                    value={auxPrompt}
                  />
                </div>
              </div>
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
                    src={`data:image/png;base64,${latestDesign.image}`} // Ensure the correct image format
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
