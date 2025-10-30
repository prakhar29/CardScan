"use client";

import { useState } from "react";
import { SessionProvider, useSession, signIn, signOut } from "next-auth/react";

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

const EmailModal = ({
  show,
  onClose,
  email,
  personalName,
}: {
  show: boolean;
  onClose: () => void;
  email: string;
  personalName: string;
}) => {
  const { data: session } = useSession();
  const [subject, setSubject] = useState(`Following up`);
  const [body, setBody] = useState(
    `Hi ${personalName},\n\nIt was great connecting with you. Let's keep in touch.\n\nBest,\n[Your Name]`
  );

  if (!show) {
    return null;
  }

  const handleSend = async () => {
    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: email,
          subject,
          body,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send email.");
      }

      alert("Email sent successfully!");
      onClose();
    } catch (error) {
      console.error("Error sending email:", error);
      alert("Failed to send email. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white dark:bg-gray-800">
        <div className="mt-3 text-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
            Send Email to {personalName}
          </h3>
          {!session ? (
            <div className="mt-4">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                You need to sign in with Google to send emails.
              </p>
              <button
                onClick={() => signIn("google")}
                className="px-4 py-2 bg-blue-600 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Sign in with Google
              </button>
            </div>
          ) : (
            <>
              <div className="mt-2 px-7 py-3">
                <div className="mb-4 text-left">
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                <div className="mb-4 text-left">
                  <label
                    htmlFor="body"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Body
                  </label>
                  <textarea
                    id="body"
                    rows={10}
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
              <div className="items-center px-4 py-3">
                <button
                  id="send-btn"
                  onClick={handleSend}
                  className="px-4 py-2 bg-blue-600 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Send
                </button>
                <button
                  id="cancel-btn"
                  onClick={onClose}
                  className="mt-3 px-4 py-2 bg-gray-200 text-gray-800 text-base font-medium rounded-md w-full shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
                >
                  Cancel
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState<ExtractedData | null>(
    null
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showEmailModal, setShowEmailModal] = useState(false);

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

  const handleSendEmail = () => {
    setShowEmailModal(true);
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
              {extractedText.email && (
                <button
                  onClick={handleSendEmail}
                  className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Email
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      {extractedText && (
        <EmailModal
          show={showEmailModal}
          onClose={() => setShowEmailModal(false)}
          email={extractedText.email}
          personalName={extractedText.personalName}
        />
      )}
    </div>
  );
}

export default function HomePage() {
  return (
    <SessionProvider>
      <Home />
    </SessionProvider>
  );
}
