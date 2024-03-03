import { useEffect } from "react";
import { useMap } from "react-leaflet";
import { RouteData } from "../models/routesModels";

interface RouteMapProps {
  routeData: RouteData;
}

export function RouteMap({ routeData }: RouteMapProps) {
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
