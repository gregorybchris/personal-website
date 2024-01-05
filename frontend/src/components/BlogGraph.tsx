import "../styles/blog.css";

import * as d3 from "d3";

import { GET, makeQuery } from "../utilities/requestUtilities";

import { Post as PostModel } from "../models/blogModels";
import { range } from "../utilities/arrayUtilities";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";

interface GraphNode {
  id: string;
  group: number;
  post: PostModel;
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

export function BlogGraph() {
  const ref = useRef<SVGSVGElement>(null);
  let navigate = useNavigate();

  const postsQuery = makeQuery("posts");
  GET(postsQuery).then((queryResult) => {
    const allPosts: PostModel[] = queryResult["posts"];
    const posts = allPosts.reverse().filter((post) => !post.archived);
    const data = getData(posts);
    createSimulation(data);
  });

  function onDrag(simulation: any): any {
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

    return d3
      .drag()
      .on("start", dragStarted)
      .on("drag", dragged)
      .on("end", dragEnded);
  }

  function getData(posts: PostModel[]): GraphData {
    const nodes = [];
    const links = [];

    let groups = posts
      .map((post) => (post.areas.length === 0 ? "" : post.areas[0]))
      .filter((v) => v !== "");
    const uniqueGroups = Array.from(new Set(groups));
    const groupNumbers = range(uniqueGroups.length).map((n) => `${n}`);
    const scale = d3
      .scaleOrdinal(d3.schemeCategory10)
      .domain(uniqueGroups)
      .range(groupNumbers);

    for (let i = 0; i < posts.length; i++) {
      if (posts[i].areas.length === 0) {
        continue;
      }
      let group = posts[i].areas[0];
      nodes.push({
        id: posts[i].slug,
        group: group === null ? 0 : +scale(group),
        post: posts[i],
      });
      for (let j = i + 1; j < posts.length; j++) {
        let numSharedAreas = posts[i].areas[0] === posts[j].areas[0] ? 1 : 0;
        if (numSharedAreas === 0) {
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
  }

  function createSimulation(data: GraphData) {
    const currentRef = ref.current;
    if (!currentRef) return;

    const width = 500;
    const height = 500;

    const links = data.links.map((d) => Object.create(d));
    const nodes = data.nodes.map((d) => Object.create(d));

    const simulation = d3
      .forceSimulation(nodes)
      .force(
        "link",
        d3.forceLink(links).id((d: any) => d.id),
      )
      .force("charge", d3.forceManyBody())
      .force("x", d3.forceX())
      .force("y", d3.forceY());

    const svg = d3
      .select(currentRef)
      .attr("viewBox", `${-width / 2} ${-height / 2} ${width} ${height}`);

    const link = svg
      .append("g")
      .attr("stroke", "rgb(150, 150, 150)")
      .attr("stroke-opacity", 0.2)
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke-width", (d) => Math.sqrt(d.value));

    const scale = d3.scaleOrdinal(d3.schemeCategory10);
    const color = (node: GraphNode) => scale(`${node.group}`);

    const node = svg
      .selectAll("circle")
      .data(nodes)
      .enter()
      .append("circle")
      .classed("blog-graph-node-circle", true)
      .attr("r", (node: GraphNode) => {
        const length = node.post.length;
        if (length === null) {
          return 6;
        } else {
          const [hours, minutes, _] = length
            .split(":")
            .map((v) => parseInt(v, 10));
          const totalMinutes = hours * 60 + minutes;
          return totalMinutes > 10 ? 9 : 4;
        }
      })
      .attr("stroke", color)
      .attr("stroke-opacity", 0.8)
      .attr("stroke-width", 3)
      .attr("fill", color)
      .attr("fill-opacity", 0)
      .attr("id", (node: GraphNode) => node.post.post_id)
      .call(onDrag(simulation));

    node.append("title").text((d) => d.id);

    node.on("click", (mouseEvent: any, node: any) => {
      console.log(node.post.slug);
      navigate(`/links/${node.post.slug}`);
    });

    simulation.on("tick", () => {
      link
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

      node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
    });
  }

  return (
    <div className="BlogExplore">
      <svg className="mx-auto block h-[600px] w-[95%]" ref={ref}></svg>
    </div>
  );
}
