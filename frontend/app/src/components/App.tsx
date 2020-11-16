import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Contact from "./contact/Contact";
import Blog from "./blog/Blog";
import Home from "./home/Home";
import Projects from "./code/Projects";
import Sandbox from "../sandbox-components/Sandbox";
import RunningRoutes from "./routes/RunningRoutes";
import Nav from "./Nav";
import Survey from "./survey/Survey";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Router>
        <Nav />
        <Switch>
          <Route path="/" exact component={() => <Home />} />
          <Route path="/code" exact component={() => <Projects />} />
          <Route path="/contact" exact component={() => <Contact />} />
          <Route path="/opinion" exact component={() => <Survey />} />
          <Route path="/links" exact component={() => <Blog />} />
          <Route path="/running" exact component={() => <RunningRoutes />} />
          <Route path="/sandbox" exact component={() => <Sandbox />} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
