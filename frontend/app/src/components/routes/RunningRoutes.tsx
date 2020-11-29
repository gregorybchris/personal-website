import React from "react";

import { makeQuery, GET } from "../../utilities/RequestUtilities";
import RunningRouteModel from "./models/RunningRoute";

import "./styles/RunningRoutes.sass";

export interface RunningRoutesProps {}

export interface RunningRoutesState {
  routes: RunningRouteModel[];
}

class RunningRoutes extends React.Component<
  RunningRoutesProps,
  RunningRoutesState
> {
  state: RunningRoutesState = {
    routes: [],
  };

  sortRoutesByTags = (routes: RunningRouteModel[]) => {
    return routes.sort(
      (routeA: RunningRouteModel, routeB: RunningRouteModel) => {
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
      }
    );
  };

  sortRoutesByName = (routes: RunningRouteModel[]) => {
    return routes.sort(
      (routeA: RunningRouteModel, routeB: RunningRouteModel) => {
        return routeA.name < routeB.name ? -1 : 1;
      }
    );
  };

  async componentDidMount() {
    const routesQuery = makeQuery("outdoor/running");
    const queryResult = await GET(routesQuery);
    const sortedRoutes = this.sortRoutesByTags(queryResult);
    this.setState({ routes: sortedRoutes });
  }

  getMapometerLink = (routeModel: RunningRouteModel) => {
    const mapometerId = routeModel.mapometer_id;
    return `https://us.mapometer.com/running/route_${mapometerId}.html`;
  };

  createRouteTagElement = (tag: string) => {
    return <div className="RunningRoutes-tag">{tag}</div>;
  };

  createRouteElement = (routeModel: RunningRouteModel) => {
    const mapometerLink = this.getMapometerLink(routeModel);
    return (
      <div className="RunningRoutes-route" key={routeModel.route_id}>
        <div className="RunningRoutes-name">
          <a
            href={mapometerLink}
            target="_blank"
            rel="noopener noreferrer"
            className="Common-simple-link"
          >
            {routeModel.name}
          </a>
        </div>
        <div className="RunningRoutes-info">{routeModel.distance}mi</div>
        <div className="RunningRoutes-info">{routeModel.elevation}ft</div>
        <div className="RunningRoutes-tags">
          {routeModel.tags.map(this.createRouteTagElement)}
        </div>
      </div>
    );
  };

  render() {
    return (
      <div className="RunningRoutes">
        <div className="RunningRoutes-routes">
          {this.state.routes.map(this.createRouteElement)}
        </div>
      </div>
    );
  }
}

export default RunningRoutes;
