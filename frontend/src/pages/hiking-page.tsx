import {
  ImageIcon,
  MapTrifoldIcon,
  RulerIcon,
  SignpostIcon,
  StarIcon,
} from "@phosphor-icons/react";
import { MountainsIcon } from "@phosphor-icons/react/dist/ssr";
import { useEffect, useRef, useState } from "react";
import { ImageModal } from "../components/image-modal";
import { Loader } from "../components/loader";
import { PageTitle } from "../components/page-title";
import { SimpleLink } from "../components/simple-link";
import "../styles/hiking.css";
import { GET, makeQuery } from "../utilities/request-utilities";
import { cn } from "../utilities/style-utilities";

export interface HikingRoute {
  routeId: string;
  name: string;
  slug: string;
  dates: string[];
  miles: number;
  elevation: number | null;
  area: string;
  region: string;
  travelTime: string | null;
  notes: string | null;
  coordinates: {
    latitude: number;
    longitude: number;
    formatted: string;
  } | null;
  stars: number | null;
  archived: boolean;
  imageLinks: string[];
}

function formatDistance(n: number) {
  const distStr = n.toFixed(1);
  if (distStr.endsWith(".0")) {
    return distStr.slice(0, -2);
  }
  return distStr;
}

export function HikingPage() {
  const [routes, setRoutes] = useState<HikingRoute[]>([]);
  const [selectedImage, setSelectedImage] = useState<{
    images: string[];
    index: number;
    routeName: string;
  } | null>(null);

  useEffect(() => {
    const routesQuery = makeQuery("outdoor/hiking");
    GET<HikingRoute[]>(routesQuery).then((routes) => {
      setRoutes(routes.sort(routeCompare).filter((r) => !r.archived));
    });
  }, []);

  function routeCompare(routeA: HikingRoute, routeB: HikingRoute) {
    if (routeA.dates.length === 0 && routeB.dates.length === 0) return 0;
    if (routeA.dates.length === 0) return 1;
    if (routeB.dates.length === 0) return -1;
    const dateA = new Date(routeA.dates[0]);
    const dateB = new Date(routeB.dates[0]);
    return dateA < dateB ? 1 : dateA > dateB ? -1 : 0;
  }

  return (
    <div className="flex flex-col items-center gap-8 px-4 py-8">
      <PageTitle>Hiking Routes</PageTitle>

      {selectedImage && (
        <ImageModal
          images={selectedImage.images}
          currentIndex={selectedImage.index}
          name={selectedImage.routeName}
          onClose={() => setSelectedImage(null)}
          onNavigate={(index) => setSelectedImage({ ...selectedImage, index })}
        />
      )}

      {routes.length === 0 ? (
        <Loader text="Loading routes" />
      ) : (
        <div className="flex w-full flex-col gap-3 md:w-4/5">
          {routes
            .filter(
              (route) => route.dates.length > 0 && route.imageLinks.length > 0,
            )
            .map((route) => (
              <div
                key={route.routeId}
                className="group flex flex-col overflow-clip rounded-lg border-b border-neutral-200 bg-white md:flex-row"
              >
                {route.imageLinks.length > 0 && (
                  <div
                    className="group/image relative h-48 w-full cursor-pointer md:h-[190px] md:w-[190px] md:flex-shrink-0"
                    onClick={() =>
                      setSelectedImage({
                        images: route.imageLinks,
                        index: 0,
                        routeName: route.name,
                      })
                    }
                  >
                    <LazyImage
                      src={route.imageLinks[0]}
                      alt={route.name}
                      className="h-full w-full"
                      onClick={() => {}}
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-200 group-hover/image:opacity-100">
                      <div className="flex items-center gap-2 text-white">
                        <ImageIcon size={20} weight="bold" />
                        <span className="text-sm font-medium">More photos</span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex flex-1 flex-col gap-2 px-6 py-4">
                  <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div className="font-sanchez text-xl text-balance">
                      {route.name}
                    </div>

                    <div className="flex flex-none flex-row gap-3">
                      {route.dates.map((date) => (
                        <div className="text-sm text-black/75">
                          {new Date(date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 text-sm text-black/75 md:flex-row md:items-start md:justify-between md:gap-4">
                    <div className="flex flex-col gap-2">
                      <div className="flex flex-row pb-1">
                        {route.stars !== null &&
                          route.stars > 0 &&
                          Array.from({ length: 5 }).map((_, i) => (
                            <StarIcon
                              key={i}
                              size={16}
                              weight="duotone"
                              color="#6283c0"
                              className={cn(
                                "flex-none",
                                i < (route.stars ?? 0)
                                  ? "opacity-100"
                                  : "opacity-40",
                              )}
                            />
                          ))}
                      </div>

                      <div className="flex flex-row items-center gap-2">
                        <RulerIcon
                          size={16}
                          weight="duotone"
                          color="#6283c0"
                          className="flex-none"
                        />
                        {formatDistance(route.miles)} mi
                      </div>

                      <div className="flex flex-row items-center gap-2">
                        <MountainsIcon
                          size={16}
                          weight="duotone"
                          color="#6283c0"
                          className="flex-none"
                        />
                        {route.elevation !== null
                          ? `${route.elevation.toLocaleString()} ft`
                          : ""}
                      </div>

                      <div className="flex flex-row items-center gap-2">
                        <MapTrifoldIcon
                          size={16}
                          weight="duotone"
                          color="#6283c0"
                          className="flex-none"
                        />
                        {route.area} | {route.region}
                      </div>
                    </div>

                    {route.coordinates && (
                      <div className="flex flex-row items-center gap-2 text-sm text-black/75 transition-all group-hover:opacity-100 md:opacity-0">
                        <SignpostIcon
                          size={16}
                          weight="duotone"
                          color="#6283c0"
                        />
                        <SimpleLink
                          link={`https://www.google.com/maps/search/?api=1&query=${route.coordinates.latitude},${route.coordinates.longitude}`}
                          sameWindow={false}
                          className="text-sm"
                        >
                          Trailhead
                        </SimpleLink>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

interface LazyImageProps {
  src: string;
  alt: string;
  className: string;
  onClick: () => void;
}

function LazyImage({ src, alt, className, onClick }: LazyImageProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      {!isLoaded && (
        <div className="absolute inset-0 animate-pulse bg-neutral-200" />
      )}
      {isVisible && (
        <img
          src={src}
          alt={alt}
          className={cn(
            "hiking-image h-full w-full object-cover transition-opacity duration-200",
            isLoaded ? "opacity-100" : "opacity-0",
          )}
          onClick={onClick}
          onLoad={() => setIsLoaded(true)}
        />
      )}
    </div>
  );
}
