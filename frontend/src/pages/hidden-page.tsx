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

      <div className="flex w-full flex-row flex-wrap justify-center gap-16 md:w-[80%]">
        <div className="flex flex-col">
          <SectionHeader>Blog</SectionHeader>
          <PageLink to="/blog">Blog</PageLink>
        </div>

        <div className="flex flex-col">
          <SectionHeader>Current</SectionHeader>
          <PageLink to="/hidden/artists">Artists</PageLink>
          <div className="w-4 border-1 border-black/10"></div>

          <PageLink to="/hidden/instagrams">Instagrams</PageLink>
          <PageLink to="/hidden/tiktoks">TikToks</PageLink>
          <PageLink to="/hidden/youtube-videos">YouTube Videos</PageLink>
          <PageLink to="/hidden/memes">Memes</PageLink>
          <div className="w-4 border-1 border-black/10"></div>

          <PageLink to="/hidden/movies">Movies</PageLink>
          <PageLink to="/hidden/shows">TV Shows</PageLink>
          <div className="w-4 border-1 border-black/10"></div>

          <PageLink to="/hidden/youtube-channels">YouTube Channels</PageLink>
          <PageLink to="/hidden/podcasts">Podcasts</PageLink>
          <div className="w-4 border-1 border-black/10"></div>

          <PageLink to="/hidden/hiking">Hiking</PageLink>
        </div>

        <div className="flex flex-col">
          <SectionHeader>Old</SectionHeader>
          <PageLink to="/hidden/archive">Archive</PageLink>
          <PageLink to="/hidden/feed">Feed</PageLink>
          <PageLink to="/hidden/feed-graph">Feed Graph</PageLink>
          <PageLink to="/hidden/places">Places</PageLink>
          <PageLink to="/hidden/project-logos">Project Logos</PageLink>
          <PageLink to="/hidden/recipes">Recipes</PageLink>
          <PageLink to="/hidden/surveys">Surveys</PageLink>
        </div>
      </div>
    </div>
  );
}

function PageLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link to={to} className="text-black/75">
      <div className="py-1 text-sm decoration-blue-500/60 underline-offset-4 hover:underline">
        {children}
      </div>
    </Link>
  );
}

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-sanchez text-lg underline underline-offset-4">
      {children}
    </div>
  );
}
