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

  async componentDidMount() {
    const routesQuery = makeQuery("outdoor/running");
    const queryResult = await GET(routesQuery);
    this.setState({ routes: queryResult.reverse() });
  }

  getMapometerLink = (routeRecord: RunningRouteRecord) => {
    const mapometerId = routeRecord.mapometer_id;
    return `https://us.mapometer.com/running/route_${mapometerId}.html`;
  };

  createRouteTagElement = (tag: string) => {
    return <div className="RunningRoutes-tag"></div>;
  };

  createRouteElement = (routeRecord: RunningRouteRecord) => {
    const mapometerLink = this.getMapometerLink(routeRecord);
    return (
      <div className="RunningRoutes-route" key={routeRecord.route_id}>
        <div className="RunningRoutes-name">
          <a
            href={mapometerLink}
            target="_blank"
            className="Common-simple-link"
          >
            {routeRecord.name}
          </a>
        </div>
        <div className="RunningRoutes-distance">- {routeRecord.distance}mi</div>
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
