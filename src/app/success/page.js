"use client";

import { useRouter } from "next/navigation";
import { AiOutlineCheckCircle } from "react-icons/ai";

const SuccessPage = () => {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="blue-glassmorphism shadow-lg rounded-3xl p-8 md:p-12 max-w-lg w-full">
        <div className="flex flex-col items-center">
          <AiOutlineCheckCircle className="text-blue-300 text-6xl mb-4" />
          <h1 className="text-2xl md:text-3xl font-semibold text-center text-white mb-4">
            Purchase Successful!
          </h1>
          <p className="text-center text-gray-400 mb-6">
            Thank you for your purchase. Your image has been sent to your email
            and should arrive in a few minutes. Please check your inbox.
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
