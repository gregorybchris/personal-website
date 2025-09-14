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
          <div className="py-2">
            <div className="inline-block pt-2 font-noto text-lg text-text-3 transition-all">
              Media
            </div>
            <Link
              to="/hidden/artists"
              className="block font-raleway text-text-1"
            >
              <div className="inline-block border-b border-background px-2 pt-2 transition-all hover:border-accent">
                Artists
              </div>
            </Link>
            <Link
              to="/hidden/instagrams"
              className="block font-raleway text-text-1"
            >
              <div className="inline-block border-b border-background px-2 pt-2 transition-all hover:border-accent">
                Instagrams
              </div>
            </Link>
            <Link to="/hidden/memes" className="block font-raleway text-text-1">
              <div className="inline-block border-b border-background px-2 pt-2 transition-all hover:border-accent">
                Memes
              </div>
            </Link>
            <Link
              to="/hidden/movies"
              className="block font-raleway text-text-1"
            >
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
            <Link
              to="/hidden/tiktoks"
              className="block font-raleway text-text-1"
            >
              <div className="inline-block border-b border-background px-2 pt-2 transition-all hover:border-accent">
                TikToks
              </div>
            </Link>
            <Link to="/hidden/shows" className="block font-raleway text-text-1">
              <div className="inline-block border-b border-background px-2 pt-2 transition-all hover:border-accent">
                TV Shows
              </div>
            </Link>
            <Link
              to="/hidden/youtube-channels"
              className="block font-raleway text-text-1"
            >
              <div className="inline-block border-b border-background px-2 pt-2 transition-all hover:border-accent">
                YouTube Channels
              </div>
            </Link>
            <Link
              to="/hidden/youtube-videos"
              className="block font-raleway text-text-1"
            >
              <div className="inline-block border-b border-background px-2 pt-2 transition-all hover:border-accent">
                YouTube Videos
              </div>
            </Link>
          </div>

          <div className="py-2">
            <div className="inline-block pt-2 font-noto text-lg text-text-3 transition-all">
              Blog
            </div>
            <Link to="/blog" className="block font-raleway text-text-1">
              <div className="inline-block border-b border-background px-2 pt-2 transition-all hover:border-accent">
                Blog
              </div>
            </Link>
          </div>

          <div className="py-2">
            <div className="inline-block pt-2 font-noto text-lg text-text-3 transition-all">
              Link Feed
            </div>
            <Link to="/links" className="block font-raleway text-text-1">
              <div className="inline-block border-b border-background px-2 pt-2 transition-all hover:border-accent">
                Feed
              </div>
            </Link>
            <Link
              to="/hidden/feed-graph"
              className="block font-raleway text-text-1"
            >
              <div className="inline-block border-b border-background px-2 pt-2 transition-all hover:border-accent">
                Feed Graph
              </div>
            </Link>
          </div>

          <div className="py-2">
            <div className="inline-block pt-2 font-noto text-lg text-text-3 transition-all">
              In progress
            </div>
            <Link
              to="/hidden/places"
              className="block font-raleway text-text-1"
            >
              <div className="inline-block border-b border-background px-2 pt-2 transition-all hover:border-accent">
                Places
              </div>
            </Link>
            <Link
              to="/hidden/recipes"
              className="block font-raleway text-text-1"
            >
              <div className="inline-block border-b border-background px-2 pt-2 transition-all hover:border-accent">
                Recipes
              </div>
            </Link>
            <Link
              to="/hidden/watermark"
              className="block font-raleway text-text-1"
            >
              <div className="inline-block border-b border-background px-2 pt-2 transition-all hover:border-accent">
                Site watermark
              </div>
            </Link>
            <Link
              to="/hidden/projects"
              className="block font-raleway text-text-1"
            >
              <div className="inline-block border-b border-background px-2 pt-2 transition-all hover:border-accent">
                Project logos
              </div>
            </Link>
          </div>

          <div className="py-2">
            <div className="inline-block pt-2 font-noto text-lg text-text-3 transition-all">
              Old
            </div>
            <Link
              to="/hidden/archive"
              className="block font-raleway text-text-1"
            >
              <div className="inline-block border-b border-background px-2 pt-2 transition-all hover:border-accent">
                Archive
              </div>
            </Link>
            <Link
              to="/hidden/surveys"
              className="block font-raleway text-text-1"
            >
              <div className="inline-block border-b border-background px-2 pt-2 transition-all hover:border-accent">
                Surveys
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
