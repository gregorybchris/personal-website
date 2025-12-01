import {
  ClipboardIcon,
  ImagesIcon,
  ShoppingCartIcon,
  XIcon,
} from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import makersMark from "../assets/icons/makers-mark.svg";
import { ImageModal } from "../components/image-modal";
import { GET, makeQuery } from "../utilities/request-utilities";
import { cn } from "../utilities/style-utilities";

interface Piece {
  name: string;
  slug: string;
  itemCode: string;
  date: string;
  description: string;
  imageLinks: string[];
  glaze: string | null;
  dimensions: {
    width: number;
    height: number;
  };
  price: number | null;
  favorite: boolean;
  archived: boolean;
}

interface PotteryCardProps {
  piece: Piece;
  onExpand: () => void;
  isFlipped: boolean;
  onFlip: () => void;
}

interface PotteryDetailsProps {
  piece: Piece;
  handleExpand: (e: React.MouseEvent) => void;
  mobile?: boolean;
}

function PotteryDetails({
  piece,
  handleExpand,
  mobile = false,
}: PotteryDetailsProps) {
  const [searchParams] = useSearchParams();
  const isAdmin = searchParams.get("admin") === "true";

  function handleBuyClick(e: React.MouseEvent) {
    e.stopPropagation();

    toast.message(
      <span>
        If you wish to inquire about purchasing a piece, send me a message
        through my{" "}
        <Link
          to="/contact"
          className="text-sky hover:text-royal transition-colors"
        >
          contact page
        </Link>{" "}
        and include this item code:
        <div className="inline-flex w-full justify-center pt-2">
          <button
            onClick={async (event) => {
              event.stopPropagation();
              try {
                await navigator.clipboard.writeText(piece.itemCode);
                toast.success(
                  <span>
                    Item code{" "}
                    <span className="font-mono">{piece.itemCode}</span> copied
                    to clipboard!
                  </span>,
                  {
                    duration: 2000,
                    position: "top-right",
                  },
                );
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
              } catch (err) {
                console.error("Failed to copy item code");
              }
            }}
            className="text-sky hover:text-royal flex cursor-pointer flex-row items-center gap-1 rounded font-mono transition-colors"
          >
            <ClipboardIcon size={14} />
            <span>{piece.itemCode}</span>
          </button>
        </div>
      </span>,
      {
        duration: 8000,
        position: "top-right",
      },
    );
  }

  return (
    <div className="flex flex-col items-center gap-3 text-center text-white">
      <div className="flex flex-col gap-2 text-center text-white">
        {!isAdmin && (
          <div
            className={cn(
              "text-lg font-bold",
              mobile ? "text-base" : "text-lg",
            )}
          >
            {piece.name}
          </div>
        )}
        {isAdmin && (
          <div className={cn("italic", mobile ? "text-sm" : "text-sm")}>
            {piece.date}
          </div>
        )}
        {isAdmin && (
          <div
            className={cn("leading-relaxed", mobile ? "text-sm" : "text-sm")}
          >
            <strong>Glaze:</strong> {piece.glaze || "unknown"}
          </div>
        )}
        {!isAdmin && (
          <div
            className={cn("leading-relaxed", mobile ? "text-sm" : "text-sm")}
          >
            <strong>Size:</strong> <span>{piece.dimensions.width}</span>
            {" H"}
            <XIcon size={7} weight="bold" className="mx-1 inline-block" />
            <span>{piece.dimensions.height}</span>
            {" W"}
          </div>
        )}
      </div>

      <div className="flex flex-row gap-6">
        <button
          className="cursor-pointer rounded-full bg-white/20 px-2 py-2 text-sm font-medium text-white transition-colors hover:bg-white/30"
          onClick={handleExpand}
          title="Photo gallery"
        >
          <ImagesIcon size={18} color="#ffffff" />
        </button>
        {!isAdmin && (
          <>
            {piece.price !== null && (
              <button
                className="cursor-pointer rounded-full bg-white/20 px-2 py-2 text-sm font-medium text-white transition-colors hover:bg-white/30"
                onClick={handleBuyClick}
                title="Buy"
              >
                <ShoppingCartIcon size={18} color="#ffffff" />
              </button>
            )}
            {piece.price === null && (
              <div className="relative">
                <button
                  className="cursor-not-allowed rounded-full bg-white/10 px-2 py-2 text-sm font-medium text-white opacity-50"
                  disabled
                >
                  <ShoppingCartIcon size={18} color="#ffffff" />
                </button>
                <div className="absolute -top-2 -right-2 rounded-full bg-[#6283c0] px-1.5 py-0.5 text-xs font-bold text-white">
                  Sold
                </div>
              </div>
            )}
          </>
        )}
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
            <PotteryDetails piece={piece} handleExpand={handleExpand} />
          </div>
        </div>

        {/* Back side (mobile only) */}
        <div className="absolute flex h-full w-full [transform:rotateY(180deg)] flex-col items-center justify-center gap-4 rounded border-2 border-[#333] bg-[#1a1a1a] px-3 py-6 [backface-visibility:hidden] md:hidden">
          <PotteryDetails piece={piece} handleExpand={handleExpand} mobile />
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

      <div className="flex flex-row items-center justify-center gap-4 pb-4 md:pb-8">
        <img src={makersMark} alt="Maker's Mark" className="h-12 w-12" />
      </div>

      <div className="mx-auto max-w-7xl">
        <div className="pottery-grid grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
          {pieces
            .filter((piece) => !piece.archived)
            .toReversed()
            .map((piece, index) => (
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
