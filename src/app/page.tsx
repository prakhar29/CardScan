"use client";

import { useState } from "react";

interface ExtractedData {
  companyName: string;
  personalName: string;
  designation: string;
  phone1: string;
  phone2: string;
  phone3: string;
  email: string;
  website: string;
  address: string;
}

function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState<ExtractedData | null>(
    null
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setExtractedText(null);
      setError(null);
    }
  };

  const handleSendWhatsApp = (phone: string) => {
    const cleanedPhone = phone.replace(/\D/g, "");
    if (cleanedPhone) {
      const whatsappUrl = `https://wa.me/${cleanedPhone}`;
      window.open(whatsappUrl, "_blank");
    } else {
      setError("Invalid phone number to send WhatsApp message.");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file first.");
      return;
    }

    setIsProcessing(true);
    setError(null);
    setExtractedText(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image.");
      }

      const data = await response.json();
      setExtractedText(data.data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-100">
          Business Card Scanner
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-400">
          Upload an image of a business card to extract the information.
        </p>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="file-upload"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Upload Image
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="flex text-sm text-gray-600 dark:text-gray-400">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                  >
                    <span>Upload a file</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      onChange={handleFileChange}
                      accept="image/*"
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
            </div>
            {file && (
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Selected file: {file.name}
              </p>
            )}
          </div>

          <button
            onClick={handleUpload}
            disabled={!file || isProcessing}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {isProcessing ? "Processing..." : "Extract Information"}
          </button>
        </div>

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

        {extractedText && (
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Extracted Information
            </h2>
            <p className="text-sm text-green-600 dark:text-green-400">
              Successfully saved to Google Sheets.
            </p>
            <div className="mt-2 text-sm text-gray-600 dark:text-gray-300 space-y-1">
              {extractedText.personalName && (
                <p>
                  <strong>Name:</strong> {extractedText.personalName}
                </p>
              )}
              {extractedText.companyName && (
                <p>
                  <strong>Company:</strong> {extractedText.companyName}
                </p>
              )}
              {extractedText.designation && (
                <p>
                  <strong>Designation:</strong> {extractedText.designation}
                </p>
              )}
              {extractedText.phone1 && (
                <p>
                  <strong>Phone 1:</strong> {extractedText.phone1}
                </p>
              )}
              {extractedText.phone2 && (
                <p>
                  <strong>Phone 2:</strong> {extractedText.phone2}
                </p>
              )}
              {extractedText.phone3 && (
                <p>
                  <strong>Phone 3:</strong> {extractedText.phone3}
                </p>
              )}
              {extractedText.email && (
                <p>
                  <strong>Email:</strong> {extractedText.email}
                </p>
              )}
              {extractedText.website && (
                <p>
                  <strong>Website:</strong>{" "}
                  <a
                    href={extractedText.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:underline"
                  >
                    {extractedText.website}
                  </a>
                </p>
              )}
              {extractedText.address && (
                <p>
                  <strong>Address:</strong> {extractedText.address}
                </p>
              )}
            </div>
            <div className="mt-4 flex space-x-2">
              {extractedText.phone1 && (
                <button
                  onClick={() => handleSendWhatsApp(extractedText.phone1)}
                  className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  WhatsApp
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function HomePage() {
  return <Home />;
}
