import React from "react";

import * as d3 from "d3";
import random from "random";
import seedrandom from "seedrandom";

import ProjectRecord from "../../models/ProjectRecord";
import "./ProjectTimeline.sass";

class ProjectTypes {
  static WEB = "web";
  static JAR = "jar";
  static PROGRAM = "program";
}

class Colors {
  static BLACK = "rgb(0, 0, 0)";
  static BLUE = "rgb(84, 147, 184)";
  static GRAY = "rgb(60, 60, 60)";
  static GREEN = "rgb(63, 150, 36)";
  static RED = "rgb(200, 88, 70)";
}

class SimConstants {
  static MULT = 130;
  static VELOCITY_LIMIT = 6;
  static STILL_THRESHOLD = 0.1;
}

class GraphicsConstants {
  static WIDTH = 1000;
  static HEIGHT = 300;
  static PADDING_X = 30;
  static PADDING_Y = 80;
}

export interface ProjectTimelineProps {
  projects: ProjectRecord[];
  onSelectProject: (project: ProjectRecord) => void;
}

export interface ProjectTimelineState {}

class ProjectTimeline extends React.Component<
  ProjectTimelineProps,
  ProjectTimelineState
> {
  private GAME_LOOP_SPF = 1.0 / 65.0;
  private canvasRef: React.RefObject<HTMLInputElement>;
  private simRunning = false;

  state = {};

  constructor(props: ProjectTimelineProps) {
    super(props);
    this.canvasRef = React.createRef();
  }

  startSim = (projects: ProjectRecord[]) => {
    this.populateCanvas(projects);
    this.simRunning = true;

    let dt = 0;
    let previousTime: number;
    let update = (currentTime: number) => {
      if (previousTime != undefined) {
        dt += (currentTime - previousTime) / 1000;
        if (dt >= this.GAME_LOOP_SPF) {
          this.updateCanvas(dt);
          dt = 0;
        }
      }
      previousTime = currentTime;
      if (!this.simRunning) {
        return;
      }
      window.requestAnimationFrame(update);
    };
    window.requestAnimationFrame(update);
  };

  clip = (value: number, min: number, max: number) => {
    return Math.max(min, Math.min(max, value));
  };

  updateCanvas = (dt: number) => {
    if (!this.simRunning) {
      return;
    }

    let containers = this.props.projects.map((project) => {
      let selector = this.getProjectSelector(project);
      let circle = d3.select(selector);
      return {
        circle: circle,
        project: project,
        selector: selector,
        force: { x: 0, y: 0 },
      };
    });

    // Compute forces
    containers.forEach((containerA) => {
      containers.forEach((containerB) => {
        if (containerA.selector == containerB.selector) {
          return;
        }

        let [circleA, circleB] = [containerA.circle, containerB.circle];

        let [xA, yA] = [+circleA.attr("cx"), +circleA.attr("cy")];
        let [xB, yB] = [+circleB.attr("cx"), +circleB.attr("cy")];

        if (yA - yB < 0) {
          return;
        }

        let [dx, dy] = [xB - xA, yB - yA];
        let d = Math.sqrt(dx * dx + dy * dy);
        // let theta = Math.atan2(dy, dx);
        // let f = -d / 20 + 1.5;
        // let fy = Math.sin(theta) * f;
        // containerA.force.y += fy;

        if (Math.abs(d) < 10) {
          containerA.force.y += 1.6 * dt * SimConstants.MULT;
        } else if (Math.abs(d) < 20) {
          containerA.force.y += 0.8 * dt * SimConstants.MULT;
        } else if (Math.abs(d) < 35) {
          containerA.force.y += 0.4 * dt * SimConstants.MULT;
        }
      });
    });

    // Apply forces
    containers.forEach((container) => {
      // Clip forces for stability
      let velLim = SimConstants.VELOCITY_LIMIT;
      let fy = this.clip(container.force.y, -velLim, velLim);

      // Update position
      if (Math.abs(fy) <= SimConstants.STILL_THRESHOLD) {
        return;
      }
      let circle = container.circle;
      circle.attr("cy", +circle.attr("cy") + fy);
    });
  };

  getProjectSelector = (project: ProjectRecord): string => {
    return `#project_${project.project_id}`;
  };

  populateCanvas = (projects: ProjectRecord[]) => {
    const canvas = d3.select(this.canvasRef.current);

    canvas.on("mousemove", (mouseEvent: any) => {
      // console.log(mouseEvent);
    });

    canvas.selectAll("svg").remove();
    const [width, height] = [GraphicsConstants.WIDTH, GraphicsConstants.HEIGHT];
    const svg = canvas
      .append("svg")
      .classed("ProjectTimeline-svg", true)
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr("viewBox", `0 0 ${width} ${height}`);

    const getProjectTimestamp = (project: ProjectRecord): number =>
      new Date(project.date).getTime();

    const minTimestamp: any = d3.min(projects, getProjectTimestamp);
    const maxTimestamp: any = d3.max(projects, getProjectTimestamp);
    const xLeft = GraphicsConstants.PADDING_X;
    const xRight = width - GraphicsConstants.PADDING_X;
    const xScale = d3
      .scaleLinear()
      .domain([minTimestamp, maxTimestamp])
      .range([xLeft, xRight]);

    const uniform = random.uniform(0, 1);
    random.use(seedrandom("0"));
    const circles = svg
      .selectAll("circle")
      .data(projects)
      .enter()
      .append("circle")
      .classed("ProjectTimeline-circle", true)
      .classed("archived", (d) => d.archived)
      .attr("cx", (project) => {
        return xScale(getProjectTimestamp(project)) || 0;
      })
      .attr("cy", () => {
        let rand = uniform();
        return GraphicsConstants.PADDING_Y + 40 * (rand * 2 - 1);
      })
      .attr("r", (project) => (project.rating / 10) * 9 + 5)
      .attr("stroke-width", 1.5)
      .attr("fill", (project) => {
        switch (project.project_type) {
          case ProjectTypes.WEB:
            return Colors.RED;
          case ProjectTypes.JAR:
            return Colors.BLUE;
          case ProjectTypes.PROGRAM:
            return Colors.GREEN;
          default:
            return Colors.BLACK;
        }
      })
      .attr("id", (project) => `project_${project.project_id}`)
      .on("click", (mouseEvent: any, project: any) => {
        d3.selectAll("circle").attr("stroke", "transparent");
        d3.select(this.getProjectSelector(project)).attr("stroke", Colors.GRAY);
        this.props.onSelectProject(project);
      });
    circles.append("title").text((d) => d.name);
  };

  componentDidUpdate(
    prevProps: ProjectTimelineProps,
    prevState: ProjectTimelineState
  ) {
    if (prevProps.projects.length === 0) {
      this.startSim(this.props.projects);
    }
  }

  componentWillUnmount() {
    this.simRunning = false;
  }

  render() {
    return (
      <div className="ProjectTimeline">
        <div className="ProjectTimeline-canvas" ref={this.canvasRef}></div>
      </div>
    );
  }
}

export default ProjectTimeline;
