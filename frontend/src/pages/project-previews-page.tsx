import { NavLink } from "react-router-dom";
import antsImage from "../assets/images/projects/ants.svg";
import bfprtImage from "../assets/images/projects/bfprt.svg";
import bigLifeImage from "../assets/images/projects/big-life.svg";
import cadoImage from "../assets/images/projects/cado.svg";
import chladniImage from "../assets/images/projects/chladni.svg";
import combustImage from "../assets/images/projects/combust.svg";
import contractionImage from "../assets/images/projects/contraction.svg";
import decidioImage from "../assets/images/projects/decidio.svg";
import directedImage from "../assets/images/projects/directed.svg";
import dirstuffImage from "../assets/images/projects/dirstuff.svg";
import engineroomImage from "../assets/images/projects/engineroom.svg";
import halfplaneImage from "../assets/images/projects/half-plane.svg";
import idtraceImage from "../assets/images/projects/idtrace.svg";
import jumboMealImage from "../assets/images/projects/jumbo-meal.svg";
import langtonImage from "../assets/images/projects/langton.svg";
import ptcdImage from "../assets/images/projects/ptcd.svg";
import quadImage from "../assets/images/projects/quad.svg";
import scrapscriptImage from "../assets/images/projects/scrapscript.svg";
import sweypImage from "../assets/images/projects/sweyp.svg";
import tilesImage from "../assets/images/projects/tiles.svg";
import towerOfHanoiImage from "../assets/images/projects/tower-of-hanoi.svg";
import tsaImage from "../assets/images/projects/tsa.svg";
import typogeneticsImage from "../assets/images/projects/typogenetics.svg";
import unhingedImage from "../assets/images/projects/unhinged.svg";
import vidrankImage from "../assets/images/projects/vidrank.svg";

const IMAGE_MAP = new Map([
  ["ants", antsImage],
  ["bfprt", bfprtImage],
  ["big-life", bigLifeImage],
  ["cado", cadoImage],
  ["chladni", chladniImage],
  ["combust", combustImage],
  ["contraction", contractionImage],
  ["decidio", decidioImage],
  ["directed", directedImage],
  ["dirstuff", dirstuffImage],
  ["engineroom", engineroomImage],
  ["half-plane", halfplaneImage],
  ["idtrace", idtraceImage],
  ["jumbo-meal", jumboMealImage],
  ["langton", langtonImage],
  ["ptcd", ptcdImage],
  ["quad", quadImage],
  ["scrapscript", scrapscriptImage],
  ["sweyp", sweypImage],
  ["tiles", tilesImage],
  ["tower-of-hanoi", towerOfHanoiImage],
  ["tsa", tsaImage],
  ["typogenetics", typogeneticsImage],
  ["unhinged", unhingedImage],
  ["vidrank", vidrankImage],
]);

export function ProjectLogosPage() {
  function slugToImage(slug: string) {
    return IMAGE_MAP.get(slug);
  }

  return (
    <div className="flex flex-col items-center">
      <div className="flex w-4/5 flex-wrap items-center justify-center pt-20">
        {Array.from(IMAGE_MAP.keys()).map((slug) => (
          <NavLink to={`/code/${slug}`}>
            <div className="cursor-pointer opacity-90 grayscale-[30%] transition-all hover:opacity-100 hover:grayscale-0">
              <img src={slugToImage(slug)} className="w-32" />
            </div>
          </NavLink>
        ))}
      </div>
    </div>
  );
}
