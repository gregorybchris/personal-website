import { ArrowsOutSimpleIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { ImageModal } from "../components/image-modal";
import { cn } from "../utilities/style-utilities";

interface PotteryItem {
  id: string;
  image: string;
  date: string;
  description: string;
}

const potteryItems: PotteryItem[] = [
  {
    id: "1",
    image:
      "https://storage.googleapis.com/cgme/art/pottery/PXL_20251031_202401936.jpg",
    date: "November 2025",
    description:
      "A beautiful ceramic vessel with intricate details and a rich glaze.",
  },
  {
    id: "2",
    image:
      "https://storage.googleapis.com/cgme/art/pottery/PXL_20251031_202355596.jpg",
    date: "October 2025",
    description:
      "Hand-thrown stoneware bowl with organic curves and earthy tones.",
  },
  {
    id: "3",
    image:
      "https://storage.googleapis.com/cgme/art/pottery/PXL_20240914_021633737.MP.jpg",
    date: "September 2025",
    description:
      "Delicate porcelain vase showcasing traditional craftsmanship.",
  },
  {
    id: "4",
    image:
      "https://storage.googleapis.com/cgme/art/pottery/PXL_20240902_032703494.jpg",
    date: "August 2025",
    description: "Rustic terracotta pot with natural textures and warm hues.",
  },
  {
    id: "5",
    image:
      "https://storage.googleapis.com/cgme/art/pottery/PXL_20240831_034254071.jpg",
    date: "July 2025",
    description: "Contemporary ceramic sculpture with bold geometric patterns.",
  },
  {
    id: "6",
    image:
      "https://storage.googleapis.com/cgme/art/pottery/PXL_20251116_035613944.jpg",
    date: "June 2025",
    description:
      "Elegant porcelain tea set with intricate hand-painted designs.",
  },
];

interface FlipCardProps {
  item: PotteryItem;
  onExpand: () => void;
}

function FlipCard({ item, onExpand }: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="group relative cursor-pointer [perspective:1000px]">
      <div
        className={cn(
          "relative w-full pb-[100%] transition-transform duration-[600ms] [transform-style:preserve-3d]",
          isFlipped
            ? "[transform:rotateY(180deg)]"
            : "[transform:rotateY(0deg)]",
        )}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        {/* Front side */}
        <div className="absolute h-full w-full overflow-hidden rounded [backface-visibility:hidden]">
          <img
            src={item.image}
            alt="Pottery"
            className="h-full w-full object-cover"
          />
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-black/60 p-6 opacity-0 backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100"
            onClick={(e) => {
              e.stopPropagation();
              onExpand();
            }}
          >
            <div className="flex flex-col gap-2 text-center text-white">
              <div className="text-lg font-bold">{item.date}</div>
              <div className="text-sm leading-relaxed">{item.description}</div>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-white">
              <ArrowsOutSimpleIcon size={20} weight="bold" />
              <span className="text-sm font-medium">Expand</span>
            </div>
          </div>
        </div>

        {/* Back side */}
        <div className="absolute flex h-full w-full [transform:rotateY(180deg)] items-center justify-center rounded-lg border-2 border-[#333] bg-[#1a1a1a] p-6 [backface-visibility:hidden]">
          <div className="flex flex-col gap-3 text-center text-white">
            <div className="text-lg font-bold">{item.date}</div>
            <div className="text-sm leading-relaxed">{item.description}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PotteryPage() {
  const [selectedImage, setSelectedImage] = useState<{
    images: string[];
    index: number;
    name: string;
  } | null>(null);

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
        <div className="pottery-grid columns-1 md:columns-2 md:gap-x-6 lg:columns-3">
          {potteryItems.map((item) => (
            <div key={item.id} className="mb-4 break-inside-avoid md:mb-6">
              <FlipCard
                item={item}
                onExpand={() =>
                  setSelectedImage({
                    images: [item.image],
                    index: 0,
                    name: item.date,
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
