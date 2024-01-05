import "../styles/common.css";

import { GET, makeQuery } from "../utilities/requestUtilities";
import { MapContainer, Polyline, TileLayer } from "react-leaflet";
import { RouteData, RunningRoute } from "../models/routesModels";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { RouteMap } from "../components/RouteMap";

export function RunningRoutesPage() {
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
    if (routes.length == 0) return;

    if (slug) {
      const match = routes.find((route) => route.slug == slug);
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
    <div className="p-8">
      <div className="mx-auto mb-8 w-[100%] p-0 text-center md:w-[80%] md:pb-5">
        <div className="block pb-3 font-noto text-3xl font-bold text-text-1">
          Running Routes
        </div>
        <div className="mx-auto block w-[80%] py-3 font-raleway text-text-1">
          Here you'll find an archive of some of my favorite running routes over
          the years. I have some from high school in Indianapolis, some from
          college in Boston, and a growing number from different neighborhoods
          around Seattle.
        </div>
      </div>

      <div className="inline-block h-[500px] w-[100%] overflow-y-scroll text-center align-top md:w-[50%]">
        <table className="Common-table border-l-2 border-accent pl-4">
          <thead className="Common-table-header sticky top-0 bg-background font-noto font-bold">
            <tr className="Common-table-row">
              <td className="Common-table-cell">
                <span className="Common-table-header-cell-text">Route</span>
              </td>
              <td className="Common-table-cell">
                <span className="Common-table-header-cell-text">Distance</span>
              </td>
              <td className="Common-table-cell">
                <span className="Common-table-header-cell-text">Elevation</span>
              </td>
              <td className="Common-table-cell">
                <span className="Common-table-header-cell-text">City</span>
              </td>
            </tr>
          </thead>
          <tbody className="Common-table-body RunningRoutes-routes-table-body font-raleway">
            {routes.map((route, routeNumber) => (
              <tr className="Common-table-row" key={routeNumber}>
                <td
                  className="Common-table-cell Common-simple-link"
                  onClick={() => onSelectRoute(route)}
                >
                  {route.name}
                </td>
                <td
                  className="Common-table-cell"
                  title={`${(route.distance * 1.609344).toFixed(1)} km`}
                >
                  {route.distance} mi
                </td>
                <td
                  className="Common-table-cell"
                  title={`${(route.elevation * 0.3048).toFixed(0)} m`}
                >
                  {route.elevation} ft
                </td>
                <td className="Common-table-cell RunningRoutes-tag">
                  {route.tags[0]}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {currentRoute && currentRouteData && (
        <div className="block w-full px-4 align-top md:mx-auto md:inline-block md:w-[50%]">
          <div className="inline border-b border-accent pb-1 font-noto text-lg font-bold">
            {currentRoute?.name}
          </div>
          <div className="mt-5 h-[450px] w-full shadow-[0_0_6px_2px_rgba(0,0,0,0.3)]">
            {mapBoxToken && (
              <MapContainer
                className="h-full w-full"
                center={[51.505, -0.09]}
                zoom={13}
                scrollWheelZoom={true}
              >
                <RouteMap routeData={currentRouteData} />
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
                  positions={currentRouteData.points.map((p) => [
                    p.latitude,
                    p.longitude,
                  ])}
                />
              </MapContainer>
            )}
            {!mapBoxToken && (
              <div className="text-md px-4 py-5 font-noto font-bold text-text-1">
                Failed to load MapBox data
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
