import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Contact from "../Contact/Contact";
import Blog from "../Blog/Blog";
import Home from "../Home/Home";
import Music from "../Music/Music";
import Oops from "../Oops/Oops";
import Projects from "../Projects/Projects";
import Sandbox from "../../sandbox-components/Sandbox";
import RunningRoutes from "../Routes/RunningRoutes";
import Nav from "./Nav";
import Survey from "../Survey/Survey";
import "./styles/App.sass";

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
          <Route path="/music" exact component={() => <Music />} />
          <Route path="/sandbox" exact component={() => <Sandbox />} />
          <Route path="*" exact component={() => <Oops />} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
