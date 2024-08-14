"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AiOutlineCheckCircle } from "react-icons/ai";

const SuccessPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState(null);

  const externalReference = searchParams.get("external_reference");

  console.log("externalReference", externalReference);

  useEffect(() => {
    const fetchEmail = async () => {
      if (externalReference) {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${externalReference}`,
            {
              method: "GET",
              headers: { "Content-Type": "application/json" },
            }
          );

          console.log("response", response);

          if (response.ok) {
            const data = await response.json();
            console.log("Fetched Data:", data); // Log the data to inspect its structure
            console.log("Payment Email:", data.paymentEmail);
            setEmail(data.paymentEmail);
          } else {
            console.error("Failed to fetch payment details.");
          }
        } catch (error) {
          console.error("Error fetching payment details:", error);
        }
      }
    };

    fetchEmail();
  }, [externalReference]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="blue-glassmorphism shadow-lg rounded-3xl p-8 md:p-12 max-w-lg w-full">
        <div className="flex flex-col items-center">
          <AiOutlineCheckCircle className="text-blue-300 text-6xl mb-4" />
          <h1 className="text-2xl md:text-3xl font-semibold text-center text-white mb-4">
            Purchase Successful!
          </h1>
          <p className="text-center text-gray-400 mb-6">
            {email
              ? `Thank you for your purchase. Your image has been sent to ${email} and should arrive in a few minutes. Please check your inbox.`
              : "Thank you for your purchase. Your image is being processed."}
          </p>
          <button
            onClick={() => router.push("/")}
            className="bg-transparent border border-blue-300 text-blue-300 px-4 py-2 text-lg rounded-full hover:bg-blue-300 hover:text-white transition duration-200"
          >
            Go Back Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
