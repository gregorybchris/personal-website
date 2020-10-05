import React from "react";

import * as d3 from "d3";

import TimelineRecord from "../models/TimelineRecord";
import { makeQuery, GET } from "../controllers/RequestUtilities";

export interface BioProps {}

export interface BioState {
  timeline: TimelineRecord[];
}

class Bio extends React.Component<BioProps, BioState> {
  private canvasRef: React.RefObject<HTMLInputElement>;

  constructor(props: BioProps) {
    super(props);
    this.canvasRef = React.createRef();
  }

  async componentDidMount() {
    this.populateCanvas();

    const postsQuery = makeQuery("timeline");
    const queryResult = await GET(postsQuery);
    this.setState({ timeline: queryResult["timeline"].reverse() });

    console.log(this.state.timeline);
  }

  populateCanvas = () => {
    const canvas = d3.select(this.canvasRef.current);
    canvas.append("p").text("About me");
  };

  render() {
    return <div ref={this.canvasRef}></div>;
  }
}

export default Bio;
