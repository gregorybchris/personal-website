import { Link } from "react-router-dom";

export function HiddenPage() {
  return (
    <div>
      <div className="mx-auto w-[70%] py-4">
        <div className="block pb-10 text-center font-noto text-4xl font-bold text-text-1">
          Hidden Pages
        </div>
        <div className="text-center font-raleway text-lg leading-6 tracking-wide text-text-1">
          If you found your way here, I congratulate you. These pages are
          intended to be hidden.
        </div>
      </div>
      <div className="mx-auto w-[70%] py-4">
        <div>
          <Link to="/hidden/archive" className="block font-raleway text-text-1">
            <div className="inline-block border-b border-background px-2 pt-2 transition-all hover:border-accent">
              Archive
            </div>
          </Link>
          <Link
            to="/hidden/blog-graph"
            className="block font-raleway text-text-1"
          >
            <div className="inline-block border-b border-background px-2 pt-2 transition-all hover:border-accent">
              Blog Graph
            </div>
          </Link>
          <Link to="/hidden/places" className="block font-raleway text-text-1">
            <div className="inline-block border-b border-background px-2 pt-2 transition-all hover:border-accent">
              Places
            </div>
          </Link>
          <Link to="/hidden/surveys" className="block font-raleway text-text-1">
            <div className="inline-block border-b border-background px-2 pt-2 transition-all hover:border-accent">
              Surveys
            </div>
          </Link>
          <Link to="/hidden/shows" className="block font-raleway text-text-1">
            <div className="inline-block border-b border-background px-2 pt-2 transition-all hover:border-accent">
              TV Shows
            </div>
          </Link>
          <Link
            to="/hidden/channels"
            className="block font-raleway text-text-1"
          >
            <div className="inline-block border-b border-background px-2 pt-2 transition-all hover:border-accent">
              YouTube Channels
            </div>
          </Link>
          <Link to="/hidden/movies" className="block font-raleway text-text-1">
            <div className="inline-block border-b border-background px-2 pt-2 transition-all hover:border-accent">
              Movies
            </div>
          </Link>
          <Link
            to="/hidden/podcasts"
            className="block font-raleway text-text-1"
          >
            <div className="inline-block border-b border-background px-2 pt-2 transition-all hover:border-accent">
              Podcasts
            </div>
          </Link>
          <Link to="/hidden/recipes" className="block font-raleway text-text-1">
            <div className="inline-block border-b border-background px-2 pt-2 transition-all hover:border-accent">
              Recipes
            </div>
          </Link>
          <Link
            to="/hidden/watermark"
            className="block font-raleway text-text-1"
          >
            <div className="inline-block border-b border-background px-2 pt-2 transition-all hover:border-accent">
              Watermark
            </div>
          </Link>
          <Link
            to="/hidden/projects"
            className="block font-raleway text-text-1"
          >
            <div className="inline-block border-b border-background px-2 pt-2 transition-all hover:border-accent">
              Projects
            </div>
          </Link>
          <Link to="/hidden/tiktoks" className="block font-raleway text-text-1">
            <div className="inline-block border-b border-background px-2 pt-2 transition-all hover:border-accent">
              TikToks
            </div>
          </Link>
          <Link to="/hidden/memes" className="block font-raleway text-text-1">
            <div className="inline-block border-b border-background px-2 pt-2 transition-all hover:border-accent">
              Memes
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
