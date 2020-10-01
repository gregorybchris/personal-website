import React from "react";
import "./Home.css";

export interface HomeProps {}

export interface HomeState {}

class Home extends React.Component<HomeProps, HomeState> {
  state = {};

  componentDidMount() {}

  render() {
    return (
      <div className="Home">Page is currently empty. Please go to blog.</div>
    );
  }
}

export default Home;
