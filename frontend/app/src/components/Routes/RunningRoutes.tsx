import React from "react";

import { Map } from "leaflet";
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

  sortRoutes = (routes: RunningRouteModel[]) => {
    return routes.sort((routeA: RunningRouteModel, routeB: RunningRouteModel) => {
      const [cityA, cityB] = [routeA.tags[0], routeB.tags[0]];
      const [distanceA, distanceB] = [routeA.distance, routeB.distance];
      const cityCompare = cityA < cityB ? -1 : cityA > cityB ? 1 : 0;
      const distanceCompare = distanceA < distanceB ? -1 : distanceA > distanceB ? 1 : 0;

      if (cityCompare !== 0) {
        return cityCompare;
      } else {
        return distanceCompare * -1;
      }
    });
  };

  async componentDidMount() {
    const routesQuery = makeQuery("outdoor/running");
    const routes = await GET(routesQuery);
    const sortedRoutes = this.sortRoutes(routes);
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

  createRoutesTableElement = () => {
    return (
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
            {this.state.routes.map((route) => (
              <tr className="Common-table-row">
                <td className="Common-table-cell Common-simple-link" onClick={() => this.onRouteClick(route)}>
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
    );
  };

  initializeMap = (map: Map) => {
    this.map = map;
    this.updateMap();
  };

  updateMap = () => {
    if (this.state.currentRouteData && this.map) {
      let points = this.state.currentRouteData.points;
      this.map.fitBounds(points.map((p) => [p.latitude, p.longitude]));
    }
  };

  createMapElement = () => {
    if (!this.state.currentRoute || !this.state.currentRouteData) {
      return;
    }

    return (
      <div className="RunningRoutes-map-section">
        <div className="RunningRoutes-map-route-name">{this.state.currentRoute?.name}</div>
        <div className="RunningRoutes-map-wrap">
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
        </div>
      </div>
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
        {this.createRoutesTableElement()}
        {this.createMapElement()}
      </div>
    );
  }
}

export default RunningRoutes;
