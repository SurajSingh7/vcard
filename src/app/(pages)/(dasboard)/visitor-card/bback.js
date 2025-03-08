"use client";

import React, { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

const videoConstraints = {
  width: 1920, // Full HD width
  height: 1080, // Full HD height
  facingMode: "environment",
};

const VisitorCardForm = () => {
  // Front camera states
  const [capturedFront, setCapturedFront] = useState("");
  const [isCameraOnFront, setIsCameraOnFront] = useState(true);
  const [isFrontVideoReady, setIsFrontVideoReady] = useState(false);

  // Back camera states
  const [capturedBack, setCapturedBack] = useState("");
  const [isCameraOnBack, setIsCameraOnBack] = useState(true);
  const [isBackVideoReady, setIsBackVideoReady] = useState(false);

  // State for toggling active capture view
  const [activeCapture, setActiveCapture] = useState("front");

  // Other form fields
  const [name, setName] = useState("");
  const [sedulertime, setSedulertime] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [note, setNote] = useState("");
  const [assignTo, setAssignTo] = useState("");

  // States for user and dropdown data
  const [userName, setUserName] = useState("");
  const [dropdownOptions, setDropdownOptions] = useState([]);
  const [dropdownLoading, setDropdownLoading] = useState(false);
  const [contactError, setContactError] = useState("");

  // State to track form submission
  const [isSubmitting, setIsSubmitting] = useState(false);

  // NEW: State to handle full image preview modal
  const [previewImage, setPreviewImage] = useState("");

  const router = useRouter();
  const webcamRefFront = useRef(null);
  const webcamRefBack = useRef(null);

  // Load user data from local storage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        if (userData?.name || userData?.userName) {
          setUserName(userData.userName || "");
          const combined = userData.userName ? `${userData.userName}` : "";
          setAssignTo(combined);
        }
      } catch (error) {
        console.error("Failed to parse local storage data for user:", error);
      }
    }
  }, []);

  // If the user userName is "hi@gmail.com", fetch dropdown options
  useEffect(() => {
    if (userName === "hi@gmail.com") {
      setDropdownLoading(true);
      fetch("/api/auth/signup")
        .then((res) => res.json())
        .then((data) => {
          const users = data.users || [];
          const filteredUsers = users.filter(
            (option) => option.userName !== "hi@gmail.com"
          );
          setDropdownOptions(filteredUsers);
          setAssignTo("");
          setDropdownLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching dropdown options:", error);
          setDropdownLoading(false);
        });
    }
  }, [userName]);

  // --- FRONT CAMERA FUNCTIONS ---
  const captureFront = () => {
    if (capturedFront) return;
    if (!isCameraOnFront) {
      turnOnCameraFront();
      return;
    }
    if (!isFrontVideoReady) {
      console.warn("Front webcam not ready yet.");
      return;
    }
    const imageSrc = webcamRefFront.current.getScreenshot();
    if (imageSrc) {
      setCapturedFront(imageSrc);
      turnOffCameraFront();
    } else {
      console.error("Failed to capture image. Front webcam not ready.");
    }
  };

  const removeFront = () => {
    if (!capturedFront) return;
    setCapturedFront("");
    turnOnCameraFront();
  };

  const turnOffCameraFront = () => {
    const videoTrack =
      webcamRefFront.current?.video?.srcObject?.getTracks().find(
        (track) => track.kind === "video"
      );
    if (videoTrack) {
      videoTrack.stop();
    }
    setIsCameraOnFront(false);
    setIsFrontVideoReady(false);
  };

  const turnOnCameraFront = () => {
    setIsCameraOnFront(true);
  };

  // --- BACK CAMERA FUNCTIONS ---
  const captureBack = () => {
    if (capturedBack) return;
    if (!isCameraOnBack) {
      turnOnCameraBack();
      return;
    }
    if (!isBackVideoReady) {
      console.warn("Back webcam not ready yet.");
      return;
    }
    const imageSrc = webcamRefBack.current.getScreenshot();
    if (imageSrc) {
      setCapturedBack(imageSrc);
      turnOffCameraBack();
    } else {
      console.error("Failed to capture image. Back webcam not ready.");
    }
  };

  const removeBack = () => {
    if (!capturedBack) return;
    setCapturedBack("");
    turnOnCameraBack();
  };

  const turnOffCameraBack = () => {
    const videoTrack =
      webcamRefBack.current?.video?.srcObject?.getTracks().find(
        (track) => track.kind === "video"
      );
    if (videoTrack) {
      videoTrack.stop();
    }
    setIsCameraOnBack(false);
    setIsBackVideoReady(false);
  };

  const turnOnCameraBack = () => {
    setIsCameraOnBack(true);
  };

  // Auto turn off camera when tab visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        if (isCameraOnFront) turnOffCameraFront();
        if (isCameraOnBack) turnOffCameraBack();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [isCameraOnFront, isCameraOnBack]);

  // Handle date offset options
  const handleDateOffset = (days) => {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + days);
    const formattedDate = currentDate.toISOString().split("T")[0];
    setSedulertime(formattedDate);
  };

  // Helper function to resize image before saving so DB gets a lower resolution version
  const resizeImage = (base64Str, maxWidth, maxHeight) => {
    return new Promise((resolve) => {
      let img = new Image();
      img.src = base64Str;
      img.onload = () => {
        let canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;
        // Calculate new dimensions maintaining aspect ratio
        if (width > maxWidth) {
          height = height * (maxWidth / width);
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = width * (maxHeight / height);
          height = maxHeight;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        // Convert to JPEG for a smaller file size; adjust quality as needed
        const resizedDataUrl = canvas.toDataURL("image/jpeg", 0.7);
        resolve(resizedDataUrl);
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !sedulertime) {
      toast.error("Name and Scheduler Date are required");
      return;
    }
    if (!assignTo) {
      toast.error("Assign To is required");
      return;
    }
    if (contactNumber && !/^\d{10}$/.test(contactNumber)) {
      toast.error("Contact Number must be exactly 10 digits");
      return;
    }
    
    setIsSubmitting(true); // Start loading

    const formData = new FormData();
    // Resize images before appending to formData so saved images are not full resolution
    if (capturedFront) {
      const resizedFront = await resizeImage(capturedFront, 640, 360);
      formData.append("visitorCardFront", resizedFront);
    }
    if (capturedBack) {
      const resizedBack = await resizeImage(capturedBack, 640, 360);
      formData.append("visitorCardBack", resizedBack);
    }
    formData.append("name", name);
    formData.append("sedulertime", sedulertime);
    formData.append("contactNumber", contactNumber);
    formData.append("note", note);
    formData.append("assignTo", assignTo);

    try {
      const res = await fetch("/api/visitorcards", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        toast.success("Visitor Card Created!");
        // Delay refresh to allow toast to display properly
        setTimeout(() => {
          router.refresh();
          setIsSubmitting(false);
        }, 1500);
      } else {
        toast.error("Failed to create visitor card");
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow rounded-lg">
      <Toaster />
      <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">
        Create Visitor Card
      </h1>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-8"
      >
        {/* Column 1: Live Capture Fields */}
        <div className="space-y-8">
          <div className="flex justify-center space-x-4 mb-4">
            <button
              type="button"
              onClick={() => setActiveCapture("front")}
              className={`px-5 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                activeCapture === "front"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Visitor Card Front
            </button>
            <button
              type="button"
              onClick={() => setActiveCapture("back")}
              className={`px-5 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                activeCapture === "back"
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Visitor Card Back
            </button>
          </div>
          {activeCapture === "front" && (
            <div>
              <label className="block font-semibold text-gray-700 mb-2">
                Visitor Card Front (Live Capture)
              </label>
              <div className="relative bg-gray-100 border border-gray-300 rounded-lg overflow-hidden shadow-lg mx-auto">
                {isCameraOnFront ? (
                  <Webcam
                    ref={webcamRefFront}
                    screenshotFormat="image/png"
                    forceScreenshotSourceSize={true}
                    videoConstraints={videoConstraints}
                    onUserMedia={() => setIsFrontVideoReady(true)}
                    onUserMediaError={(error) => {
                      console.error("Front webcam error:", error);
                      setIsFrontVideoReady(false);
                    }}
                    className="w-full h-full object-contain rounded-lg"
                  />
                ) : capturedFront ? (
                  <img
                    src={capturedFront}
                    alt="Captured Front"
                    onClick={() => setPreviewImage(capturedFront)}
                    className="w-full h-full object-cover rounded-lg cursor-pointer"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500 font-medium">
                    Camera is Off
                  </div>
                )}
              </div>
              <div className="mt-4 flex justify-center">
                {!capturedFront ? (
                  <button
                    type="button"
                    onClick={captureFront}
                    disabled={!isFrontVideoReady}
                    className={`${
                      !isFrontVideoReady
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-indigo-600 hover:bg-indigo-700"
                    } text-white font-semibold px-6 py-3 rounded-lg shadow transition-all focus:ring-2 focus:ring-indigo-500 focus:outline-none`}
                  >
                    {isFrontVideoReady ? "Capture Front" : "Loading..."}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={removeFront}
                    className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-lg shadow transition-all focus:ring-2 focus:ring-red-500 focus:outline-none"
                  >
                    Remove Front
                  </button>
                )}
              </div>
            </div>
          )}
          {activeCapture === "back" && (
            <div>
              <label className="block font-semibold text-gray-700 mb-2">
                Visitor Card Back (Live Capture)
              </label>
              <div className="relative bg-gray-100 border border-gray-300 rounded-lg overflow-hidden shadow-lg mx-auto">
                {isCameraOnBack ? (
                  <Webcam
                    ref={webcamRefBack}
                    screenshotFormat="image/png"
                    forceScreenshotSourceSize={true}
                    videoConstraints={videoConstraints}
                    onUserMedia={() => setIsBackVideoReady(true)}
                    onUserMediaError={(error) => {
                      console.error("Back webcam error:", error);
                      setIsBackVideoReady(false);
                    }}
                    className="w-full h-full object-contain rounded-lg"
                  />
                ) : capturedBack ? (
                  <img
                    src={capturedBack}
                    alt="Captured Back"
                    onClick={() => setPreviewImage(capturedBack)}
                    className="w-full h-full object-cover rounded-lg cursor-pointer"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500 font-medium">
                    Camera is Off
                  </div>
                )}
              </div>
              <div className="mt-4 flex justify-center">
                {!capturedBack ? (
                  <button
                    type="button"
                    onClick={captureBack}
                    disabled={!isBackVideoReady}
                    className={`${
                      !isBackVideoReady
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-indigo-600 hover:bg-indigo-700"
                    } text-white font-semibold px-6 py-3 rounded-lg shadow transition-all focus:ring-2 focus:ring-indigo-500 focus:outline-none`}
                  >
                    {isBackVideoReady ? "Capture Back" : "Loading..."}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={removeBack}
                    className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-lg shadow transition-all focus:ring-2 focus:ring-red-500 focus:outline-none"
                  >
                    Remove Back
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
        <div className="space-y-6">
          <div>
            <label className="block font-medium text-gray-700">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter visitor's name"
              className="mt-1 block w-full border border-gray-300 rounded-md p-3 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block font-medium text-gray-700">
              Scheduler Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={sedulertime}
              onChange={(e) => setSedulertime(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-3 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
            <div className="bg-slate-50 flex justify-between items-center space-x-1 flex-wrap text-black border-2 font-semibold mx-auto py-2 rounded">
              Days:
              <button
                type="button"
                onClick={() => handleDateOffset(3)}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold px-3 py-1 rounded"
              >
                3
              </button>
              <button
                type="button"
                onClick={() => handleDateOffset(5)}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold px-3 py-1 rounded"
              >
                5
              </button>
              <button
                type="button"
                onClick={() => handleDateOffset(7)}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold px-3 py-1 rounded"
              >
                7
              </button>
              <button
                type="button"
                onClick={() => handleDateOffset(10)}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold px-3 py-1 rounded"
              >
                10
              </button>
              <button
                type="button"
                onClick={() => handleDateOffset(15)}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold px-3 py-1 rounded"
              >
                15
              </button>
            </div>
          </div>
          <div>
            <label className="block font-medium text-gray-700">
              Contact Number 
            </label>
            <input
              type="tel"
              value={contactNumber}
              onChange={(e) => {
                const val = e.target.value;
                // Allow only digits
                if (!/^\d*$/.test(val)) {
                  setContactError("Only digits are allowed");
                } else if (val.length > 10) {
                  setContactError("Contact number must be exactly 10 digits");
                } else {
                  setContactError("");
                }
                setContactNumber(val);
              }}
              maxLength={10}
              placeholder="Enter 10-digit contact number (optional)"
              className="mt-1 block w-full border border-gray-300 rounded-md p-3 focus:ring-indigo-500 focus:border-indigo-500"
            />
            {contactError && (
              <p className="text-red-500 text-sm mt-1">{contactError}</p>
            )}
          </div>
          <div>
            <label className="block font-medium text-gray-700">Note</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Additional notes"
              className="mt-1 block w-full border border-gray-300 rounded-md p-3 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block font-medium text-gray-700">
              Assign To <span className="text-red-500">*</span>
            </label>
            {userName === "hi@gmail.com" ? (
              dropdownLoading ? (
                <select
                  disabled
                  className="mt-1 block w-full border border-gray-300 rounded-md p-3 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                >
                  <option>Loading...</option>
                </select>
              ) : (
                <select
                  value={assignTo}
                  onChange={(e) => setAssignTo(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md p-3 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                >
                  <option value="">Select assign to</option>
                  {dropdownOptions.map((option) => (
                    <option
                      key={option._id || option.userName}
                      value={`${option.name} (${option.userName})`}
                    >
                      {option.name} ({option.userName})
                    </option>
                  ))}
                </select>
              )
            ) : (
              <input
                type="text"
                value={assignTo}
                onChange={(e) => setAssignTo(e.target.value)}
                placeholder="Assign to..."
                className="mt-1 block w-full border border-gray-300 rounded-md p-3 focus:ring-indigo-500 focus:border-indigo-500"
                required
                readOnly={assignTo !== ""}
              />
            )}
          </div>
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-md font-medium transition-all focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              {isSubmitting ? "Submitting..." : "Submit Visitor Card"}
            </button>
          </div>
        </div>
      </form>

      {/* Full Image Preview Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={() => setPreviewImage("")}
        >
          <img
            src={previewImage}
            alt="Full Preview"
            className="max-w-full max-h-full object-contain"
          />
        </div>
      )}
    </div>
  );
};

export default VisitorCardForm;
