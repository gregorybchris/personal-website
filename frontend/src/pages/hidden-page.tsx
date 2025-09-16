import { Link } from "react-router-dom";

export function HiddenPage() {
  return (
    <div className="flex flex-col items-center gap-12 p-8">
      <div className="flex w-[80%] flex-col items-center gap-4 text-center">
        <div className="font-sanchez text-3xl text-black/75">Hidden Pages</div>
        <div className="text-black/75">
          If you found your way here, I congratulate you. These pages are
          intended to be hidden.
        </div>
      </div>

      <div className="flex w-[80%] flex-row flex-wrap justify-center gap-16">
        <div className="flex flex-col">
          <div className="font-sanchez text-lg underline">Media</div>
          <Link to="/hidden/artists" className="text-black/75">
            <div className="py-1 text-sm decoration-blue-500/60 underline-offset-4 hover:underline">
              Artists
            </div>
          </Link>
          <Link to="/hidden/instagrams" className="text-black/75">
            <div className="py-1 text-sm decoration-blue-500/60 underline-offset-4 hover:underline">
              Instagrams
            </div>
          </Link>
          <Link to="/hidden/memes" className="text-black/75">
            <div className="py-1 text-sm decoration-blue-500/60 underline-offset-4 hover:underline">
              Memes
            </div>
          </Link>
          <Link to="/hidden/movies" className="text-black/75">
            <div className="py-1 text-sm decoration-blue-500/60 underline-offset-4 hover:underline">
              Movies
            </div>
          </Link>
          <Link to="/hidden/podcasts" className="text-black/75">
            <div className="py-1 text-sm decoration-blue-500/60 underline-offset-4 hover:underline">
              Podcasts
            </div>
          </Link>
          <Link to="/hidden/tiktoks" className="text-black/75">
            <div className="py-1 text-sm decoration-blue-500/60 underline-offset-4 hover:underline">
              TikToks
            </div>
          </Link>
          <Link to="/hidden/shows" className="text-black/75">
            <div className="py-1 text-sm decoration-blue-500/60 underline-offset-4 hover:underline">
              TV Shows
            </div>
          </Link>
          <Link to="/hidden/youtube-channels" className="text-black/75">
            <div className="py-1 text-sm decoration-blue-500/60 underline-offset-4 hover:underline">
              YouTube Channels
            </div>
          </Link>
          <Link to="/hidden/youtube-videos" className="text-black/75">
            <div className="py-1 text-sm decoration-blue-500/60 underline-offset-4 hover:underline">
              YouTube Videos
            </div>
          </Link>
        </div>

        <div className="flex flex-col">
          <div className="font-sanchez text-lg underline">Blog</div>
          <Link to="/blog" className="text-black/75">
            <div className="py-1 text-sm decoration-blue-500/60 underline-offset-4 hover:underline">
              Blog
            </div>
          </Link>
        </div>

        <div className="flex flex-col">
          <div className="font-sanchez text-lg underline">Link Feed</div>
          <Link to="/links" className="text-black/75">
            <div className="py-1 text-sm decoration-blue-500/60 underline-offset-4 hover:underline">
              Feed
            </div>
          </Link>
          <Link to="/hidden/feed-graph" className="text-black/75">
            <div className="py-1 text-sm decoration-blue-500/60 underline-offset-4 hover:underline">
              Feed Graph
            </div>
          </Link>
        </div>

        <div className="flex flex-col">
          <div className="font-sanchez text-lg underline">In Progress</div>
          <Link to="/hidden/places" className="text-black/75">
            <div className="py-1 text-sm decoration-blue-500/60 underline-offset-4 hover:underline">
              Places
            </div>
          </Link>
          <Link to="/hidden/recipes" className="text-black/75">
            <div className="py-1 text-sm decoration-blue-500/60 underline-offset-4 hover:underline">
              Recipes
            </div>
          </Link>
          <Link to="/hidden/watermark" className="text-black/75">
            <div className="py-1 text-sm decoration-blue-500/60 underline-offset-4 hover:underline">
              Site watermark
            </div>
          </Link>
          <Link to="/hidden/projects" className="text-black/75">
            <div className="py-1 text-sm decoration-blue-500/60 underline-offset-4 hover:underline">
              Project logos
            </div>
          </Link>
        </div>

        <div className="flex flex-col">
          <div className="font-sanchez text-lg underline">Old</div>
          <Link to="/hidden/archive" className="text-black/75">
            <div className="py-1 text-sm decoration-blue-500/60 underline-offset-4 hover:underline">
              Archive
            </div>
          </Link>
          <Link to="/hidden/surveys" className="text-black/75">
            <div className="py-1 text-sm decoration-blue-500/60 underline-offset-4 hover:underline">
              Surveys
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
