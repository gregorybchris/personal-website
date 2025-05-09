import { BrowserRouter, Route, Routes } from "react-router-dom";

import { BlogGraph } from "./components/BlogGraph";
import Nav from "./components/Nav";
import { ArchivePage } from "./pages/ArchivePage";
import { BlogPage } from "./pages/BlogPage";
import { BooksPage } from "./pages/BooksPage";
import { CodeProjectsPage } from "./pages/CodeProjectsPage";
import { ContactPage } from "./pages/ContactPage";
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
          <Route path="/links" element={<BlogPage />}>
            <Route path=":slug" element={<BlogPage />} />
          </Route>
          <Route path="/books" element={<BooksPage />} />
          <Route path="/contact" element={<ContactPage />} />

          <Route path="/hidden" element={<HiddenPage />} />
          <Route path="/hidden/books" element={<BooksPage />} />
          <Route path="/hidden/surveys" element={<SurveysPage />} />
          <Route path="/hidden/blog-graph" element={<BlogGraph />} />
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
