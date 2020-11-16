import React from "react";

import "./RunningRoutes.css";

export interface RunningRoutesProps {}

export interface RunningRoutesState {}

class RunningRoutes extends React.Component<
  RunningRoutesProps,
  RunningRoutesState
> {
  render() {
    return <div className="RunningRoutes">Running Routes</div>;
  }
}

export default RunningRoutes;
