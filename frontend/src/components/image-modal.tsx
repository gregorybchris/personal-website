import { CaretLeftIcon, CaretRightIcon, XIcon } from "@phosphor-icons/react";
import { useEffect } from "react";

interface ImageModalProps {
  images: string[];
  currentIndex: number;
  name?: string;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export function ImageModal({
  images,
  currentIndex,
  name,
  onClose,
  onNavigate,
}: ImageModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        onNavigate((currentIndex - 1 + images.length) % images.length);
      } else if (e.key === "ArrowRight") {
        onNavigate((currentIndex + 1) % images.length);
      } else if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, images.length, onNavigate, onClose]);

  const handlePrevious = (e: React.MouseEvent) => {
    e.stopPropagation();
    onNavigate((currentIndex - 1 + images.length) % images.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    onNavigate((currentIndex + 1) % images.length);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      onClick={onClose}
    >
      {name && (
        <div className="absolute top-4 left-4 rounded-full bg-black/60 px-4 py-2 text-sm font-medium text-white">
          {name}
        </div>
      )}

      <button
        className="absolute top-4 right-4 cursor-pointer rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      >
        <XIcon size={32} weight="bold" />
      </button>

      {images.length > 1 && (
        <button
          className="absolute top-1/2 left-4 z-10 -translate-y-1/2 cursor-pointer rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20"
          onClick={handlePrevious}
        >
          <CaretLeftIcon size={32} weight="bold" />
        </button>
      )}

      <div className="relative z-0">
        <img
          src={images[currentIndex]}
          alt="Expanded view"
          className="max-h-[90vh] max-w-[90vw] rounded-3xl object-contain"
          onClick={(e) => e.stopPropagation()}
        />
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-sm text-white">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {images.length > 1 && (
        <button
          className="absolute top-1/2 right-4 z-10 -translate-y-1/2 cursor-pointer rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20"
          onClick={handleNext}
        >
          <CaretRightIcon size={32} weight="bold" />
        </button>
      )}
    </div>
  );
}
