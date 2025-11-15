import {
  ArrowDownIcon,
  ArrowUpIcon,
  CaretCircleRightIcon,
  ListMagnifyingGlassIcon,
} from "@phosphor-icons/react";
import { useEffect, useMemo, useState } from "react";
import { MapContainer, Polyline, TileLayer, useMap } from "react-leaflet";
import { useNavigate, useParams } from "react-router-dom";
import { ErrorMessage } from "../components/error-message";
import { Loader } from "../components/loader";
import { PageTitle } from "../components/page-title";
import "../styles/running.css";
import { GET, makeQuery } from "../utilities/request-utilities";
import { cn } from "../utilities/style-utilities";

export interface RunningRoute {
  routeId: string;
  name: string;
  slug: string;
  distance: number;
  elevation: number;
  routeDataLink: string;
  mapometerId: number;
  city: string;
  stars: number | null;
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

function defaultRouteCompare(routeA: RunningRoute, routeB: RunningRoute) {
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
    GET<RunningRoute[]>(routesQuery)
      .then((routes: RunningRoute[]) => {
        setRoutes(routes.sort(defaultRouteCompare).filter((r) => !r.archived));
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, routes]);

  async function onSelectRoute(route: RunningRoute, nav: boolean = true) {
    if (nav) {
      navigate(`/running/${route.slug}`);
    }

    const routeDataUrl = route.routeDataLink;
    const routeData = await fetch(routeDataUrl).then((res) => res.json());
    setCurrentRoute(route);
    setCurrentRouteData(routeData);
    setShowRoutesTable(false);
  }

  return (
    <div className="flex flex-col items-center gap-5 px-4 py-8">
      <div className="flex flex-col items-center gap-2">
        <PageTitle>Running Routes</PageTitle>

        <div className="max-w-md text-center text-sm text-balance text-black/60 md:text-base">
          If you enjoy running and happen to be in one of the cities I've lived
          in, then this page is for you.
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
            currentRoute={currentRoute}
          />
        </div>
      ) : (
        <Loader text="Loading routes" />
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
  currentRoute: RunningRoute | null;
}

function RouteMapCard({
  route,
  routeData,
  showRoutesTable,
  setShowRoutesTable,
  routes,
  onSelectRoute,
  currentRoute,
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
          key={route.routeId}
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
              <RoutesTable
                routes={routes}
                onSelectRoute={onSelectRoute}
                currentRoute={currentRoute}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

type Column = "name" | "distance" | "elevation" | "city";
type SortDirection = "asc" | "desc";

interface SortIconProps {
  column: Column;
  sortColumn: Column | null;
  sortDirection: SortDirection | null;
}

function SortIcon({ column, sortColumn, sortDirection }: SortIconProps) {
  if (sortColumn === column && sortDirection === "asc") {
    return <ArrowUpIcon size={14} weight="bold" />;
  } else if (sortColumn === column && sortDirection === "desc") {
    return <ArrowDownIcon size={14} weight="bold" />;
  } else {
    return <span className="w-3.5" />;
  }
}

interface ColumnHeaderProps {
  column: Column;
  label: string;
  sortColumn: Column | null;
  sortDirection: SortDirection | null;
  onClick: (column: Column) => void;
  hiddenOnSmall?: boolean;
}

function ColumnHeader({
  column,
  label,
  sortColumn,
  sortDirection,
  onClick,
  hiddenOnSmall = false,
}: ColumnHeaderProps) {
  return (
    <td
      className={cn(
        "Running-table-cell cursor-pointer underline decoration-blue-500/60 underline-offset-4 hover:text-black/60 hover:decoration-blue-500/30",
        hiddenOnSmall && "hidden md:table-cell",
      )}
      onClick={() => onClick(column)}
    >
      <div className="flex items-center gap-1">
        <span>{label}</span>
        <SortIcon
          column={column}
          sortColumn={sortColumn}
          sortDirection={sortDirection}
        />
      </div>
    </td>
  );
}

interface RoutesTableProps {
  routes: RunningRoute[];
  onSelectRoute: (route: RunningRoute) => void;
  currentRoute: RunningRoute | null;
}

function RoutesTable({
  routes,
  onSelectRoute,
  currentRoute,
}: RoutesTableProps) {
  const [sortColumn, setSortColumn] = useState<Column | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection | null>(
    null,
  );

  const handleHeaderClick = (column: Column) => {
    if (sortColumn !== column) {
      // Clicking a different column: start with asc
      setSortColumn(column);
      setSortDirection("asc");
    } else if (sortDirection === "asc") {
      // Same column, currently asc: switch to desc
      setSortDirection("desc");
    } else if (sortDirection === "desc") {
      // Same column, currently desc: reset to default
      setSortColumn(null);
      setSortDirection(null);
    }
  };

  const sortedRoutes = useMemo(() => {
    if (!sortColumn || !sortDirection) {
      // No sort applied, use default sort
      return [...routes].sort(defaultRouteCompare);
    }

    return [...routes].sort((a, b) => {
      let compareResult = 0;

      switch (sortColumn) {
        case "name":
          compareResult = a.name.localeCompare(b.name);
          break;
        case "distance":
          compareResult = a.distance - b.distance;
          break;
        case "elevation":
          compareResult = a.elevation - b.elevation;
          break;
        case "city": {
          // Use the same city order as default sort
          const cityOrder = ["Seattle", "Boston", "Indy", "Berkeley"];
          const cityAIndex = cityOrder.indexOf(a.city);
          const cityBIndex = cityOrder.indexOf(b.city);
          compareResult = cityAIndex - cityBIndex;
          break;
        }
      }

      return sortDirection === "asc" ? compareResult : -compareResult;
    });
  }, [routes, sortColumn, sortDirection]);

  return (
    <div className="h-full overflow-y-scroll">
      <table className="Running-table font-raleway border-separate border-spacing-y-1">
        <thead className="Running-table-header font-sanchez sticky top-0 bg-white text-lg">
          <tr className="Running-table-row">
            <ColumnHeader
              column="name"
              label="Route"
              sortColumn={sortColumn}
              sortDirection={sortDirection}
              onClick={handleHeaderClick}
            />
            <ColumnHeader
              column="distance"
              label="Distance"
              sortColumn={sortColumn}
              sortDirection={sortDirection}
              onClick={handleHeaderClick}
            />
            <ColumnHeader
              column="elevation"
              label="Elevation"
              sortColumn={sortColumn}
              sortDirection={sortDirection}
              onClick={handleHeaderClick}
              hiddenOnSmall={true}
            />
            <ColumnHeader
              column="city"
              label="City"
              sortColumn={sortColumn}
              sortDirection={sortDirection}
              onClick={handleHeaderClick}
            />
          </tr>
        </thead>
        <tbody className="Running-table-body text-xs md:text-sm">
          {sortedRoutes.map((route, routeNumber) => (
            <tr
              className="Running-table-row group cursor-pointer transition-all"
              key={routeNumber}
              onClick={(event) => {
                event.preventDefault();
                onSelectRoute(route);
              }}
            >
              <td className="Running-table-cell text-sky group-hover:text-royal flex flex-row items-center gap-1">
                {currentRoute && route.routeId === currentRoute.routeId && (
                  <CaretCircleRightIcon
                    size={13}
                    weight="duotone"
                    color="#2563eb"
                  />
                )}
                <span>{route.name}</span>
              </td>
              <td
                className="Running-table-cell"
                title={`${(route.distance * 1.609344).toFixed(1)} km`}
              >
                <span className="group-hover:text-sky">
                  {formatDistance(route.distance)}
                </span>{" "}
                <span
                  className={cn(
                    "group-hover:text-sky text-black/30",
                    currentRoute &&
                      route.routeId === currentRoute.routeId &&
                      "text-inherit",
                  )}
                >
                  mi
                </span>
              </td>
              <td
                className="Running-table-cell hidden md:table-cell"
                title={`${(route.elevation * 0.3048).toFixed(0)} m`}
              >
                <span className="group-hover:text-sky">{route.elevation}</span>{" "}
                <span
                  className={cn(
                    "group-hover:text-sky text-black/30",
                    currentRoute &&
                      route.routeId === currentRoute.routeId &&
                      "text-inherit",
                  )}
                >
                  ft
                </span>
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeData]);

  function updateMap() {
    const points = routeData.points;
    map.fitBounds(points.map((p) => [p.latitude, p.longitude]));
  }

  return null;
}
