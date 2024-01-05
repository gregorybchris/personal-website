import { Link } from "react-router-dom";

export function HiddenPage() {
  return (
    <div>
      <div className="w-[70%] mx-auto py-4">
        <div className="font-noto text-text-1 font-bold text-4xl pb-10 block text-center">Hidden Pages</div>
        <div className="font-raleway tracking-wide text-lg text-text-1 leading-6 text-center">
          If you found your way here, I congratulate you. These pages are intended to be hidden.
        </div>
      </div>
      <div className="w-[70%] mx-auto py-4">
        <div>
          <Link to="/hidden/archive" className="font-raleway text-text-1 block">
            <div className="border-b border-background transition-all hover:border-accent inline-block pt-2 px-2">
              Archive
            </div>
          </Link>
          <Link to="/hidden/blog-graph" className="font-raleway text-text-1 block">
            <div className="border-b border-background transition-all hover:border-accent inline-block pt-2 px-2">
              Blog Graph
            </div>
          </Link>
          <Link to="/hidden/places" className="font-raleway text-text-1 block">
            <div className="border-b border-background transition-all hover:border-accent inline-block pt-2 px-2">
              Places
            </div>
          </Link>
          <Link to="/hidden/surveys" className="font-raleway text-text-1 block">
            <div className="border-b border-background transition-all hover:border-accent inline-block pt-2 px-2">
              Surveys
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
