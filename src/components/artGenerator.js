"use client";

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
  const [imageId, setImageId] = useState(null); // State to hold the image ID
  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility
  const [paymentLoading, setPaymentLoading] = useState(false); // State for payment loading
  const [email, setEmail] = useState(""); // State to hold the user's email

  const handleSubmit = async () => {
    setLoading(true);
    setShowResult(true);

    try {
      let response;

      if (option === "text") {
        response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/images/txt2shirt/preview`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt }),
          }
        );
      } else if (option === "sketch") {
        // Handle sketch upload
      }

      if (!response.ok) {
        throw new Error("Failed to create design");
      }

      const data = await response.json();

      setLatestDesign({
        image: data.previewImg,
      });

      // Save the image ID
      setImageId(data.id);
    } catch (error) {
      console.error("Failed to create or fetch designs", error);
    }

    setLoading(false);
  };

  const handlePayment = async () => {
    if (!imageId || !email) {
      console.error("No image ID or email found, cannot proceed with payment.");
      return;
    }

    setIsModalOpen(true); // Open modal during payment processing
    setPaymentLoading(true); // Show loading screen during payment processing

    try {
      const stampResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/images/txt2shirt/stamp/${imageId}`,
        {
          method: "POST",
        }
      );

      if (!stampResponse.ok) {
        throw new Error("Failed to create stamp");
      }

      const paymentData = {
        itemTitle: "Design The Prism",
        itemPrice: 0.15,
        backUrlSuccess: process.env.NEXT_PUBLIC_SUCCESS_FRONTEND_URL,
        externalReference: imageId,
        notificationUrl: process.env.NEXT_PUBLIC_NOTIFICATION_URL,
        payerEmail: email, // Pass the user's email
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/payments/image/${imageId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(paymentData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create payment");
      }

      const data = await response.json();

      // Open payment page in a new tab
      const paymentTab = window.open(data.init_point, "_blank");

      if (paymentTab) {
        // Poll the payment status every 5 seconds
        const paymentCheckInterval = setInterval(async () => {
          try {
            const paymentInfoResponse = await fetch(
              `${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${imageId}/paymentInfo`,
              {
                method: "GET",
                headers: { "Content-Type": "application/json" },
              }
            );

            if (paymentInfoResponse.ok) {
              const paymentInfo = await paymentInfoResponse.json();

              if (paymentInfo.paymentStatus === "APPROVED") {
                clearInterval(paymentCheckInterval); // Stop polling
                paymentTab.close(); // Close the payment tab
                window.location.href = "/success"; // Redirect to success page
              }
            } else {
              console.error("Failed to fetch payment status.");
            }
          } catch (error) {
            console.error("Error fetching payment status:", error);
          }
        }, 5000); // Poll every 5 seconds
      } else {
        // Fallback: redirect in the same tab if the new tab couldn't be opened
        window.location.href = data.init_point;
      }
    } catch (error) {
      console.error("Error creating payment:", error);
    } finally {
      setPaymentLoading(false); // Hide loading screen after payment processing
      setIsModalOpen(false); // Close modal after payment processing
    }
  };

  const LoadingPlaceholder = () => (
    <div className="animate-pulse flex flex-col items-center justify-center h-40 w-full blue-glassmorphism rounded-lg">
      <div className="text-lg text-gray-500">Your art is being created...</div>
    </div>
  );

  const PaymentLoadingPlaceholder = () => (
    <div className="flex flex-col items-center justify-center text-center h-40 w-full space-y-4">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-300"></div>
      <div className="text-lg text-gray-700">
        Crafting your stamp... <br /> Robots are doing their jobs...
      </div>
    </div>
  );

  const handleSketchUpload = (event) => {
    const file = event.target.files[0];
    setSketch(file);
    setShowResult(false);
  };

  const handleModalSubmit = () => {
    if (email) {
      handlePayment(); // Proceed with payment once the email is entered
    } else {
      alert("Please enter your email.");
    }
  };

  return (
    <div className="flex flex-col sm:min-w-[700px] items-center justify-center sm:px-5 px-2">
      <div className="blue-glassmorphism rounded-3xl shadow-md shadow-secondary border border-base-300 flex flex-col p-5 w-full">
        <div className="flex flex-col gap-3 py-5 first:pt-0 last:pb-1">
          <div className="flex justify-center gap-4 mb-4"></div>
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
              {paymentLoading ? (
                <PaymentLoadingPlaceholder />
              ) : (
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)} // Open modal to ask for email
                  className="mt-4 bg-blue-500 text-white px-4 py-2 text-lg rounded-full hover:bg-blue-600 transition duration-200 mb-6"
                >
                  Buy Design
                </button>
              )}
            </div>
          ) : (
            <div className="text-white">No art generated yet.</div>
          )}
        </div>
      )}

      {/* Modal for email input and payment loading */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 w-full max-w-md text-center">
            {!paymentLoading ? (
              <>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  Enter Your Email
                </h2>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2 w-full mb-4"
                  placeholder="Enter your email"
                />
                <button
                  onClick={handleModalSubmit}
                  className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition duration-200"
                >
                  Proceed with Payment
                </button>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  Processing Payment
                </h2>
                <PaymentLoadingPlaceholder />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ArtGenerator;
