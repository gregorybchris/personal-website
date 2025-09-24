import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import { CommandBar } from "./components/command-bar";
import { Nav } from "./components/nav";
import { ArchivePage } from "./pages/archive-page";
import { ArtistsPage } from "./pages/artists-page";
import { BlogPage } from "./pages/blog-page";
import { BlogPostPage } from "./pages/blog-post-page";
import { BooksPage } from "./pages/books-page";
import { ContactPage } from "./pages/contact-page";
import { FeedGraphPage } from "./pages/feed-graph-page";
import { FeedPage } from "./pages/feed-page";
import { HiddenPage } from "./pages/hidden-page";
import { HomePage } from "./pages/home-page";
import { InstagramsPage } from "./pages/instagrams-page";
import { MemesPage } from "./pages/memes-page";
import { MoviesPage } from "./pages/movies-page";
import { MusicPage } from "./pages/music-page";
import { OopsPage } from "./pages/oops-page";
import { PlacesPage } from "./pages/places-page";
import { PodcastsPage } from "./pages/podcasts-page";
import { ProjectLogosPage } from "./pages/project-previews-page";
import { ProjectsPage } from "./pages/projects-page";
import { RecipePage } from "./pages/recipe-page";
import { RecipesPage } from "./pages/recipes-page";
import { RunningPage } from "./pages/running-page";
import { SurveysPage } from "./pages/surveys-page";
import { TiktoksPage } from "./pages/tiktoks-page";
import { TvShowsPage } from "./pages/tv-shows-page";
import { WatermarkPage } from "./pages/watermark-page";
import { YouTubeChannelsPage } from "./pages/youtube-channels-page";
import { YouTubeVideosPage } from "./pages/youtube-videos-page";

export function App() {
  return (
    <div className="bg-parchment font-raleway">
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    </div>
  );
}

function Layout() {
  const location = useLocation();

  return (
    <div>
      <>
        <Toaster
          theme="light"
          toastOptions={{
            className: "font-raleway",
          }}
        />
        <CommandBar />
        {location.pathname !== "/" && <Nav />}

        <Routes>
          {/* Main */}
          <Route path="/" element={<HomePage />} />
          <Route path="/projects" element={<ProjectsPage />}>
            <Route path=":slug" element={<ProjectsPage />} />
          </Route>
          <Route path="/running" element={<RunningPage />}>
            <Route path=":slug" element={<RunningPage />} />
          </Route>
          <Route path="/music" element={<MusicPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route path="/books" element={<BooksPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* Hidden */}
          <Route path="/hidden" element={<HiddenPage />} />

          {/* Hidden media */}
          <Route path="/hidden/artists" element={<ArtistsPage />} />
          <Route path="/hidden/instagrams" element={<InstagramsPage />}>
            <Route path=":id" element={<InstagramsPage />} />
          </Route>
          <Route path="/hidden/memes" element={<MemesPage />}>
            <Route path=":id" element={<MemesPage />} />
          </Route>
          <Route path="/hidden/movies" element={<MoviesPage />} />
          <Route path="/hidden/podcasts" element={<PodcastsPage />} />
          <Route path="/hidden/tiktoks" element={<TiktoksPage />}>
            <Route path=":id" element={<TiktoksPage />} />
          </Route>
          <Route path="/hidden/shows" element={<TvShowsPage />} />
          <Route
            path="/hidden/youtube-channels"
            element={<YouTubeChannelsPage />}
          />
          <Route
            path="/hidden/youtube-videos"
            element={<YouTubeVideosPage />}
          />

          {/* Hidden feed */}
          <Route path="/hidden/feed" element={<FeedPage />}>
            <Route path=":slug" element={<FeedPage />} />
          </Route>
          <Route path="/hidden/feed-graph" element={<FeedGraphPage />} />

          {/* Hidden in progress */}
          <Route path="/hidden/places" element={<PlacesPage />} />
          <Route path="/hidden/recipes" element={<RecipesPage />} />
          <Route path="/hidden/recipes/:slug" element={<RecipePage />} />
          <Route path="/hidden/project-logos" element={<ProjectLogosPage />} />
          <Route path="/hidden/watermark" element={<WatermarkPage />} />

          {/* Hidden old */}
          <Route path="/hidden/archive" element={<ArchivePage />} />
          <Route path="/hidden/surveys" element={<SurveysPage />} />

          {/* Oops */}
          <Route path="*" element={<OopsPage />} />
        </Routes>
      </>
    </div>
  );
}
