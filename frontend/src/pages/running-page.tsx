import { ListMagnifyingGlassIcon } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { MapContainer, Polyline, TileLayer, useMap } from "react-leaflet";
import { useNavigate, useParams } from "react-router-dom";
import { ErrorMessage } from "../components/error-message";
import { Loader } from "../components/loader";
import { PageTitle } from "../components/page-title";
import "../styles/running.css";
import { GET, makeQuery } from "../utilities/request-utilities";

export interface RunningRoute {
  route_id: string;
  name: string;
  slug: string;
  distance: number;
  elevation: number;
  route_data_link: string;
  mapometer_id: number;
  city: string;
  tags: string[];
  archived: boolean;
}

export interface RouteData {
  points: RouteDataPoint[];
}

export interface RouteDataPoint {
  latitude: number;
  longitude: number;
  elevation: number;
}

function formatDistance(n: number) {
  const distStr = n.toFixed(1);
  if (distStr.endsWith(".0")) {
    return distStr.slice(0, -2);
  }
  return distStr;
}

export function RunningPage() {
  const [routes, setRoutes] = useState<RunningRoute[]>([]);
  const [currentRoute, setCurrentRoute] = useState<RunningRoute | null>(null);
  const [currentRouteData, setCurrentRouteData] = useState<RouteData | null>(
    null,
  );
  const [showRoutesTable, setShowRoutesTable] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { slug } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const routesQuery = makeQuery("outdoor/running");
    GET(routesQuery)
      .then((routes: RunningRoute[]) => {
        setRoutes(routes.sort(routeCompare).filter((r) => !r.archived));
        setError(null);
      })
      .catch((err) => {
        console.error("Failed to load running routes:", err);
        setError("Failed to load running routes");
      });
  }, []);

  useEffect(() => {
    if (routes.length === 0) return;

    const selectInitialRoute = async () => {
      if (slug) {
        const match = routes.find((route) => route.slug === slug);
        await onSelectRoute(match || routes[0]);
      } else {
        await onSelectRoute(routes[0], false);
      }
    };

    selectInitialRoute();
  }, [slug, routes]);

  async function onSelectRoute(route: RunningRoute, nav: boolean = true) {
    if (nav) {
      navigate(`/running/${route.slug}`);
    }

    const routeDataUrl = route.route_data_link;
    const routeData = await GET(routeDataUrl);
    setCurrentRoute(route);
    setCurrentRouteData(routeData);
    setShowRoutesTable(false);
  }

  function routeCompare(routeA: RunningRoute, routeB: RunningRoute) {
    const [cityA, cityB] = [routeA.city, routeB.city];
    const [distanceA, distanceB] = [routeA.distance, routeB.distance];
    const cityOrder = ["Seattle", "Boston", "Indy", "Berkeley"];
    const cityAIndex = cityOrder.indexOf(cityA);
    const cityBIndex = cityOrder.indexOf(cityB);
    const cityCompare = cityAIndex - cityBIndex;
    const distanceCompare =
      distanceA < distanceB ? -1 : distanceA > distanceB ? 1 : 0;

    if (cityCompare !== 0) {
      return cityCompare;
    } else {
      return distanceCompare * -1;
    }
  }

  return (
    <div className="flex flex-col items-center gap-8 px-4 py-8">
      <div className="flex flex-col items-center gap-4 md:w-4/5">
        <PageTitle>Running Routes</PageTitle>

        <div className="text-center text-balance text-black/75 md:w-[70%]">
          This page is for you if you like running and happen to be in a city
          where I've lived.
        </div>
      </div>

      {error ? (
        <ErrorMessage message={error} />
      ) : currentRoute && currentRouteData ? (
        <div className="flex w-full flex-row flex-wrap justify-center gap-5">
          <RouteMapCard
            routeData={currentRouteData}
            route={currentRoute}
            showRoutesTable={showRoutesTable}
            setShowRoutesTable={setShowRoutesTable}
            routes={routes}
            onSelectRoute={onSelectRoute}
          />
        </div>
      ) : (
        <Loader>Loading routes...</Loader>
      )}
    </div>
  );
}

interface RouteMapCardProps {
  route: RunningRoute;
  routeData: RouteData;
  showRoutesTable: boolean;
  setShowRoutesTable: (show: boolean) => void;
  routes: RunningRoute[];
  onSelectRoute: (route: RunningRoute) => void;
}

function RouteMapCard({
  route,
  routeData,
  showRoutesTable,
  setShowRoutesTable,
  routes,
  onSelectRoute,
}: RouteMapCardProps) {
  const mapBoxToken = import.meta.env.VITE_MAPBOX_TOKEN;

  return (
    <div className="flex w-full flex-col gap-1 px-4 py-1 md:w-[max(50%,950px)]">
      <div className="font-sanchez flex flex-row items-center justify-between text-lg md:px-4">
        <div className="flex items-center gap-5">
          <div className="text-sm underline decoration-blue-500/60 underline-offset-4 md:text-lg">
            {route.name}
          </div>

          <div
            title={`${(route.distance * 1.609344).toFixed(1)} km`}
            className="text-xs md:text-lg"
          >
            {formatDistance(route.distance)}{" "}
            <span className="text-black/30">mi</span>
          </div>
        </div>

        <button
          onClick={() => setShowRoutesTable(!showRoutesTable)}
          className="flex cursor-pointer flex-row items-center gap-2 rounded-md px-2 py-0.5 text-xs text-black transition-all duration-200 hover:bg-black/5 md:text-lg"
        >
          <ListMagnifyingGlassIcon
            size={16}
            weight="duotone"
            color="#6283c0"
            className="mt-0.5"
          />
          <div>{showRoutesTable ? "hide routes" : "more routes"}</div>
        </button>
      </div>

      <div className="relative h-[450px] w-full overflow-clip rounded-xl border-4 border-white/60 shadow-md">
        <MapContainer
          key={route.route_id}
          className="!z-[10] h-full w-full"
          center={[51.505, -0.09]}
          zoom={13}
          scrollWheelZoom={true}
        >
          <RouteMap routeData={routeData} />
          <TileLayer
            url={`https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${mapBoxToken}`}
            id="mapbox/outdoors-v12"
            attribution=""
            maxZoom={18}
            tileSize={512}
            zoomOffset={-1}
          />
          <Polyline
            positions={routeData.points.map((p) => [p.latitude, p.longitude])}
          />
        </MapContainer>

        {showRoutesTable && (
          <div
            className="absolute inset-0 z-[1000] flex items-center justify-center bg-white/10 backdrop-blur-sm"
            onClick={() => setShowRoutesTable(false)}
          >
            <div
              className="h-[90%] max-w-[90%] overflow-hidden rounded-xl bg-white px-4 py-4 shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <RoutesTable routes={routes} onSelectRoute={onSelectRoute} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface RoutesTableProps {
  routes: RunningRoute[];
  onSelectRoute: (route: RunningRoute) => void;
}

function RoutesTable({ routes, onSelectRoute }: RoutesTableProps) {
  return (
    <div className="h-full overflow-y-scroll">
      <table className="Running-table font-raleway border-separate border-spacing-y-1">
        <thead className="Running-table-header font-sanchez sticky top-0 bg-white text-lg">
          <tr className="Running-table-row">
            <td className="Running-table-cell underline decoration-blue-500/60 underline-offset-4">
              Route
            </td>
            <td className="Running-table-cell underline decoration-blue-500/60 underline-offset-4">
              Distance
            </td>
            <td className="Running-table-cell hidden underline decoration-blue-500/60 underline-offset-4 md:table-cell">
              Elevation
            </td>
            <td className="Running-table-cell underline decoration-blue-500/60 underline-offset-4">
              City
            </td>
          </tr>
        </thead>
        <tbody className="Running-table-body text-xs md:text-sm">
          {routes.map((route, routeNumber) => (
            <tr
              className="Running-table-row group cursor-pointer"
              key={routeNumber}
              onClick={(event) => {
                event.preventDefault();
                onSelectRoute(route);
              }}
            >
              <td className="Running-table-cell text-sky group-hover:text-royal">
                {route.name}
              </td>
              <td
                className="Running-table-cell"
                title={`${(route.distance * 1.609344).toFixed(1)} km`}
              >
                <span className="group-hover:text-sky">
                  {formatDistance(route.distance)}
                </span>{" "}
                <span className="group-hover:text-sky text-black/30">mi</span>
              </td>
              <td
                className="Running-table-cell hidden md:table-cell"
                title={`${(route.elevation * 0.3048).toFixed(0)} m`}
              >
                <span className="group-hover:text-sky">{route.elevation}</span>{" "}
                <span className="group-hover:text-sky text-black/30">ft</span>
              </td>
              <td className="Running-table-cell">
                <span className="group-hover:text-sky">{route.city}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface RouteMapProps {
  routeData: RouteData;
}

function RouteMap({ routeData }: RouteMapProps) {
  const map = useMap();

  useEffect(() => {
    updateMap();
  }, [routeData]);

  function updateMap() {
    const points = routeData.points;
    map.fitBounds(points.map((p) => [p.latitude, p.longitude]));
  }

  return null;
}
