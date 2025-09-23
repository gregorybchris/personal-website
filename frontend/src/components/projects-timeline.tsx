import * as d3 from "d3";
import random, { RNG } from "random";
import { useEffect, useRef } from "react";
import seedrandom from "seedrandom";
import { Project } from "../pages/projects-page";
import "../styles/projects.css";

class ProjectTypes {
  static GAME = "game";
  static PROGRAM = "program";
  static SIMULATION = "simulation";
  static TOOL = "tool";
  static VISUALIZATION = "visualization";
}

class Colors {
  static BLACK = "rgb(0, 0, 0)";
  static BLUE = "rgb(41, 128, 185)";
  static GREEN = "rgb(39, 174, 96)";
  static ORANGE = "rgb(230, 126, 34)";
  static PURPLE = "rgb(142, 68, 173)";
  static RED = "rgb(231, 76, 60)";
  static YELLOW = "rgb(241, 196, 15)";
}

class SimConstants {
  static MULT = 130;
  static VELOCITY_LIMIT = 6;
  static STILL_THRESHOLD = 0.01;
}

class GraphicsConstants {
  static WIDTH = 1000;
  static HEIGHT = 260;
  static PADDING_X = 80;
  static PADDING_Y = 80;
}

interface ProjectsTimelineProps {
  projects: Project[];
  currentProject: Project | null;
  onSelectProject: (project: Project | null) => void;
  searchText: string;
}

export function ProjectsTimeline({
  projects,
  currentProject,
  onSelectProject,
  searchText,
}: ProjectsTimelineProps) {
  const GAME_LOOP_SPF = 1.0 / 65.0;

  const canvasRef = useRef<HTMLDivElement>(null);
  const simRunning = useRef(false);

  function projectMatchesSearch(project: Project): boolean {
    return project.name.toLowerCase().includes(searchText.toLowerCase());
  }

  useEffect(() => {
    if (currentProject === null) {
      d3.selectAll("circle").classed("selected", false);
      d3.selectAll("circle").classed("deselected", false);

      if (searchText !== "") {
        projects.map((project) => {
          if (!projectMatchesSearch(project)) {
            d3.select(getProjectSelector(project)).classed("deselected", true);
          }
        });
      }
    } else {
      d3.selectAll("circle")
        .classed("deselected", true)
        .classed("selected", false);

      d3.select(getProjectSelector(currentProject))
        .classed("deselected", false)
        .classed("selected", true);
    }
  }, [currentProject, searchText]);

  useEffect(() => {
    if (projects.length !== 0) {
      startSim();
    }
    return () => {
      simRunning.current = false;
    };
  }, [projects]);

  function startSim() {
    populateCanvas();
    simRunning.current = true;

    let dt = 0;
    let previousTime: number;
    let update = (currentTime: number) => {
      if (previousTime !== undefined) {
        dt += (currentTime - previousTime) / 1000;
        if (dt >= GAME_LOOP_SPF) {
          updateCanvas(dt, currentTime);
          dt = 0;
        }
      }
      previousTime = currentTime;
      if (!simRunning.current) {
        return;
      }
      window.requestAnimationFrame(update);
    };
    window.requestAnimationFrame(update);
  }

  function updateCanvas(dt: number, currentTime: number) {
    if (!simRunning.current) {
      return;
    }

    let containers = projects.map((project) => {
      let selector = getProjectSelector(project);
      let circle = d3.select(selector);
      return {
        circle,
        project,
        selector,
        force: { x: 0, y: 0 },
      };
    });

    // Compute forces
    containers.forEach((containerA) => {
      containers.forEach((containerB) => {
        if (containerA.selector === containerB.selector) {
          return;
        }

        const [circleA, circleB] = [containerA.circle, containerB.circle];

        const [xA, yA] = [+circleA.attr("cx"), +circleA.attr("cy")];
        const [xB, yB] = [+circleB.attr("cx"), +circleB.attr("cy")];
        const [rA, rB] = [+circleA.attr("r"), +circleB.attr("r")];

        const [dx, dy] = [xB - xA, yB - yA];
        const d = Math.sqrt(dx * dx + dy * dy);
        const dMax = rA + rB + 4;
        if (d < dMax) {
          const sign = yA > yB ? 1 : -1;
          const dDelta = 1 - d / dMax;
          containerA.force.y += sign * dDelta * 5;
        }
      });
    });

    const clip = (value: number, min: number, max: number) =>
      Math.max(min, Math.min(max, value));

    // Apply forces
    containers.forEach((container) => {
      // Clip forces for stability
      let velLim = SimConstants.VELOCITY_LIMIT;
      let fy = clip(container.force.y, -velLim, velLim);

      // Update position
      if (Math.abs(fy) <= SimConstants.STILL_THRESHOLD) {
        return;
      }
      let circle = container.circle;
      circle.attr("cy", +circle.attr("cy") + fy);
    });
  }

  function getProjectSelector(project: Project): string {
    return `#project_${project.project_id}`;
  }

  function getProjectColor(projectType: string): string {
    switch (projectType) {
      case ProjectTypes.GAME:
        return Colors.RED;
      case ProjectTypes.PROGRAM:
        return Colors.YELLOW;
      case ProjectTypes.SIMULATION:
        return Colors.GREEN;
      case ProjectTypes.TOOL:
        return Colors.BLUE;
      case ProjectTypes.VISUALIZATION:
        return Colors.PURPLE;
      default:
        return Colors.BLACK;
    }
  }

  function populateCanvas() {
    const currentCanvasRef = canvasRef.current;
    if (!currentCanvasRef) return;

    const canvas = d3.select(currentCanvasRef);

    canvas.selectAll("svg").remove();
    const [width, height] = [GraphicsConstants.WIDTH, GraphicsConstants.HEIGHT];
    const svg = canvas
      .append("svg")
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr("viewBox", `0 0 ${width} ${height}`);

    svg
      .append("rect")
      .attr("width", width)
      .attr("height", height)
      .attr("fill", "transparent")
      .on("click", (mouseEvent: any) => {
        onSelectProject(null);
        d3.selectAll("circle").classed("selected", false);
        d3.selectAll("circle").classed("deselected", false);
      });

    const getProjectTimestamp = (project: Project): number =>
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
    random.use(seedrandom("0") as unknown as RNG);
    const circles = svg
      .selectAll("circle")
      .data(projects)
      .enter()
      .append("circle")
      .classed("project-timeline-circle", true)
      .classed("archived", (d) => d.archived)
      .attr("cx", (p) => {
        return xScale(getProjectTimestamp(p)) || 0;
      })
      .attr("cy", () => {
        let rand = uniform();
        const spread = 10;
        const yCenter = height / 2;
        return yCenter + spread * (rand * 2 - 1);
      })
      .attr("r", (p) => {
        let r = p.rating;
        return (r * r * 6) / 30 + 9;
      })
      .attr("opacity", 1)
      .attr("fill", (p) => getProjectColor(p.project_type))
      .attr("fill-opacity", 0)
      .attr("stroke-width", 4)
      .attr("stroke", (p) => getProjectColor(p.project_type))
      .attr("id", (p) => `project_${p.project_id}`)
      .on("click", (mouseEvent: any, p: any) => {
        d3.selectAll("circle")
          .classed("deselected", true)
          .classed("selected", false);
        d3.select(getProjectSelector(p))
          .classed("deselected", false)
          .classed("selected", true);
        onSelectProject(p);
      });
    circles.append("title").text((d) => d.name);
  }

  const projectTypes = [
    ProjectTypes.GAME,
    ProjectTypes.PROGRAM,
    ProjectTypes.SIMULATION,
    ProjectTypes.TOOL,
    ProjectTypes.VISUALIZATION,
  ];

  return (
    <div>
      <div className="flex flex-col items-center justify-center gap-5 p-5">
        <div className="flex flex-row gap-4 md:gap-5">
          {projectTypes.map((projectType) => {
            return (
              <div
                className="flex flex-row items-center gap-1"
                key={projectType}
              >
                <div
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: getProjectColor(projectType) }}
                ></div>
                <div className="text-xs md:text-sm">{projectType}</div>
              </div>
            );
          })}
        </div>
      </div>
      <div
        ref={canvasRef}
        className="translate-y-[540%] scale-[3.4] -rotate-90 transform-gpu md:translate-y-0 md:scale-100 md:rotate-0"
      ></div>
    </div>
  );
}
