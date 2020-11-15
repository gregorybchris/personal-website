import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Contact from "./Contact";
import Blog from "./Blog";
import Graphics from "../sandbox-components/Graphics";
import Home from "./Home";
import Projects from "./Projects";
import Sandbox from "../sandbox-components/Sandbox";
import Nav from "./Nav";
import Survey from "./Survey";
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
          <Route path="/data" exact component={() => <Survey />} />
          <Route path="/links" exact component={() => <Blog />} />
          <Route path="/sandbox" exact component={() => <Sandbox />} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
