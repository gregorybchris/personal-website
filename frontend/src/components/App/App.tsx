import "./styles/App.sass";

import { BrowserRouter, Route, Routes } from "react-router-dom";

import Archive from "../Archive/Archive";
import Blog from "../Blog/Blog";
import BlogExplore from "../Blog/BlogExplore";
import Contact from "../Contact/Contact";
import Home from "../Home/Home";
import Music from "../Music/Music";
import Nav from "./Nav";
import Oops from "../Oops/Oops";
import Places from "../Places/Places";
import Projects from "../Projects/Projects";
import RunningRoutes from "../Routes/RunningRoutes";
// import Survey from "../Survey/Survey";

export default function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Nav />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/code" element={<Projects />}>
            <Route path=":slug" element={<Projects />} />
          </Route>
          <Route path="/contact" element={<Contact />} />
          {/* <Route path="/opinion" element={<Survey />} /> */}
          <Route path="/links" element={<Blog />}>
            <Route path=":slug" element={<Blog />} />
          </Route>
          <Route path="/running" element={<RunningRoutes />} />
          <Route path="/music" element={<Music />} />

          <Route path="/link-graph" element={<BlogExplore />} />
          <Route path="/places" element={<Places />} />
          <Route path="/archive" element={<Archive />} />

          <Route path="*" element={<Oops />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
