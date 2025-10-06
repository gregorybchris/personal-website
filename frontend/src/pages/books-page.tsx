import { useEffect, useState } from "react";
import { Loader } from "../components/loader";
import { PageTitle } from "../components/page-title";
import { Tag } from "../components/tag";
import { GET, makeQuery } from "../utilities/request-utilities";

export interface BookData {
  isbn: string;
  title: string;
  subtitle?: string;
  author: string;
  year_read: number;
  general_appeal: number;
  tags: string[];
  goodreads_link: string;
  image_links: {
    book: string;
    square: string;
  };
}

export function BooksPage() {
  const [books, setBooks] = useState<BookData[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);

  useEffect(() => {
    const booksQuery = makeQuery("media/books");
    GET(booksQuery).then((books: BookData[]) => {
      setBooks(books);
      const tagsSet = new Set<string>();
      books.forEach((book) => {
        book.tags.forEach((tag) => tagsSet.add(tag));
      });
      setAllTags(Array.from(tagsSet));
    });
  }, []);

  function onTagClick(tag: string) {
    let newTags: string[] = [];
    if (selectedTags.includes(tag)) {
      newTags = selectedTags.filter((selectedTag) => selectedTag !== tag);
    } else {
      newTags = [...selectedTags, tag];
    }
    setSelectedTags(newTags);
  }

  return (
    <div className="flex flex-col items-center gap-10 px-4 py-8">
      <div className="flex flex-col items-center gap-4 md:w-4/5">
        <PageTitle>Books</PageTitle>

        <div className="text-center text-black/75 md:w-[70%]">
          I don't love recommending books because it always feels like assigned
          reading and I never liked assigned reading. But on the off chance
          you're a fan of one of the titles below you might consider picking up
          another, totally unassigned.
        </div>
      </div>

      {books.length === 0 ? (
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
              .map((book) => (
                <Book
                  key={book.isbn}
                  book={book}
                  onTagClick={onTagClick}
                  selectedTags={selectedTags}
                />
              ))}
          </div>
        </>
      )}
    </div>
  );
}

interface BookProps {
  book: BookData;
  selectedTags: string[];
  onTagClick: (tag: string) => void;
}

function Book({ book, selectedTags, onTagClick }: BookProps) {
  return (
    <div className="flex flex-col items-center gap-2">
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
