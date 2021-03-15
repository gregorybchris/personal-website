interface RunningRoute {
  route_id: string;
  name: string;
  slug: string;
  route_type: string;
  distance: number;
  elevation: number;
  route_data_link: string;
  mapometer_id: number;
  tags: string[];
}

export default RunningRoute;
