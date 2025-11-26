import { ArrowsOutSimpleIcon, XIcon } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import { ImageModal } from "../components/image-modal";
import { GET, makeQuery } from "../utilities/request-utilities";
import { cn } from "../utilities/style-utilities";

interface Piece {
  date: string;
  description: string;
  imageLinks: string[];
  glaze: string | null;
  dimensions: {
    width: number;
    height: number;
  };
  favorite: boolean;
  archived: boolean;
}

interface PotteryCardProps {
  piece: Piece;
  onExpand: () => void;
  isFlipped: boolean;
  onFlip: () => void;
}

function PotteryDetails({ piece }: { piece: Piece }) {
  return (
    <div className="flex flex-col gap-2 text-center text-white">
      <div className="text-lg font-bold">{piece.date}</div>
      {piece.glaze && (
        <div className="text-sm leading-relaxed">
          <strong>Glaze:</strong> {piece.glaze}
        </div>
      )}
      <div className="text-sm leading-relaxed">
        <strong>Size:</strong> <span>{piece.dimensions.width}"</span>
        {" tall"}
        <XIcon size={7} weight="bold" className="mx-1 inline-block" />
        <span>{piece.dimensions.height}"</span> {"wide"}
      </div>
    </div>
  );
}

function PotteryCard({ piece, onExpand, isFlipped, onFlip }: PotteryCardProps) {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin: "100px" },
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleCardClick = () => {
    if (window.matchMedia("(max-width: 768px)").matches) {
      onFlip();
    }
  };

  const handleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    onExpand();
  };

  return (
    <div className="group relative [perspective:1000px]">
      <div
        className={cn(
          "relative w-full pb-[100%] transition-transform duration-[600ms] [transform-style:preserve-3d]",
          isFlipped
            ? "[transform:rotateY(180deg)]"
            : "[transform:rotateY(0deg)]",
        )}
        onClick={handleCardClick}
      >
        {/* Front side */}
        <div className="absolute h-full w-full overflow-hidden rounded [backface-visibility:hidden]">
          <img
            ref={imgRef}
            src={isVisible ? piece.imageLinks[0] : undefined}
            alt="Pottery"
            className={cn(
              "h-full w-full object-cover transition-opacity duration-700",
              isImageLoaded ? "opacity-100" : "opacity-0",
            )}
            onLoad={() => setIsImageLoaded(true)}
          />

          {/* Desktop hover overlay */}
          <div
            className={cn(
              "absolute inset-0 hidden flex-col items-center justify-center gap-4 bg-black/75 p-6 opacity-0 backdrop-blur-sm transition-opacity duration-200 md:flex",
              isImageLoaded && "group-hover:opacity-100",
            )}
          >
            <PotteryDetails piece={piece} />
            <button
              className="cursor-pointer rounded-full bg-white/20 px-2 py-2 text-sm font-medium text-white transition-colors hover:bg-white/30"
              onClick={handleExpand}
            >
              <ArrowsOutSimpleIcon size={18} color="#ffffff" />
            </button>
          </div>
        </div>

        {/* Back side (mobile only) */}
        <div className="absolute flex h-full w-full [transform:rotateY(180deg)] flex-col items-center justify-center gap-4 rounded border-2 border-[#333] bg-[#1a1a1a] p-6 [backface-visibility:hidden] md:hidden">
          <PotteryDetails piece={piece} />
          <button
            className="cursor-pointer rounded-full bg-white/20 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/30"
            onClick={handleExpand}
          >
            Expand
          </button>
        </div>
      </div>
    </div>
  );
}

interface ModalState {
  images: string[];
  currentIndex: number;
  name: string;
}

export function PotteryPage() {
  const [pieces, setPieces] = useState<Piece[]>([]);
  const [modalState, setModalState] = useState<ModalState | null>(null);
  const [flippedCardIndex, setFlippedCardIndex] = useState<number | null>(null);

  useEffect(() => {
    const potteryQuery = makeQuery("art/pottery");
    GET<Piece[]>(potteryQuery).then((pottery) => {
      setPieces(pottery);
    });
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.matchMedia("(min-width: 768px)").matches) {
        setFlippedCardIndex(null);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [flippedCardIndex]);

  const openModal = (piece: Piece) => {
    setModalState({
      images: piece.imageLinks,
      currentIndex: 0,
      name: piece.date,
    });
  };

  const closeModal = () => {
    setModalState(null);
  };

  const navigateModal = (index: number) => {
    if (modalState) {
      setModalState({ ...modalState, currentIndex: index });
    }
  };

  const toggleCardFlip = (index: number) => {
    setFlippedCardIndex(flippedCardIndex === index ? null : index);
  };

  return (
    <div className="font-polymath min-h-screen bg-black p-4 md:p-8">
      {modalState && (
        <ImageModal
          images={modalState.images}
          currentIndex={modalState.currentIndex}
          name={modalState.name}
          onClose={closeModal}
          onNavigate={navigateModal}
        />
      )}

      <div className="mx-auto max-w-7xl">
        <div className="pottery-grid grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
          {pieces.toReversed().map((piece, index) => (
            <div key={index}>
              <PotteryCard
                piece={piece}
                onExpand={() => openModal(piece)}
                isFlipped={flippedCardIndex === index}
                onFlip={() => toggleCardFlip(index)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
