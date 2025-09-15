import { BrowserRouter, Route, Routes } from "react-router-dom";

import Nav from "./components/Nav";
import { ArchivePage } from "./pages/ArchivePage";
import { ArtistsPage } from "./pages/ArtistsPage";
import { BlogPage } from "./pages/BlogPage";
import { BlogPostPage } from "./pages/BlogPostPage";
import { BooksPage } from "./pages/BooksPage";
import { CodeProjectsPage } from "./pages/CodeProjectsPage";
import { ContactPage } from "./pages/ContactPage";
import { FeedGraphPage } from "./pages/FeedGraphPage";
import { FeedPage } from "./pages/FeedPage";
import { HiddenPage } from "./pages/HiddenPage";
import { HomePage } from "./pages/HomePage";
import { InstagramsPage } from "./pages/InstagramsPage";
import { MemesPage } from "./pages/MemesPage";
import { MoviesPage } from "./pages/MoviesPage";
import { MusicPage } from "./pages/MusicPage";
import { OopsPage } from "./pages/OopsPage";
import { PlacesPage } from "./pages/PlacesPage";
import { PodcastsPage } from "./pages/PodcastsPage";
import { ProjectPreviewsPage } from "./pages/ProjectPreviewsPage";
import { RecipePage } from "./pages/RecipePage";
import { RecipesPage } from "./pages/RecipesPage";
import { RunningRoutesPage } from "./pages/RunningRoutesPage";
import { SurveysPage } from "./pages/SurveysPage";
import { TiktoksPage } from "./pages/TiktoksPage";
import { TvShowsPage } from "./pages/TvShowsPage";
import { WatermarkPage } from "./pages/WatermarkPage";
import { YouTubeChannelsPage } from "./pages/YouTubeChannelsPage";
import { YouTubeVideosPage } from "./pages/YouTubeVideosPage";

export function App() {
  return (
    <div>
      <BrowserRouter>
        <Nav />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/code" element={<CodeProjectsPage />}>
            <Route path=":slug" element={<CodeProjectsPage />} />
          </Route>
          <Route path="/running" element={<RunningRoutesPage />}>
            <Route path=":slug" element={<RunningRoutesPage />} />
          </Route>
          <Route path="/music" element={<MusicPage />} />
          <Route path="/links" element={<FeedPage />}>
            <Route path=":slug" element={<FeedPage />} />
          </Route>
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route path="/books" element={<BooksPage />} />
          <Route path="/contact" element={<ContactPage />} />

          <Route path="/hidden" element={<HiddenPage />} />
          <Route path="/hidden/books" element={<BooksPage />} />
          <Route path="/hidden/surveys" element={<SurveysPage />} />
          <Route path="/hidden/feed-graph" element={<FeedGraphPage />} />
          <Route path="/hidden/places" element={<PlacesPage />} />
          <Route path="/hidden/archive" element={<ArchivePage />} />
          <Route path="/hidden/shows" element={<TvShowsPage />} />
          <Route
            path="/hidden/youtube-channels"
            element={<YouTubeChannelsPage />}
          />
          <Route
            path="/hidden/youtube-videos"
            element={<YouTubeVideosPage />}
          />
          <Route path="/hidden/artists" element={<ArtistsPage />} />
          <Route path="/hidden/movies" element={<MoviesPage />} />
          <Route path="/hidden/podcasts" element={<PodcastsPage />} />
          <Route path="/hidden/recipes" element={<RecipesPage />} />
          <Route path="/hidden/recipes/:slug" element={<RecipePage />} />
          <Route path="/hidden/watermark" element={<WatermarkPage />} />
          <Route path="/hidden/projects" element={<ProjectPreviewsPage />} />
          <Route path="/hidden/tiktoks" element={<TiktoksPage />}>
            <Route path=":id" element={<TiktoksPage />} />
          </Route>
          <Route path="/hidden/memes" element={<MemesPage />}>
            <Route path=":id" element={<MemesPage />} />
          </Route>
          <Route path="/hidden/instagrams" element={<InstagramsPage />}>
            <Route path=":id" element={<InstagramsPage />} />
          </Route>

          <Route path="*" element={<OopsPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
