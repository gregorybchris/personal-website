import Blog from "./Blog";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./Home";
import Nav from "./Nav";
import Graphics from "./Graphics";
import React from "react";
import "./App.css";

function App() {
  return (
    <div className="App">
      <Router>
        <Nav />
        <Switch>
          <Route path="/" exact component={() => <Home />} />
          <Route path="/blog" exact component={() => <Blog />} />
          <Route path="/graphics" exact component={() => <Graphics />} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
