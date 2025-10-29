import { useEffect, useState } from "react";
import { Loader } from "../components/loader";
import { PageTitle } from "../components/page-title";
import { Tag } from "../components/tag";
import { GET, makeQuery } from "../utilities/request-utilities";

export interface Book {
  isbn: string;
  title: string;
  subtitle?: string;
  author: string;
  year_read: number;
  general_appeal: number;
  archived: boolean;
  tags: string[];
  goodreads_link: string;
  image_links: {
    book: string;
    square: string;
  };
}

export function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const booksQuery = makeQuery("media/books");
    GET(booksQuery)
      .then((books: Book[]) => {
        const tagsSet = new Set<string>();
        books.forEach((book) => {
          book.tags.forEach((tag) => tagsSet.add(tag));
        });
        setAllTags(Array.from(tagsSet));

        // Preload all images
        const imagePromises = books.map((book) => {
          return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(null);
            img.onerror = () => resolve(null); // Still resolve on error to not block
            img.src = `${book.image_links.book}?cache=2`;
          });
        });

        Promise.all(imagePromises).then(() => {
          setBooks(books.filter((book) => !book.archived));
          setImagesLoaded(true);
          setError(null);
        });
      })
      .catch((err) => {
        console.error("Failed to load books:", err);
        setError("Failed to load books. Please try again later.");
      });
  }, []);

  function onTagClick(tag: string) {
    const newTags: string[] = selectedTags.includes(tag)
      ? selectedTags.filter((selectedTag) => selectedTag !== tag)
      : [...selectedTags, tag];
    setSelectedTags(newTags);
  }

  return (
    <div className="flex flex-col items-center gap-10 px-4 py-8">
      <div className="flex flex-col items-center gap-4 md:w-4/5">
        <PageTitle>Books</PageTitle>

        <div className="text-center text-balance text-black/75 md:w-[70%]">
          If you enjoy non-fiction science and philosophy books, then you might
          enjoy something here on my virtual bookshelf, especially if you're
          into cognitive science or complex systems theory.
        </div>
      </div>

      {error ? (
        <div className="text-center text-red-600">{error}</div>
      ) : !imagesLoaded ? (
        <Loader>Loading books...</Loader>
      ) : (
        <>
          <div className="flex flex-col items-center gap-1">
            <div className="text-sm text-black/75">Filter by tag</div>
            <div className="flex flex-row justify-center gap-0.5">
              {allTags.map((tag) => (
                <Tag
                  key={tag}
                  tag={tag}
                  onClick={onTagClick}
                  selected={selectedTags.includes(tag)}
                  className="text-xs"
                />
              ))}
            </div>
          </div>

          <div className="flex w-full flex-row flex-wrap justify-center gap-x-2 gap-y-5 md:w-4/5 md:gap-x-4">
            {books
              .filter(
                (book) =>
                  selectedTags.length === 0 ||
                  selectedTags.every((tag) => book.tags.includes(tag)),
              )
              .sort(
                (bookA, bookB) => bookB.general_appeal - bookA.general_appeal,
              )
              .map((book, index) => (
                <BookCard
                  key={book.isbn}
                  book={book}
                  onTagClick={onTagClick}
                  selectedTags={selectedTags}
                  index={index}
                />
              ))}
          </div>
        </>
      )}
    </div>
  );
}

interface BookCardProps {
  book: Book;
  selectedTags: string[];
  onTagClick: (tag: string) => void;
  index: number;
}

function BookCard({ book, selectedTags, onTagClick, index }: BookCardProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), index * 80);
    return () => clearTimeout(timer);
  }, [index]);

  return (
    <div
      className={`flex flex-col items-center gap-2 transition-all duration-300 ${
        isVisible
          ? "translate-y-0 opacity-100"
          : "translate-y-[-20px] opacity-0"
      }`}
    >
      <a href={book.goodreads_link} target="_blank">
        <img
          src={`${book.image_links.book}?cache=2`}
          className="hover:border-sky/60 h-[210px] rounded-lg border-4 border-white/60 shadow-md transition-all md:h-[250px]"
        />
      </a>

      <div className="flex flex-row flex-wrap items-center gap-0.5">
        {book.tags.map((tag) => (
          <Tag
            key={tag}
            tag={tag}
            onClick={onTagClick}
            selected={selectedTags.includes(tag)}
            className="text-xs"
          />
        ))}
      </div>
    </div>
  );
}
