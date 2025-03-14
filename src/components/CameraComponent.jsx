import { useEffect, useRef, useState } from "react";

const CameraComponent = ({ onClose, onCapture }) => {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [devices, setDevices] = useState([]);
  const [currentDeviceIndex, setCurrentDeviceIndex] = useState(0);

  useEffect(() => {
    getCameras();
  }, []);

  useEffect(() => {
    startCamera();

    return () => stopCamera();
  }, [currentDeviceIndex]);

  const getCameras = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter((device) => device.kind === "videoinput");

      if (videoDevices.length > 0) {
        setDevices(videoDevices);
        setCurrentDeviceIndex(0);
      }
    } catch (error) {
      console.error("Error fetching camera devices:", error);
    }
  };

  const startCamera = async () => {
    if (devices.length === 0) return;

    try {
      stopCamera(); // Stop any existing streams before starting a new one

      const constraints = {
        video: { deviceId: { exact: devices[currentDeviceIndex].deviceId } },
      };

      const newStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(newStream);
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }
    } catch (error) {
      console.error("Error starting camera:", error);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
  };

  const switchCamera = () => {
    if (devices.length < 2) return;

    setCurrentDeviceIndex((prevIndex) => (prevIndex + 1) % devices.length);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    const video = videoRef.current;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.translate(canvas.width, 0);
    context.scale(-1, 1); // Flip horizontally if using the front camera

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageUrl = canvas.toDataURL("image/png");
    onCapture(imageUrl);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full max-w-md h-auto rounded-lg shadow-lg"
      />

      <div className="mt-4 flex space-x-4">
        <button
          onClick={capturePhoto}
          className="p-3 bg-green-500 text-white font-bold rounded-md hover:bg-green-600"
        >
          📸 Capture
        </button>
        {devices.length > 1 && (
          <button
            onClick={switchCamera}
            className="p-3 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600"
          >
            🔄 Switch Camera
        </button>
        )}
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
