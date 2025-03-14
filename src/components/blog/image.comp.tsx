import React, { useState } from "react";

interface BlogImageProps {
  src: string;
  alt: string;
  caption?: string;
  extendWidth?: boolean;
}

export const BlogImage = ({
  src,
  alt,
  caption,
  extendWidth = false,
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
      {/* Container that breaks out of article width constraints */}
      <div
        className={
          extendWidth ? "relative left-1/2 right-1/2 -mx-[50vw] w-screen" : ""
        }
      >
        <figure
          className={`my-4 ${extendWidth ? "mx-auto max-w-screen-md px-4" : "mx-auto max-w-2xl"}`}
        >
          <div
            className="cursor-pointer overflow-hidden rounded-lg shadow-md transition-shadow duration-300 hover:shadow-lg"
            onClick={openModal}
          >
            <img src={src} alt={alt} className="h-auto w-full" loading="lazy" />
          </div>
          {caption && (
            <figcaption className="mt-2 text-center text-sm italic text-gray-600 dark:text-gray-400">
              {caption}
            </figcaption>
          )}
        </figure>
      </div>

      {/* Modal overlay */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 p-4"
          onClick={closeModal}
        >
          <div className="max-h-screen w-full max-w-4xl">
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
