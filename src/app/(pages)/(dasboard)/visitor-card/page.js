"use client";

import { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  Camera,
  X,
  Calendar,
  User,
  Phone,
  FileText,
  Users,
  Check,
} from "lucide-react";
import Footer from "@/components/common/Footer";

const videoConstraints = {
  width: 1920,
  height: 1080,
  facingMode: "environment",
};

const VisitorCardForm = () => {
  const admin=process.env.NEXT_PUBLIC_ADMIN;
  const common=process.env.NEXT_PUBLIC_COMMON;
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

  // State for full-screen camera
  const [fullScreenCamera, setFullScreenCamera] = useState(false);
  const [fullScreenCameraType, setFullScreenCameraType] = useState("front");
  const [isFullScreenVideoReady, setIsFullScreenVideoReady] = useState(false);

  // Other form fields
  const [name, setName] = useState("");
  const [sedulertime, setSedulertime] = useState(() => {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 3);
    return currentDate.toISOString().split("T")[0];
  });
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

  // State to handle full image preview modal
  const [previewImage, setPreviewImage] = useState("");

  const router = useRouter();
  const webcamRefFront = useRef(null);
  const webcamRefBack = useRef(null);
  const fullScreenWebcamRef = useRef(null);

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

  // If the user userName is "common", fetch dropdown options
  useEffect(() => {
    if (userName === common) {
      setDropdownLoading(true);
      fetch("/api/auth/signup")
        .then((res) => res.json())
        .then((data) => {
          const users = data.users || [];
          // Exclude both "common" and "admin" from the dropdown
          const filteredUsers = users.filter(
            (option) =>
              option.userName !== common && option.userName !== admin
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

  // Helper function to convert a data URL to a File object
  const dataURLtoFile = (dataurl, filename) => {
    const arr = dataurl.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  // Helper function to add a timestamp watermark at the bottom-right of an image
  const addTimestampWatermark = (dataURL) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        // Draw the original image
        ctx.drawImage(img, 0, 0);
        // Set watermark style (adjust font size based on image width)
        const fontSize = Math.floor(canvas.width / 20);
        ctx.font = `bold ${fontSize}px Arial`;
        ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
        ctx.textAlign = "right";
        ctx.textBaseline = "bottom";
        const timestamp = new Date().toLocaleString();
        // Draw the timestamp with a 10px margin from the bottom-right
        ctx.fillText(timestamp, canvas.width - 10, canvas.height - 10);
        resolve(canvas.toDataURL("image/jpeg", 0.9));
      };
      img.src = dataURL;
    });
  };

  // Open full-screen camera
  const openFullScreenCamera = (type) => {
    setFullScreenCameraType(type);
    setFullScreenCamera(true);
    setIsFullScreenVideoReady(false);
    document.body.classList.add("overflow-hidden");
  };

  // Close full-screen camera
  const closeFullScreenCamera = () => {
    const videoTrack = fullScreenWebcamRef.current?.video?.srcObject
      ?.getTracks()
      .find((track) => track.kind === "video");
    if (videoTrack) {
      videoTrack.stop();
    }
    setFullScreenCamera(false);
    setIsFullScreenVideoReady(false);
    document.body.classList.remove("overflow-hidden");
  };

  // Capture from full-screen camera (now adds a watermark before saving)
  const captureFromFullScreen = async () => {
    if (!isFullScreenVideoReady) {
      console.warn("Full-screen webcam not ready yet.");
      return;
    }
    const imageSrc = fullScreenWebcamRef.current.getScreenshot();
    if (imageSrc) {
      const watermarkedImage = await addTimestampWatermark(imageSrc);
      if (fullScreenCameraType === "front") {
        setCapturedFront(watermarkedImage);
        setIsCameraOnFront(false);
      } else {
        setCapturedBack(watermarkedImage);
        setIsCameraOnBack(false);
      }
      closeFullScreenCamera();
    } else {
      console.error("Failed to capture image. Full-screen webcam not ready.");
    }
  };

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
      // Optionally, you could add watermark here as well.
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
    const videoTrack = webcamRefFront.current?.video?.srcObject
      ?.getTracks()
      .find((track) => track.kind === "video");
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
    const videoTrack = webcamRefBack.current?.video?.srcObject
      ?.getTracks()
      .find((track) => track.kind === "video");
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
        if (fullScreenCamera) closeFullScreenCamera();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.body.classList.remove("overflow-hidden");
    };
  }, [isCameraOnFront, isCameraOnBack, fullScreenCamera]);

  // Handle date offset options
  const handleDateOffset = (days) => {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + days);
    const formattedDate = currentDate.toISOString().split("T")[0];
    setSedulertime(formattedDate);
  };

  // Updated handleSubmit function that converts base64 strings to File objects
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

    setIsSubmitting(true);

    try {
      const formData = new FormData();

      if (capturedFront) {
        const fileFront = dataURLtoFile(capturedFront, `${name}-front.jpg`);
        formData.append("visitorCardFront", fileFront);
      }

      if (capturedBack) {
        const fileBack = dataURLtoFile(capturedBack, `${name}-back.jpg`);
        formData.append("visitorCardBack", fileBack);
      }

      formData.append("name", name);
      formData.append("sedulertime", sedulertime);
      formData.append("contactNumber", contactNumber);
      formData.append("note", note);
      formData.append("assignTo", assignTo);

      const res = await fetch("/api/visitorcards", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        // toast.success("Visitor Card Created!");
        // setTimeout(() => {
        //   router.refresh();
        //   setIsSubmitting(false);
        // }, 1500);

        toast.success("Visitor Card Created!");
        setTimeout(() => {
          // Reset all fields
          setCapturedFront("");
          setCapturedBack("");
          setName("");
          // setSedulertime(); // or reset to your default value if needed
          setContactNumber("");
          setNote("");
          setPreviewImage("");
          router.refresh();
          setIsSubmitting(false);
        }, 1000);
      


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
    <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-white shadow-xl rounded-xl border border-orange-100 dark:bg-gray-900 dark:border-gray-800">
      <div className="h-5"></div>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8"
      >
        {/* Column 1: Live Capture Fields */}
        <div className="space-y-8">
          <div className="flex justify-center space-x-3 mb-4">
            <button
              type="button"
              onClick={() => setActiveCapture("front")}
              className={`px-4 py-2.5 rounded-full font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                activeCapture === "front"
                  ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              }`}
            >
              <div className="flex items-center space-x-2">
                <Camera size={16} />
                <span>Front</span>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setActiveCapture("back")}
              className={`px-4 py-2.5 rounded-full font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                activeCapture === "back"
                  ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              }`}
            >
              <div className="flex items-center space-x-2">
                <Camera size={16} />
                <span>Back</span>
              </div>
            </button>
          </div>

          {activeCapture === "front" && (
            <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 shadow-sm dark:bg-gray-800/50 dark:border-gray-700">
              <label className="block font-semibold text-gray-700 mb-2 dark:text-gray-300">
                Visitor Card Front
              </label>
              <div className="relative bg-white border-2 border-orange-200 rounded-xl overflow-hidden shadow-md h-56 sm:h-64 mx-auto dark:bg-gray-900 dark:border-gray-700">
                {capturedFront ? (
                  <img
                    src={capturedFront || "/placeholder.svg"}
                    alt="Captured Front"
                    onClick={() => setPreviewImage(capturedFront)}
                    className="w-full h-full object-cover rounded-lg cursor-pointer"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500 font-medium">
                    <div className="text-center p-4">
                      <div className="bg-orange-100 rounded-full p-3 inline-block mb-3 dark:bg-orange-900/30">
                        <Camera className="h-10 w-10 text-orange-500" />
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 mb-3">
                        No Image Captured
                      </p>
                      <button
                        type="button"
                        onClick={() => openFullScreenCamera("front")}
                        className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium px-5 py-2.5 rounded-full transition-colors shadow-sm flex items-center justify-center mx-auto space-x-2"
                      >
                        <Camera size={16} />
                        <span>Open Camera</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
              {capturedFront && (
                <div className="mt-4 flex justify-center">
                  <button
                    type="button"
                    onClick={removeFront}
                    className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium px-5 py-2.5 rounded-full shadow transition-all focus:ring-2 focus:ring-red-500 focus:outline-none flex items-center space-x-2"
                  >
                    <X size={16} />
                    <span>Remove Front</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {activeCapture === "back" && (
            <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 shadow-sm dark:bg-gray-800/50 dark:border-gray-700">
              <label className="block font-semibold text-gray-700 mb-2 dark:text-gray-300">
                Visitor Card Back
              </label>
              <div className="relative bg-white border-2 border-orange-200 rounded-xl overflow-hidden shadow-md h-56 sm:h-64 mx-auto dark:bg-gray-900 dark:border-gray-700">
                {capturedBack ? (
                  <img
                    src={capturedBack || "/placeholder.svg"}
                    alt="Captured Back"
                    onClick={() => setPreviewImage(capturedBack)}
                    className="w-full h-full object-cover rounded-lg cursor-pointer"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500 font-medium">
                    <div className="text-center p-4">
                      <div className="bg-orange-100 rounded-full p-3 inline-block mb-3 dark:bg-orange-900/30">
                        <Camera className="h-10 w-10 text-orange-500" />
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 mb-3">
                        No Image Captured
                      </p>
                      <button
                        type="button"
                        onClick={() => openFullScreenCamera("back")}
                        className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium px-5 py-2.5 rounded-full transition-colors shadow-sm flex items-center justify-center mx-auto space-x-2"
                      >
                        <Camera size={16} />
                        <span>Open Camera</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
              {capturedBack && (
                <div className="mt-4 flex justify-center">
                  <button
                    type="button"
                    onClick={removeBack}
                    className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium px-5 py-2.5 rounded-full shadow transition-all focus:ring-2 focus:ring-red-500 focus:outline-none flex items-center space-x-2"
                  >
                    <X size={16} />
                    <span>Remove Back</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Column 2: Form Fields */}
        <div className="space-y-5">
          <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 shadow-sm dark:bg-gray-800/50 dark:border-gray-700">
            <div className="flex items-center space-x-2 mb-2">
              <div className="bg-orange-100 rounded-full p-1.5 dark:bg-orange-900/30">
                <User className="text-orange-500" size={16} />
              </div>
              <label className="block font-medium text-gray-700 dark:text-gray-300">
                Name <span className="text-red-500">*</span>
              </label>
            </div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter visitor's name"
              className="block w-full border border-orange-200 rounded-lg p-3 focus:ring-orange-500 focus:border-orange-500 bg-white shadow-sm dark:bg-gray-900 dark:border-gray-700 dark:text-gray-200"
              required
            />
          </div>

          <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 shadow-sm dark:bg-gray-800/50 dark:border-gray-700">
            <div className="flex items-center space-x-2 mb-2">
              <div className="bg-orange-100 rounded-full p-1.5 dark:bg-orange-900/30">
                <Phone className="text-orange-500" size={16} />
              </div>
              <label className="block font-medium text-gray-700 dark:text-gray-300">
                Contact Number <span className="text-red-500">*</span>
              </label>
            </div>
            <input
              type="tel"
              value={contactNumber}
              onChange={(e) => {
                const val = e.target.value;
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
              placeholder="Enter 10-digit Number"
              className="block w-full border border-orange-200 rounded-lg p-3 focus:ring-orange-500 focus:border-orange-500 bg-white shadow-sm dark:bg-gray-900 dark:border-gray-700 dark:text-gray-200"
              required
            />
            {contactError && (
              <p className="text-red-500 text-sm mt-1">{contactError}</p>
            )}
          </div>

          <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 shadow-sm dark:bg-gray-800/50 dark:border-gray-700">
            <div className="flex items-center space-x-2 mb-2">
              <div className="bg-orange-100 rounded-full p-1.5 dark:bg-orange-900/30">
                <Calendar className="text-orange-500" size={16} />
              </div>
              <label className="block font-medium text-gray-700 dark:text-gray-300">
                Scheduler Date <span className="text-red-500">*</span>
              </label>
            </div>
            <input
              type="date"
              value={sedulertime}
              onChange={(e) => setSedulertime(e.target.value)}
              className="block w-full border border-orange-200 rounded-lg p-3 focus:ring-orange-500 focus:border-orange-500 bg-white shadow-sm dark:bg-gray-900 dark:border-gray-700 dark:text-gray-200"
              required
            />
            <div className="bg-white mt-3 p-3 rounded-lg border border-orange-200 shadow-sm dark:bg-gray-900 dark:border-gray-700">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-gray-700 font-medium px-2 dark:text-gray-300">
                  Days:
                </span>
                {[3, 5, 7, 10, 15].map((days) => (
                  <button
                    key={days}
                    type="button"
                    onClick={() => handleDateOffset(days)}
                    className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium px-3 py-1.5 rounded-full transition-colors shadow-sm"
                  >
                    {days}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 shadow-sm dark:bg-gray-800/50 dark:border-gray-700">
            <div className="flex items-center space-x-2 mb-2">
              <div className="bg-orange-100 rounded-full p-1.5 dark:bg-orange-900/30">
                <FileText className="text-orange-500" size={16} />
              </div>
              <label className="block font-medium text-gray-700 dark:text-gray-300">
                Note
              </label>
            </div>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Additional notes"
              className="block w-full border border-orange-200 rounded-lg p-3 focus:ring-orange-500 focus:border-orange-500 bg-white min-h-[80px] shadow-sm dark:bg-gray-900 dark:border-gray-700 dark:text-gray-200"
            />
          </div>

          <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 shadow-sm dark:bg-gray-800/50 dark:border-gray-700">
            <div className="flex items-center space-x-2 mb-2">
              <div className="bg-orange-100 rounded-full p-1.5 dark:bg-orange-900/30">
                <Users className="text-orange-500" size={16} />
              </div>
              <label className="block font-medium text-gray-700 dark:text-gray-300">
                Assign To <span className="text-red-500">*</span>
              </label>
            </div>
            {userName === common ? (
              dropdownLoading ? (
                <select
                  disabled
                  className="block w-full border border-orange-200 rounded-lg p-3 focus:ring-orange-500 focus:border-orange-500 bg-white shadow-sm dark:bg-gray-900 dark:border-gray-700 dark:text-gray-400"
                  required
                >
                  <option>Loading...</option>
                </select>
              ) : (
                <select
                  value={assignTo}
                  onChange={(e) => setAssignTo(e.target.value)}
                  className="block w-full border border-orange-200 rounded-lg p-3 focus:ring-orange-500 focus:border-orange-500 bg-white shadow-sm dark:bg-gray-900 dark:border-gray-700 dark:text-gray-200"
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
                className="block w-full border border-orange-200 rounded-lg p-3 focus:ring-orange-500 focus:border-orange-500 bg-white shadow-sm dark:bg-gray-900 dark:border-gray-700 dark:text-gray-200"
                required
                readOnly={assignTo !== ""}
              />
            )}
          </div>

          <div className="pt-5">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-4 px-6 rounded-full font-medium transition-all focus:ring-2 focus:ring-orange-500 focus:outline-none shadow-lg flex items-center justify-center space-x-2 disabled:opacity-70"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Check size={18} />
                  <span>Submit Visitor Card</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Full-screen Camera Modal */}
      {fullScreenCamera && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          <div className="relative w-full h-full">
          {/* <div className="relative max-w-md max-h-[80%] w-full h-full flex items-center justify-center"> */}
            <Webcam
              ref={fullScreenWebcamRef}
              audio={false}
              screenshotFormat="image/png"
              forceScreenshotSourceSize={true}
              videoConstraints={videoConstraints}
              onUserMedia={() => setIsFullScreenVideoReady(true)}
              onUserMediaError={(error) => {
                console.error("Full-screen webcam error:", error);
                setIsFullScreenVideoReady(false);
              }}
              className="h-full w-full object-contain"
              //  className="h-auto w-auto max-h-full max-w-full object-contain"
            />

            {/* Overlay controls on top of the camera view */}
            <div className="absolute bottom-20 left-0 right-0 flex justify-between items-center px-6">
              <button
                type="button"
                onClick={closeFullScreenCamera}
                className="bg-gray-800 hover:bg-gray-700 text-white font-medium px-6 py-3 rounded-full shadow-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={captureFromFullScreen}
                disabled={!isFullScreenVideoReady}
                className={`${
                  !isFullScreenVideoReady
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                } text-white font-medium px-6 py-3 rounded-full shadow-lg flex items-center space-x-2`}
              >
                <Camera size={18} />
                <span>Capture</span>
              </button>
            </div>

            <div className="absolute top-16 left-0 right-0 text-center">
              <div className="bg-black bg-opacity-50 py-3 px-4 mx-auto inline-block rounded-full">
                <span className="text-white text-lg font-bold">
                  {fullScreenCameraType === "front"
                    ? "Capture Card Front"
                    : "Capture Card Back"}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full Image Preview Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
          onClick={() => setPreviewImage("")}
        >
          <div className="relative max-w-4xl w-full">
            <button
              onClick={() => setPreviewImage("")}
              className="absolute top-4 right-4 bg-white rounded-full p-2 text-gray-800 hover:bg-gray-200 transition-colors shadow-lg"
            >
              <X size={24} />
            </button>
            <img
              src={previewImage || "/placeholder.svg"}
              alt="Full Preview"
              className="max-w-full max-h-[80vh] object-contain rounded-lg mx-auto shadow-2xl"
            />
          </div>
        </div>
      )}
      <div className="h-24"></div>
    </div>
  );
};

export default VisitorCardForm;











