import { useState } from "react";
import { Upload, Camera, Search } from "lucide-react";
import Button from "./ui/Button";
import CameraComponent from "./CameraComponent";

export default function BookScanner() {
  const [imagePreview, setImagePreview] = useState(null);
  const [showCamera, setShowCamera] = useState(false);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
    }
  };

  return (
    <div className="flex flex-col mt-20 items-center justify-center p-6">
      <h1 className="text-3xl font-bold">Search for Your Book</h1>
      <p className="text-gray-500">
        Upload a photo of a book cover or take a picture to find download options.
      </p>

      <div className="flex gap-4 mt-4">
        <Button className="bg-gray-950 text-white cursor-pointer">
          <label className="flex items-center cursor-pointer">
            <Upload className="w-5 h-5 mr-2" />
            <span>Upload Image</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>
        </Button>
        <Button
          className="bg-gray-950 text-white cursor-pointer"
          onClick={() => setShowCamera(true)}
        >
          <Camera className="w-5 h-5 mr-2" /> Take Photo
        </Button>
      </div>

      <div className="mt-4 border p-4 rounded-lg w-full max-w-md">
        <label className="block text-sm font-medium text-gray-700">
          Upload Here
        </label>
        {imagePreview && (
          <div className="mt-4 flex flex-col items-center">
            <img
              src={imagePreview}
              alt="Uploaded Preview"
              className="mt-4 w-40 h-auto rounded-lg shadow-md"
            />
          </div>
        )}
        <div className="mt-4 flex justify-end">
          <Button className="bg-gray-950 text-white flex items-center cursor-pointer">
            <Search className="w-5 h-5 mr-2" /> Search
          </Button>
        </div>
      </div>

      {showCamera && (
        <CameraComponent
          onClose={() => setShowCamera(false)}
          onCapture={(imageUrl) => {
            setImagePreview(imageUrl);
            setShowCamera(false);
          }}
        />
      )}
    </div>
  );
}
