import React from "react";

import { makeQuery, GET } from "../../controllers/RequestUtilities";
import RunningRouteRecord from "../../models/RunningRouteRecord";

import "./RunningRoutes.sass";

export interface RunningRoutesProps {}

export interface RunningRoutesState {
  routes: RunningRouteRecord[];
}

class RunningRoutes extends React.Component<
  RunningRoutesProps,
  RunningRoutesState
> {
  state = {
    routes: [],
  };

  sortRoutesByTags = (routes: RunningRouteRecord[]) => {
    return routes.sort(
      (routeA: RunningRouteRecord, routeB: RunningRouteRecord) => {
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

  sortRoutesByName = (routes: RunningRouteRecord[]) => {
    return routes.sort(
      (routeA: RunningRouteRecord, routeB: RunningRouteRecord) => {
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

  getMapometerLink = (routeRecord: RunningRouteRecord) => {
    const mapometerId = routeRecord.mapometer_id;
    return `https://us.mapometer.com/running/route_${mapometerId}.html`;
  };

  createRouteTagElement = (tag: string) => {
    return <div className="RunningRoutes-tag">{tag}</div>;
  };

  createRouteElement = (routeRecord: RunningRouteRecord) => {
    const mapometerLink = this.getMapometerLink(routeRecord);
    return (
      <div className="RunningRoutes-route" key={routeRecord.route_id}>
        <div className="RunningRoutes-name">
          <a
            href={mapometerLink}
            target="_blank"
            rel="noopener noreferrer"
            className="Common-simple-link"
          >
            {routeRecord.name}
          </a>
        </div>
        <div className="RunningRoutes-info">{routeRecord.distance}mi</div>
        <div className="RunningRoutes-info">{routeRecord.elevation}ft</div>
        <div className="RunningRoutes-tags">
          {routeRecord.tags.map(this.createRouteTagElement)}
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
