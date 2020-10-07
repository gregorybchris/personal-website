import React from "react";

import * as d3 from "d3";

import EventRecord from "../models/EventRecord";
import "./Timeline.css";

export interface TimelineProps {
  events: EventRecord[] | null;
}

export interface TimelineState {}

class Timeline extends React.Component<TimelineProps, TimelineState> {
  private canvasRef: React.RefObject<HTMLInputElement>;

  constructor(props: TimelineProps) {
    super(props);
    this.canvasRef = React.createRef();
  }

  populateCanvas = (events: EventRecord[]) => {
    console.log("Events: ", events);
    const canvas = d3.select(this.canvasRef.current);

    const svg = canvas.append("svg").attr("width", 500).attr("height", 500);
    // .attr("preserveAspectRatio", "xMinYMin meet")
    // .attr("viewBox", "0 0 300 300");
    console.log(svg, svg.node());

    const getEventTimestamp = (event: EventRecord): number =>
      new Date(event.date).getTime();

    const minTimestamp: any = d3.min(events, getEventTimestamp);
    const maxTimestamp: any = d3.max(events, getEventTimestamp);
    const [xLeft, xRight] = [10, 490];
    // const [yBottom, yTop] = [0, 500];
    const xScale = d3
      .scaleLinear()
      .domain([minTimestamp, maxTimestamp])
      .range([xLeft, xRight]);
    const circles = svg
      .selectAll("circle")
      .data(events)
      .enter()
      .append("circle")
      .attr("cx", (d: EventRecord) => {
        let scaledX = xScale(getEventTimestamp(d));
        return scaledX ? scaledX : 0;
      })
      .attr("cy", () => 40 + 20 * (Math.random() * 2 - 1))
      .attr("r", 5)
      .attr("fill", (d) => {
        if (d.event_type == "project") {
          return "rgb(224, 152, 111)";
        } else if (d.event_type == "employment") {
          return "rgb(113, 173, 208)";
        } else {
          return "rgb(255, 255, 255)";
        }
      });
    // .attr("title", (d) => d.name);
    circles.append("title").text((d) => d.name);
    // .on("mouseover", (d) => {
    //   console.log(d);
    // });
    // canvas
    //   .selectAll("p")
    //   .data(events)
    //   .enter()
    //   .append("p")
    //   .text((d) => d.name);
  };

  componentDidUpdate(prevProps: TimelineProps, prevState: TimelineState) {
    if (this.props.events != null) {
      const unarchivedEvents = this.props.events.filter(
        (event) => !event.archived
      );
      this.populateCanvas(unarchivedEvents);
    }
  }

  render() {
    return (
      <div className="Timeline">
        <div className="d3-canvas" ref={this.canvasRef}></div>
      </div>
    );
  }
}

export default Timeline;
