import { useEffect, useRef } from "react";

export default function CameraComponent({ onClose, onCapture }) {
  const videoRef = useRef(null);
  let stream = useRef(null);

  useEffect(() => {
    openCamera();

    return () => {
      stopCamera(); // Stop camera when unmounting
    };
  }, []);

  const openCamera = async () => {
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      onClose();
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    const imageUrl = canvas.toDataURL("image/png");
    onCapture(imageUrl);
    stopCamera();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex flex-col items-center justify-center">
      <video ref={videoRef} autoPlay playsInline className="w-full h-full"></video>
      <button onClick={capturePhoto} className="mt-4 p-2 bg-white text-black rounded">
        Capture
      </button>
      <button onClick={onClose} className="mt-2 p-2 bg-red-500 text-white rounded">
        Close
      </button>
    </div>
  );
}
