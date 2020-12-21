import React from "react";

import * as d3 from "d3";
import PostModel from "./models/Post";
import "./styles/BlogExplore.sass";
import { makeQuery, GET } from "../../utilities/RequestUtilities";
import { range } from "../../utilities/ArrayUtilities";

interface BlogExploreProps {}

interface BlogExploreState {
  posts: PostModel[];
  currentPostId: string | null;
}

interface GraphNode {
  id: string;
  group: number;
}

interface GraphLink {
  source: string;
  target: string;
  value: number;
}

interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

class BlogExplore extends React.Component<BlogExploreProps, BlogExploreState> {
  ref: React.RefObject<SVGSVGElement>;

  state: BlogExploreState = {
    posts: [],
    currentPostId: null,
  };

  constructor(props: BlogExploreProps) {
    super(props);
    this.ref = React.createRef();
  }

  async componentDidMount() {
    const postsQuery = makeQuery("posts");
    const queryResult = await GET(postsQuery);
    this.setState({ posts: queryResult["posts"].reverse().filter((post: PostModel) => !post.archived) });

    const data = this.getData();
    this.createSimulation(data);
  }

  onDrag = (simulation: any): any => {
    const dragStarted = (event: any) => {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    };

    const dragged = (event: any) => {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    };

    const dragEnded = (event: any) => {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    };

    return d3.drag().on("start", dragStarted).on("drag", dragged).on("end", dragEnded);
  };

  getData = (): GraphData => {
    const nodes = [];
    const links = [];
    const posts = this.state.posts;

    let groups = posts.map((post) => (post.areas.length == 0 ? "" : post.areas[0])).filter((v) => v !== "");
    const uniqueGroups = Array.from(new Set(groups));
    const groupNumbers = range(uniqueGroups.length).map((n) => `${n}`);
    const scale = d3.scaleOrdinal(d3.schemeCategory10).domain(uniqueGroups).range(groupNumbers);

    for (let i = 0; i < posts.length; i++) {
      if (posts[i].areas.length == 0) {
        continue;
      }
      let group = posts[i].areas[0];
      nodes.push({
        id: posts[i].slug,
        group: group == null ? 0 : +scale(group),
      });
      for (let j = i + 1; j < posts.length; j++) {
        // let numSharedAreas = posts[i].areas.filter((tag) => posts[j].areas.includes(tag)).length;
        let numSharedAreas = posts[i].areas[0] == posts[j].areas[0] ? 1 : 0;
        if (numSharedAreas == 0) {
          continue;
        }
        links.push({
          source: posts[i].slug,
          target: posts[j].slug,
          value: numSharedAreas,
        });
      }
    }

    return {
      nodes: nodes,
      links: links,
    };
  };

  createSimulation = (data: GraphData) => {
    const width = 500;
    const height = 500;

    const links = data.links.map((d) => Object.create(d));
    const nodes = data.nodes.map((d) => Object.create(d));

    const simulation = d3
      .forceSimulation(nodes)

      .force(
        "link",
        d3.forceLink(links).id((d: any) => d.id)
      )
      .force("charge", d3.forceManyBody())
      .force("x", d3.forceX())
      .force("y", d3.forceY());

    const svg = d3.select("#canvas").attr("viewBox", `${-width / 2} ${-height / 2} ${width} ${height}`);

    const link = svg
      .append("g")
      .attr("stroke", "rgb(150, 150, 150)")
      .attr("stroke-opacity", 0.1)
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke-width", (d) => Math.sqrt(d.value));

    const scale = d3.scaleOrdinal(d3.schemeCategory10);
    const color = (d: GraphNode) => scale(`${d.group}`);

    const node = svg
      .append("g")
      .selectAll("circle")
      .data(nodes)
      .join("circle")
      .attr("r", 3)
      .attr("stroke", color)
      .attr("stroke-opacity", 0.8)
      .attr("stroke-width", 3)
      .attr("fill", "transparent")
      .call(this.onDrag(simulation));

    node.append("title").text((d) => d.id);

    simulation.on("tick", () => {
      link
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

      node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
    });
  };

  render() {
    return (
      <div className="BlogExplore">
        <svg id="canvas" ref={this.ref}></svg>
      </div>
    );
  }
}

export default BlogExplore;
