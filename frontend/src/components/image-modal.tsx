import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react";

interface ImageModalProps {
  images: string[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export function ImageModal({
  images,
  currentIndex,
  onClose,
  onNavigate,
}: ImageModalProps) {
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
      {images.length > 1 && (
        <button
          className="absolute top-1/2 left-4 -translate-y-1/2 cursor-pointer rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20"
          onClick={handlePrevious}
        >
          <CaretLeftIcon size={32} weight="bold" />
        </button>
      )}

      <img
        src={images[currentIndex]}
        alt="Expanded view"
        className="max-h-[90vh] max-w-[90vw] object-contain"
        onClick={(e) => e.stopPropagation()}
      />

      {images.length > 1 && (
        <button
          className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20"
          onClick={handleNext}
        >
          <CaretRightIcon size={32} weight="bold" />
        </button>
      )}
    </div>
  );
}
