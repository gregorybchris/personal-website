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
  const [currentRouteData, setCurrentRouteData] = useState<RouteData | null>(null);
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
    const distanceCompare = distanceA < distanceB ? -1 : distanceA > distanceB ? 1 : 0;

    if (cityCompare !== 0) {
      return cityCompare;
    } else {
      return distanceCompare * -1;
    }
  }

  return (
    <div className="p-8">
      <div className="mb-8 p-0 w-[100%] md:w-[80%] mx-auto text-center md:pb-5">
        <div className="font-noto text-text-1 text-3xl font-bold block pb-3">Running Routes</div>
        <div className="font-raleway text-text-1 block w-[80%] mx-auto py-3">
          Here you'll find an archive of some of my favorite running routes over the years. I have some from high school
          in Indianapolis, some from college in Boston, and a growing number from different neighborhoods around
          Seattle.
        </div>
      </div>

      <div className="inline-block align-top text-center w-[100%] md:w-[50%] h-[500px] overflow-y-scroll">
        <table className="Common-table border-l-2 border-accent">
          <thead className="Common-table-header sticky top-0 bg-background">
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
          <tbody className="Common-table-body RunningRoutes-routes-table-body">
            {routes.map((route, routeNumber) => (
              <tr className="Common-table-row" key={routeNumber}>
                <td className="Common-table-cell Common-simple-link" onClick={() => onSelectRoute(route)}>
                  {route.name}
                </td>
                <td className="Common-table-cell" title={`${(route.distance * 1.609344).toFixed(1)} km`}>
                  {route.distance} mi
                </td>
                <td className="Common-table-cell" title={`${(route.elevation * 0.3048).toFixed(0)} m`}>
                  {route.elevation} ft
                </td>
                <td className="Common-table-cell RunningRoutes-tag">{route.tags[0]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {currentRoute && currentRouteData && (
        <div className="block md:inline-block align-top w-full md:w-[50%] px-4 md:mx-auto">
          <div className="font-noto font-bold text-lg pb-1 border-b border-accent inline">{currentRoute?.name}</div>
          <div className="w-full h-[450px] shadow-[0_0_6px_2px_rgba(0,0,0,0.3)] mt-5">
            {mapBoxToken && (
              <MapContainer className="w-full h-full" center={[51.505, -0.09]} zoom={13} scrollWheelZoom={true}>
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
                <Polyline positions={currentRouteData.points.map((p) => [p.latitude, p.longitude])} />
              </MapContainer>
            )}
            {!mapBoxToken && (
              <div className="font-noto text-text-1 text-md font-bold px-4 py-5">Failed to load MapBox data</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
