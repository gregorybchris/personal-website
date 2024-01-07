import { BrowserRouter, Route, Routes } from "react-router-dom";

import { ArchivePage } from "./pages/ArchivePage";
import { BlogGraph } from "./components/BlogGraph";
import { BlogPage } from "./pages/BlogPage";
import { BooksPage } from "./pages/BooksPage";
import { CodeProjectsPage } from "./pages/CodeProjectsPage";
import { ContactPage } from "./pages/ContactPage";
import { HiddenPage } from "./pages/HiddenPage";
import { HomePage } from "./pages/HomePage";
import { MoviesPage } from "./pages/MoviesPage";
import { MusicPage } from "./pages/MusicPage";
import Nav from "./components/Nav";
import { OopsPage } from "./pages/OopsPage";
import { PlacesPage } from "./pages/PlacesPage";
import { PodcastsPage } from "./pages/PodcastsPage";
import { RecipePage } from "./pages/RecipePage";
import { RecipesPage } from "./pages/RecipesPage";
import { RunningRoutesPage } from "./pages/RunningRoutesPage";
import { SurveysPage } from "./pages/SurveysPage";
import { TvShowsPage } from "./pages/TvShowsPage";
import { YouTubeChannelsPage } from "./pages/YouTubeChannelsPage";

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
          <Route path="/hidden/channels" element={<YouTubeChannelsPage />} />
          <Route path="/hidden/movies" element={<MoviesPage />} />
          <Route path="/hidden/podcasts" element={<PodcastsPage />} />
          <Route path="/hidden/recipes" element={<RecipesPage />} />
          <Route path="/hidden/recipes/:slug" element={<RecipePage />} />

          <Route path="*" element={<OopsPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
