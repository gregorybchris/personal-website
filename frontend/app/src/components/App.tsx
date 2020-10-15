import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Bio from "./Bio";
import Blog from "./Blog";
import Home from "./Home";
import Graphics from "./Graphics";
import Nav from "./Nav";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Router>
        <Nav />
        <Switch>
          <Route path="/" exact component={() => <Home />} />
          <Route path="/bio" exact component={() => <Bio />} />
          <Route path="/graphics" exact component={() => <Graphics />} />
          <Route path="/blog" exact component={() => <Blog />} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;