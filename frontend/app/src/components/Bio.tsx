import React from "react";

import Timeline from "./Timeline";
import EventRecord from "../models/EventRecord";
import { makeQuery, GET } from "../controllers/RequestUtilities";
import "./Bio.css";

export interface BioProps {}

export interface BioState {
  events: EventRecord[];
}

class Bio extends React.Component<BioProps, BioState> {
  state = {
    events: [],
  };

  async componentDidMount() {
    const postsQuery = makeQuery("events");
    const queryResult = await GET(postsQuery);
    this.setState({ events: queryResult["events"].reverse() });
  }

  render() {
    return (
      <div className="Bio">
        <Timeline events={this.state.events}></Timeline>
      </div>
    );
  }
}

export default Bio;
