import { RouteData } from "../models/routesModels";
import { useEffect } from "react";
import { useMap } from "react-leaflet";

interface RouteMapProps {
  routeData: RouteData;
}

export function RouteMap(props: RouteMapProps) {
  const map = useMap();

  useEffect(() => {
    updateMap();
  }, [props.routeData]);

  function updateMap() {
    let points = props.routeData.points;
    map.fitBounds(points.map((p) => [p.latitude, p.longitude]));
  }

  return <div></div>;
}
