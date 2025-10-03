import {
  MapTrifoldIcon,
  RulerIcon,
  SignpostIcon,
  StarIcon,
} from "@phosphor-icons/react";
import { MountainsIcon } from "@phosphor-icons/react/dist/ssr";
import { useEffect, useState } from "react";
import { ImageModal } from "../components/image-modal";
import { Loader } from "../components/loader";
import { PageTitle } from "../components/page-title";
import { SimpleLink } from "../components/simple-link";
import { GET, makeQuery } from "../utilities/request-utilities";
import { cn } from "../utilities/style-utilities";

export interface HikingRoute {
  route_id: string;
  name: string;
  slug: string;
  dates: string[];
  miles: number;
  elevation: number | null;
  area: string;
  region: string;
  travel_time: string | null;
  notes: string | null;
  coordinates: {
    latitude: number;
    longitude: number;
    formatted: string;
  } | null;
  stars: number | null;
  archived: boolean;
  image_links: string[];
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
  } | null>(null);

  useEffect(() => {
    const routesQuery = makeQuery("outdoor/hiking");
    GET(routesQuery).then((routes: HikingRoute[]) => {
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
      <div className="flex flex-col items-center gap-4 md:w-4/5">
        <PageTitle>Hiking Routes</PageTitle>

        <div className="text-center text-black/75 md:w-[70%]">
          Some hikes I've done!
        </div>
      </div>

      {selectedImage && (
        <ImageModal
          images={selectedImage.images}
          currentIndex={selectedImage.index}
          onClose={() => setSelectedImage(null)}
          onNavigate={(index) =>
            setSelectedImage({ ...selectedImage, index })
          }
        />
      )}

      {routes.length === 0 ? (
        <Loader>Loading routes...</Loader>
      ) : (
        <div className="flex w-full flex-col gap-3 md:w-4/5">
          {routes
            .filter(
              (route) => route.dates.length > 0 && route.image_links.length > 0,
            )
            .map((route) => (
              <div
                key={route.route_id}
                className="group flex flex-col overflow-clip rounded-lg border-b border-neutral-200 bg-white md:flex-row"
              >
                {route.image_links.length > 0 && (
                  <img
                    src={route.image_links[0]}
                    alt={route.name}
                    className="h-48 w-full cursor-pointer object-cover md:h-[190px] md:w-[190px] md:flex-shrink-0"
                    onClick={() =>
                      setSelectedImage({
                        images: route.image_links,
                        index: 0,
                      })
                    }
                  />
                )}

                <div className="flex flex-1 flex-col gap-2 px-6 py-4">
                  <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div className="font-sanchez text-xl text-balance">
                      {route.name}
                    </div>

                    <div className="flex flex-row gap-3">
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
