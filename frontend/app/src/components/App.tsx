import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Contact from "./Contact";
import Blog from "./Blog";
import Graphics from "./Graphics";
import Home from "./Home";
import Projects from "./Projects";
import Nav from "./Nav";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Router>
        <Nav />
        <Switch>
          <Route path="/" exact component={() => <Home />} />
          <Route path="/projects" exact component={() => <Projects />} />
          <Route path="/graphics" exact component={() => <Graphics />} />
          <Route path="/blog" exact component={() => <Blog />} />
          <Route path="/contact" exact component={() => <Contact />} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
