import React from "react";

import * as d3 from "d3";

import "./States.css";

export interface StatesProps {}

export interface StatesState {}

class States extends React.Component<StatesProps, StatesState> {
  private canvasRef: React.RefObject<HTMLInputElement>;
  state = {};

  constructor(props: StatesProps) {
    super(props);
    this.canvasRef = React.createRef();
  }

  populateCanvas = () => {
    const canvas = d3.select(this.canvasRef.current);
    canvas.selectAll("svg").remove();
    const [width, height] = [1000, 200];
    const svg = canvas
      .append("svg")
      .classed("States-svg", true)
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr("viewBox", `0 0 ${width} ${height}`);

    const stateImageLinks = [
      "https://chrisgregory.blob.core.windows.net/bio/states/indiana.svg",
      "https://chrisgregory.blob.core.windows.net/bio/states/massachusetts.svg",
      "https://chrisgregory.blob.core.windows.net/bio/states/washington.svg",
    ];
    svg
      .selectAll("image")
      .data(stateImageLinks)
      .enter()
      .append("svg:image")
      .attr("href", (d) => d)
      // .attr("filter", "invert(0.5)")
      .classed("States-state-image", true)
      .attr("x", (d, i) => i * 300)
      .attr("y", 0)
      .attr("width", 300)
      .attr("height", 300);
  };

  componentDidMount() {
    this.populateCanvas();
  }

  render() {
    return (
      <div className="States">
        <div className="States-states-wrap">
          <div className="States-states-canvas" ref={this.canvasRef}></div>
        </div>
      </div>
    );
  }
}

export default States;
