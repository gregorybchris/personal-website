import { useEffect, useRef, useState } from "react";
import { ImageModal } from "../components/image-modal";
import { GET, makeQuery } from "../utilities/request-utilities";
import { cn } from "../utilities/style-utilities";

interface Piece {
  date: string;
  description: string;
  imageLinks: string[];
  glaze: string | null;
  dimensions: string;
  favorite: boolean;
  archived: boolean;
}

interface PotteryCardProps {
  piece: Piece;
  onExpand: () => void;
}

function PotteryCard({ piece, onExpand }: PotteryCardProps) {
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

  return (
    <div className="group relative cursor-pointer [perspective:1000px]">
      <div
        className={cn(
          "relative w-full pb-[100%] transition-transform duration-[600ms]",
        )}
      >
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
          <div
            className={cn(
              "absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/75 p-6 opacity-0 backdrop-blur-sm transition-opacity duration-200",
              isImageLoaded && "group-hover:opacity-100",
            )}
            onClick={(e) => {
              e.stopPropagation();
              onExpand();
            }}
          >
            <div className="flex flex-col gap-2 text-center text-white">
              <div className="text-lg font-bold">{piece.date}</div>
              {piece.glaze && (
                <div className="text-sm leading-relaxed">
                  <strong>Glaze:</strong> {piece.glaze}
                </div>
              )}
              <div className="text-sm leading-relaxed">
                <strong>Dimensions:</strong> {piece.dimensions}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PotteryPage() {
  const [pieces, setPieces] = useState<Piece[]>([]);
  const [selectedImage, setSelectedImage] = useState<{
    images: string[];
    index: number;
    name: string;
  } | null>(null);

  useEffect(() => {
    const potteryQuery = makeQuery("art/pottery");
    GET<Piece[]>(potteryQuery).then((pottery) => {
      console.log(pottery);
      setPieces(pottery);
    });
  }, []);

  return (
    <div className="font-polymath min-h-screen bg-black p-4 md:p-8">
      {selectedImage && (
        <ImageModal
          images={selectedImage.images}
          currentIndex={selectedImage.index}
          name={selectedImage.name}
          onClose={() => setSelectedImage(null)}
          onNavigate={(index) => setSelectedImage({ ...selectedImage, index })}
        />
      )}

      <div className="mx-auto max-w-7xl">
        <div className="pottery-grid grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
          {pieces.toReversed().map((piece, index) => (
            <div key={index}>
              <PotteryCard
                piece={piece}
                onExpand={() =>
                  setSelectedImage({
                    images: piece.imageLinks,
                    index: 0,
                    name: piece.date,
                  })
                }
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
