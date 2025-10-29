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
          <PageLink to="/blog?admin=true">Blog</PageLink>
        </div>

        <div className="flex flex-col">
          <SectionHeader>Current</SectionHeader>
          <PageLink to="/scene">Scene</PageLink>
          <div className="w-4 border-1 border-black/10"></div>

          <PageLink to="/artists">Artists</PageLink>
          <div className="w-4 border-1 border-black/10"></div>

          <PageLink to="/instagrams">Instagrams</PageLink>
          <PageLink to="/tiktoks">TikToks</PageLink>
          <PageLink to="/youtube-videos">YouTube Videos</PageLink>
          <PageLink to="/memes">Memes</PageLink>
          <div className="w-4 border-1 border-black/10"></div>

          <PageLink to="/movies">Movies</PageLink>
          <PageLink to="/shows">TV Shows</PageLink>
          <div className="w-4 border-1 border-black/10"></div>

          <PageLink to="/youtube-channels">YouTube Channels</PageLink>
          <PageLink to="/podcasts">Podcasts</PageLink>
          <div className="w-4 border-1 border-black/10"></div>

          <PageLink to="/hiking">Hiking</PageLink>
        </div>

        <div className="flex flex-col">
          <SectionHeader>Old</SectionHeader>
          <PageLink to="/archive">Archive</PageLink>
          <PageLink to="/feed">Feed</PageLink>
          <PageLink to="/feed-graph">Feed Graph</PageLink>
          <PageLink to="/places">Places</PageLink>
          <PageLink to="/project-logos">Project Logos</PageLink>
          <PageLink to="/recipes">Recipes</PageLink>
          <PageLink to="/surveys">Surveys</PageLink>
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
