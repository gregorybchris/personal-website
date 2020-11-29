interface RunningRouteRecord {
  route_id: string;
  name: string;
  slug: string;
  route_type: string;
  distance: number;
  elevation: number;
  mapometer_id: number;
  tags: string[];
}

export default RunningRouteRecord;