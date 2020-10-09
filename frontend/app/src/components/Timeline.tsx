import React from "react";

import * as d3 from "d3";

import { formatDate } from "../controllers/DateTimeUtilities";
import EventRecord from "../models/EventRecord";
import "./Timeline.css";

export interface TimelineProps {
  events: EventRecord[];
}

export interface TimelineState {
  currentEvent: EventRecord | null;
}

class Timeline extends React.Component<TimelineProps, TimelineState> {
  private canvasRef: React.RefObject<HTMLInputElement>;
  state = { currentEvent: null };

  constructor(props: TimelineProps) {
    super(props);
    this.canvasRef = React.createRef();
  }

  populateCanvas = (events: EventRecord[]) => {
    // console.log("Events: ", events);
    const canvas = d3.select(this.canvasRef.current);
    canvas.selectAll("svg").remove();
    const [width, height] = [1000, 100];
    const svg = canvas
      .append("svg")
      .classed("Timeline-svg", true)
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr("viewBox", `0 0 ${width} ${height}`);

    const getEventTimestamp = (event: EventRecord): number =>
      new Date(event.date).getTime();

    const minTimestamp: any = d3.min(events, getEventTimestamp);
    const maxTimestamp: any = d3.max(events, getEventTimestamp);
    const timelinePaddingX = 30;
    const timelinePaddingY = 50;
    const [xLeft, xRight] = [timelinePaddingX, width - timelinePaddingX];
    const xScale = d3
      .scaleLinear()
      .domain([minTimestamp, maxTimestamp])
      .range([xLeft, xRight]);

    const eventTypeProject = "project";
    const eventTypeEmployment = "employment";

    const circles = svg
      .selectAll("circle")
      .data(events)
      .enter()
      .append("circle")
      .classed("Timeline-circle", true)
      .attr("cx", (d: EventRecord) => {
        return xScale(getEventTimestamp(d)) || 0;
      })
      .attr("cy", () => timelinePaddingY + 20 * (Math.random() * 2 - 1))
      .attr("r", 7)
      .attr("fill", (d) => {
        if (d.event_type == eventTypeProject) {
          return "rgb(224, 152, 111)";
        } else if (d.event_type == eventTypeEmployment) {
          return "rgb(113, 173, 208)";
        } else {
          return "rgb(255, 255, 255)";
        }
      })
      .attr("event", (d) => d.event_id)
      .on("click", (mouseEvent, event: any) => {
        this.setState({ currentEvent: event });
      });
    circles.append("title").text((d) => d.name);
  };

  componentDidUpdate(prevProps: TimelineProps, prevState: TimelineState) {
    const unarchivedEvents = this.props.events.filter(
      (event) => !event.archived
    );
    if (prevProps.events.length == 0) {
      this.populateCanvas(unarchivedEvents);
    }
  }

  getEventInfo = () => {
    const currentEvent = this.state.currentEvent as EventRecord | null;
    if (currentEvent == null) {
      return;
    }
    const formattedDate = formatDate(currentEvent.date);
    return (
      <div className="Timeline-event-info">
        <div className="Timeline-event-item">{currentEvent.name}</div>
        <div className="Timeline-event-item">{formattedDate}</div>
      </div>
    );
  };

  render() {
    return (
      <div className="Timeline">
        <div className="Timeline-canvas" ref={this.canvasRef}></div>
        {this.getEventInfo()}
      </div>
    );
  }
}

export default Timeline;
