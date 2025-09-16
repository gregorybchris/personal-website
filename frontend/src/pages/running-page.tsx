import { useEffect, useState } from "react";
import { MapContainer, Polyline, TileLayer, useMap } from "react-leaflet";
import { useNavigate, useParams } from "react-router-dom";
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
  tags: string[];
}

export interface RouteData {
  points: RouteDataPoint[];
}

export interface RouteDataPoint {
  latitude: number;
  longitude: number;
  elevation: number;
}

export function RunningPage() {
  const [routes, setRoutes] = useState<RunningRoute[]>([]);
  const [currentRoute, setCurrentRoute] = useState<RunningRoute | null>(null);
  const [currentRouteData, setCurrentRouteData] = useState<RouteData | null>(
    null,
  );
  const [mapBoxToken, setMapBoxToken] = useState("");
  const { slug } = useParams();
  let navigate = useNavigate();

  useEffect(() => {
    const token = import.meta.env.VITE_MAPBOX_TOKEN;
    if (token) {
      setMapBoxToken(token);
    }

    const routesQuery = makeQuery("outdoor/running");
    GET(routesQuery).then((routes: RunningRoute[]) => {
      setRoutes(routes.sort(routeCompare));
    });
  }, []);

  useEffect(() => {
    if (routes.length === 0) return;

    if (slug) {
      const match = routes.find((route) => route.slug === slug);
      onSelectRoute(match || routes[0]);
    } else {
      onSelectRoute(routes[0], false);
    }
  }, [slug, routes]);

  async function onSelectRoute(route: RunningRoute, nav: boolean = true) {
    if (nav) {
      navigate(`/running/${route.slug}`);
    }

    const routeDataUrl = route.route_data_link;
    const routeData = await GET(routeDataUrl);
    setCurrentRoute(route);
    setCurrentRouteData(routeData);
  }

  function routeCompare(routeA: RunningRoute, routeB: RunningRoute) {
    const [cityA, cityB] = [routeA.tags[0], routeB.tags[0]];
    const [distanceA, distanceB] = [routeA.distance, routeB.distance];
    const cityCompare = cityA < cityB ? -1 : cityA > cityB ? 1 : 0;
    const distanceCompare =
      distanceA < distanceB ? -1 : distanceA > distanceB ? 1 : 0;

    if (cityCompare !== 0) {
      return cityCompare;
    } else {
      return distanceCompare * -1;
    }
  }

  return (
    <div className="flex flex-col items-center gap-10 px-4 py-8">
      <div className="flex flex-col items-center gap-4 md:w-4/5">
        <PageTitle>Running Routes</PageTitle>

        <div className="text-center text-black/75 md:w-[70%]">
          If you like running and happen to be in a city I've lived in, then
          this page is for you.
        </div>
      </div>

      <div className="flex w-full flex-row flex-wrap">
        {currentRoute && currentRouteData && (
          <RouteMapCard
            routeData={currentRouteData}
            route={currentRoute}
            mapBoxToken={mapBoxToken}
          />
        )}
        <RoutesTable routes={routes} onSelectRoute={onSelectRoute} />
      </div>
    </div>
  );
}

interface RouteMapCardProps {
  route: RunningRoute;
  routeData: RouteData;
  mapBoxToken: string;
}

function RouteMapCard({ route, routeData, mapBoxToken }: RouteMapCardProps) {
  return (
    <div className="block w-full px-4 align-top md:inline-block md:w-[50%]">
      <div className="inline border-b border-accent pb-1 text-lg font-bold">
        {route.name}
      </div>
      <div className="mt-5 h-[450px] w-full shadow-[0_0_6px_2px_rgba(0,0,0,0.3)]">
        {mapBoxToken && (
          <MapContainer
            className="!z-[10] h-full w-full"
            center={[51.505, -0.09]}
            zoom={13}
            scrollWheelZoom={true}
          >
            <RouteMap routeData={routeData} />
            <TileLayer
              url="https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}"
              id="mapbox/streets-v11"
              attribution=""
              maxZoom={18}
              tileSize={512}
              zoomOffset={-1}
              accessToken={mapBoxToken}
            />
            <Polyline
              positions={routeData.points.map((p) => [p.latitude, p.longitude])}
            />
          </MapContainer>
        )}
        {!mapBoxToken && (
          <div className="text-md px-4 py-5 font-sanchez font-bold text-black/75">
            Failed to load MapBox data
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
    <div className="mt-8 inline-block h-[500px] w-[100%] overflow-y-scroll text-center align-top md:w-[50%]">
      <table className="Running-table border-l-2 border-accent pl-4 font-raleway">
        <thead className="Running-table-header sticky top-0 bg-parchment font-bold">
          <tr className="Running-table-row">
            <td className="Running-table-cell">
              <span className="Running-table-header-cell-text">Route</span>
            </td>
            <td className="Running-table-cell">
              <span className="Running-table-header-cell-text">Distance</span>
            </td>
            <td className="Running-table-cell">
              <span className="Running-table-header-cell-text">Elevation</span>
            </td>
            <td className="Running-table-cell">
              <span className="Running-table-header-cell-text">City</span>
            </td>
          </tr>
        </thead>
        <tbody className="Running-table-body RunningRoutes-routes-table-body">
          {routes.map((route, routeNumber) => (
            <tr className="Running-table-row" key={routeNumber}>
              <td
                className="Running-table-cell cursor-pointer text-accent hover:text-royal"
                onClick={() => onSelectRoute(route)}
              >
                {route.name}
              </td>
              <td
                className="Running-table-cell"
                title={`${(route.distance * 1.609344).toFixed(1)} km`}
              >
                {route.distance} mi
              </td>
              <td
                className="Running-table-cell"
                title={`${(route.elevation * 0.3048).toFixed(0)} m`}
              >
                {route.elevation} ft
              </td>
              <td className="Running-table-cell RunningRoutes-tag">
                {route.tags[0]}
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
    let points = routeData.points;
    map.fitBounds(points.map((p) => [p.latitude, p.longitude]));
  }

  return <div></div>;
}
