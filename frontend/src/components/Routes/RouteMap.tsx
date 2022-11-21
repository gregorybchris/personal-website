import "./styles/RunningRoutes.sass";

import RouteDataModel from "./models/RouteData";
import { useEffect } from "react";
import { useMap } from "react-leaflet";

interface RouteMapProps {
  routeData: RouteDataModel;
}

export default function RouteMap(props: RouteMapProps) {
  const map = useMap();

  useEffect(() => {
    updateMap();
  }, [props.routeData]);

  function updateMap() {
    let points = props.routeData.points;
    map.fitBounds(points.map((p) => [p.latitude, p.longitude]));
  }

  return <div className="RouteMap"></div>;
}
