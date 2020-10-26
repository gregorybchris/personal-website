import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Contact from "./Contact";
import Blog from "./Blog";
import Graphics from "../sandbox-components/Graphics";
import Home from "./Home";
import Projects from "./Projects";
import Sandbox from "../sandbox-components/Sandbox";
import Nav from "./Nav";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Router>
        <Nav />
        <Switch>
          <Route path="/" exact component={() => <Home />} />
          <Route path="/blog" exact component={() => <Blog />} />
          <Route path="/contact" exact component={() => <Contact />} />
          <Route path="/graphics" exact component={() => <Graphics />} />
          <Route path="/projects" exact component={() => <Projects />} />
          <Route path="/sandbox" exact component={() => <Sandbox />} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
