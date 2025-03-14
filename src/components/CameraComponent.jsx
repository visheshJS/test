import { useEffect, useRef, useState } from "react";

const CameraComponent = ({ onClose, onCapture }) => {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [facingMode, setFacingMode] = useState("environment"); // Default to rear camera

  useEffect(() => {
    openCamera();

    return () => {
      stopCamera(); // Cleanup camera stream when component unmounts
    };
  }, [facingMode]);

  const openCamera = async () => {
    try {
      if (stream) {
        stopCamera(); // Stop existing camera before switching
      }
      const constraints = { video: { facingMode } };
      const newStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(newStream);

      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const switchCamera = () => {
    setFacingMode((prevMode) => (prevMode === "environment" ? "user" : "environment"));
    stopCamera(); // Stop current camera
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    const imageUrl = canvas.toDataURL("image/png"); // Convert to base64
    if (onCapture) onCapture(imageUrl); // Pass captured image to parent
  };

  useEffect(() => {
    openCamera();

    return () => {
      stopCamera(); // Cleanup when unmounting
    };
  }, [facingMode]); // Restart camera when facingMode changes

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex flex-col items-center justify-center p-4">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full max-w-md mx-auto rounded-lg shadow-lg"
      ></video>

      <div className="mt-4 flex space-x-4">
        <button
          onClick={capturePhoto}
          className="p-3 bg-green-500 text-white font-bold rounded-md hover:bg-green-600"
        >
          📸 Capture
        </button>
        <button
          onClick={switchCamera}
          className="p-3 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600"
        >
          🔄 Switch Camera
        </button>
        <button
          onClick={() => {
            stopCamera();
            onClose();
          }}
          className="p-3 bg-red-500 text-white font-bold rounded-md hover:bg-red-600"
        >
          ❌ Close
        </button>
      </div>
    </div>
  );
};

export default CameraComponent;
