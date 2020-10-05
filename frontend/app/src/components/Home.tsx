import React from "react";

import "./Home.css";

export interface HomeProps {}

export interface HomeState {}

class Home extends React.Component<HomeProps, HomeState> {
  state = {};

  componentDidMount() {}

  render() {
    return (
      <div className="Home">
        "Computers aren't the thing, they're the thing that gets us to the
        thing" - Joe MacMillan
      </div>
    );
  }
}

export default Home;
