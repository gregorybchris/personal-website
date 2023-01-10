import "./styles/RunningRoutes.sass";

import { GET, makeQuery } from "../../utilities/requestUtilities";
import { MapContainer, Polyline, TileLayer } from "react-leaflet";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import RouteDataModel from "./models/RouteData";
import RouteMap from "./RouteMap";
import RunningRouteModel from "./models/RunningRoute";

export default function RunningRoutes() {
  const [routes, setRoutes] = useState<RunningRouteModel[]>([]);
  const [currentRoute, setCurrentRoute] = useState<RunningRouteModel | null>(null);
  const [currentRouteData, setCurrentRouteData] = useState<RouteDataModel | null>(null);
  const [mapBoxToken, setMapBoxToken] = useState("");
  const { slug } = useParams();
  let navigate = useNavigate();

  useEffect(() => {
    const token = import.meta.env.VITE_MAPBOX_TOKEN;
    if (token) {
      setMapBoxToken(token);
    }

    const routesQuery = makeQuery("outdoor/running");
    GET(routesQuery).then((routes: RunningRouteModel[]) => {
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

  async function onSelectRoute(route: RunningRouteModel, nav: boolean = true) {
    if (nav) {
      navigate(`/running/${route.slug}`);
    }

    const routeDataUrl = route.route_data_link;
    const routeData = await GET(routeDataUrl);
    setCurrentRoute(route);
    setCurrentRouteData(routeData);
  }

  function routeCompare(routeA: RunningRouteModel, routeB: RunningRouteModel) {
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
    <div className="RunningRoutes">
      <div className="RunningRoutes-header">
        <div className="RunningRoutes-title">Running Routes</div>
        <div className="RunningRoutes-about">
          Here you'll find an archive of some of my favorite running routes over the years. I have some from high school
          in Indianapolis, some from college in Boston, and a growing number from different neighborhoods around
          Seattle.
        </div>
      </div>

      <div className="RunningRoutes-routes">
        <table className="Common-table">
          <thead className="Common-table-header">
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
          <tbody className="Common-table-body">
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
        <div className="RunningRoutes-map-section">
          <div className="RunningRoutes-map-route-name">{currentRoute?.name}</div>
          <div className="RunningRoutes-map-wrap">
            {mapBoxToken && (
              <MapContainer className="RunningRoutes-map" center={[51.505, -0.09]} zoom={13} scrollWheelZoom={true}>
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
            {!mapBoxToken && <div className="RunningRoutes-map-error">Failed to load MapBox data</div>}
          </div>
        </div>
      )}
    </div>
  );
}
