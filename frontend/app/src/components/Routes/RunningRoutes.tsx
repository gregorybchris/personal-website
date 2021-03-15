import React from "react";

import { LatLngExpression, Map } from "leaflet";
import { MapContainer, TileLayer, Polyline } from "react-leaflet";

import { makeQuery, GET } from "../../utilities/RequestUtilities";
import RunningRouteModel from "./models/RunningRoute";
import RouteDataModel from "./models/RouteData";

import "./styles/RunningRoutes.sass";

interface RunningRoutesProps {}

interface RunningRoutesState {
  routes: RunningRouteModel[];
  currentRoute: RunningRouteModel | null;
  currentRouteData: RouteDataModel | null;
}

class RunningRoutes extends React.Component<RunningRoutesProps, RunningRoutesState> {
  state: RunningRoutesState = {
    routes: [],
    currentRoute: null,
    currentRouteData: null,
  };

  private map: Map | null = null;

  sortRoutesByTags = (routes: RunningRouteModel[]) => {
    return routes.sort((routeA: RunningRouteModel, routeB: RunningRouteModel) => {
      const numTagsA = routeA.tags.length;
      const numTagsB = routeB.tags.length;
      const minTags = Math.min(numTagsA, numTagsB);
      for (let i = 0; i < minTags; i++) {
        if (routeA.tags[i] < routeB.tags[i]) {
          return -1;
        } else if (routeA.tags[i] > routeB.tags[i]) {
          return 1;
        }
      }
      return numTagsA - numTagsB;
    });
  };

  sortRoutesByName = (routes: RunningRouteModel[]) => {
    return routes.sort((routeA: RunningRouteModel, routeB: RunningRouteModel) => {
      return routeA.name < routeB.name ? -1 : 1;
    });
  };

  async componentDidMount() {
    const routesQuery = makeQuery("outdoor/running");
    const routes = await GET(routesQuery);
    const sortedRoutes = this.sortRoutesByTags(routes);
    this.setState({ routes: sortedRoutes });

    this.onRouteClick(this.state.routes[0]);
  }

  createRouteTagElement = (tag: string) => {
    return (
      <div className="RunningRoutes-tag" key={tag}>
        {tag}
      </div>
    );
  };

  onRouteClick = async (routeModel: RunningRouteModel) => {
    const routeDataUrl = routeModel.route_data_link;
    const routeData = await GET(routeDataUrl);
    this.setState({ currentRoute: routeModel });
    this.setState({ currentRouteData: routeData });
    this.updateMap();
  };

  createRouteElement = (routeModel: RunningRouteModel) => {
    return (
      <div className="RunningRoutes-route" key={routeModel.route_id}>
        <div className="RunningRoutes-name Common-simple-link" onClick={() => this.onRouteClick(routeModel)}>
          {routeModel.name}
        </div>
        <div className="RunningRoutes-info">{routeModel.distance}mi</div>
        <div className="RunningRoutes-info">{routeModel.elevation}ft</div>
        <div className="RunningRoutes-tags">{routeModel.tags.map(this.createRouteTagElement)}</div>
      </div>
    );
  };

  initializeMap = (map: Map) => {
    this.map = map;
    this.updateMap();
  };

  updateMap = () => {
    if (this.state.currentRouteData && this.map) {
      let points = this.state.currentRouteData.points;
      let minLat: number, maxLat: number, minLon: number, maxLon: number;
      minLat = maxLat = points[0].latitude;
      minLon = maxLon = points[0].longitude;
      points.forEach((point) => {
        minLat = Math.min(point.latitude, minLat);
        maxLat = Math.max(point.latitude, maxLat);
        minLon = Math.min(point.longitude, minLon);
        maxLon = Math.max(point.longitude, maxLon);
      });
      const position: LatLngExpression = [(minLat + maxLat) / 2, (minLon + maxLon) / 2];

      this.map.setView(position, this.map.getZoom());
    }
  };

  createMapElement = () => {
    if (!this.state.currentRoute || !this.state.currentRouteData) {
      return;
    }

    return (
      <MapContainer
        className="RunningRoutes-map"
        whenCreated={this.initializeMap}
        center={[51.505, -0.09]}
        zoom={13}
        scrollWheelZoom={true}
      >
        <TileLayer
          url="https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}"
          id="mapbox/streets-v11"
          attribution=""
          maxZoom={18}
          tileSize={512}
          zoomOffset={-1}
          accessToken={process.env.REACT_APP_MAPBOX_TOKEN}
        />
        <Polyline positions={this.state.currentRouteData.points.map((p) => [p.latitude, p.longitude])} />
      </MapContainer>
    );
  };

  render() {
    return (
      <div className="RunningRoutes">
        <div className="RunningRoutes-header">
          <div className="RunningRoutes-title">Running Routes</div>
          <div className="RunningRoutes-about">
            Here you'll find an archive of some of my favorite running routes over the years. I have some from high
            school in Indianapolis, some from college in Boston, and a growing number from different neighborhoods
            around Seattle.
          </div>
        </div>
        <div className="RunningRoutes-routes">{this.state.routes.map(this.createRouteElement)}</div>
        <div className="RunningRoutes-map-section">
          <div className="RunningRoutes-map-route-name">{this.state.currentRoute?.name}</div>
          <div className="RunningRoutes-map-wrap">{this.createMapElement()}</div>
        </div>
      </div>
    );
  }
}

export default RunningRoutes;
