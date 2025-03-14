import { useEffect, useRef, useState } from "react";

const CameraComponent = ({ onClose, onCapture }) => {
  const videoRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [facingMode, setFacingMode] = useState("user"); // Default to front camera
  const [deviceList, setDeviceList] = useState([]);
  const [currentDeviceId, setCurrentDeviceId] = useState(null);

  useEffect(() => {
    getAvailableCameras();
    openCamera();
    
    return () => {
      stopCamera(); // Cleanup camera when component unmounts
    };
  }, []);

  useEffect(() => {
    openCamera(); // Open camera when currentDeviceId changes

    return () => {
      stopCamera();
    };
  }, [currentDeviceId]);

  const getAvailableCameras = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === "videoinput");
      setDeviceList(videoDevices);
      
      if (videoDevices.length > 0) {
        setCurrentDeviceId(videoDevices[0].deviceId);
      }
    } catch (error) {
      console.error("Error fetching camera devices:", error);
    }
  };

  const openCamera = async () => {
    try {
      if (stream) {
        stopCamera(); // Stop existing camera before opening a new one
      }

      if (!currentDeviceId) return;

      const constraints = { video: { deviceId: { exact: currentDeviceId } } };
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
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const switchCamera = () => {
    if (deviceList.length < 2) return; // No second camera available

    // Get current index
    const currentIndex = deviceList.findIndex(device => device.deviceId === currentDeviceId);
    // Get next index
    const nextIndex = (currentIndex + 1) % deviceList.length;
    setCurrentDeviceId(deviceList[nextIndex].deviceId);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

    const imageUrl = canvas.toDataURL("image/png");
    if (onCapture) onCapture(imageUrl);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex flex-col items-center justify-center">
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
