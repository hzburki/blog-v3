import { CircleX } from "lucide-react";
import React, { useState } from "react";

interface ImageProps {
  src: string;
  alt: string;
  fullWidth?: boolean;
}

export const BlogImage = ({ src, alt, fullWidth = false }: ImageProps) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <div
        className={`cursor-pointer overflow-hidden transition-transform duration-300 ${isZoomed ? "scale-200" : ""}`}
        onClick={openModal}
      >
        <img
          src={src}
          alt={alt}
          className={`w-full ${fullWidth ? "w-screen" : "max-w-2xl"}`}
        />
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75"
          onClick={closeModal}
        >
          <div className="relative">
            <button
              className="absolute right-2 top-6 rounded-full bg-gray-800 text-white"
              onClick={closeModal}
            >
              <CircleX className="h-8 w-8" />
            </button>
            <img src={src} alt={alt} className="max-h-full max-w-full" />
          </div>
        </div>
      )}
    </>
  );
};
