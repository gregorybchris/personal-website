import React from "react";

import * as d3 from "d3";

export interface BioProps {}

export interface BioState {}

class Bio extends React.Component<BioProps, BioState> {
  private canvasRef: React.RefObject<HTMLInputElement>;

  constructor(props: BioProps) {
    super(props);
    this.canvasRef = React.createRef();
  }

  componentDidMount() {
    d3.select(this.canvasRef.current).append("p").text("About me");
  }

  render() {
    return <div ref={this.canvasRef}></div>;
  }
}

export default Bio;
