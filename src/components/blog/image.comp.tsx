import React, { useState } from "react";
import { X } from "lucide-react";

interface BlogImageProps {
  src: string;
  alt: string;
  caption?: string;
  fullWidth?: boolean;
}

export const BlogImage = ({
  src,
  alt,
  caption,
  fullWidth = false,
}: BlogImageProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
    // Prevent scrolling when modal is open
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setIsModalOpen(false);
    // Restore scrolling when modal is closed
    document.body.style.overflow = "auto";
  };

  // Close modal on ESC key press
  React.useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isModalOpen) {
        closeModal();
      }
    };

    window.addEventListener("keydown", handleEscKey);
    return () => {
      window.removeEventListener("keydown", handleEscKey);
    };
  }, [isModalOpen]);

  return (
    <>
      {/* Main image container */}
      <figure className={`my-4 ${fullWidth ? "w-full" : "mx-auto max-w-2xl"}`}>
        <div
          className="cursor-pointer overflow-hidden rounded-lg shadow-md transition-shadow duration-300 hover:shadow-lg"
          onClick={openModal}
        >
          <img src={src} alt={alt} className="h-auto w-full" loading="lazy" />
        </div>
        {caption && (
          <figcaption className="mt-2 text-center text-sm italic text-gray-600">
            {caption}
          </figcaption>
        )}
      </figure>

      {/* Modal overlay */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 p-4"
          onClick={closeModal}
        >
          <div className="relative max-h-screen w-full max-w-4xl">
            {/* Close button */}
            <button
              className="absolute -right-1 -top-4 z-10 bg-transparent text-white transition-colors duration-300 hover:text-gray-400"
              onClick={closeModal}
              aria-label="Close modal"
            >
              <X className="h-8 w-8" />
            </button>

            {/* Modal content */}
            <div
              className="flex h-full w-full items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={src}
                alt={alt}
                className="max-h-[90vh] max-w-full object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
