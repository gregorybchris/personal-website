import { Books as BooksIcon, SquaresFour } from "@phosphor-icons/react";
import { GET, makeQuery } from "../utilities/requestUtilities";
import { useEffect, useState } from "react";

import { Book } from "../components/Book";
import { BookData } from "../models/booksModels";
import { BookTag } from "../components/BookTag";
import { cn } from "../utilities/styleUtilities";

export function BooksPage() {
  const [books, setBooks] = useState<BookData[]>([]);
  const [bookShape, setBookShape] = useState<string>("book");
  const [activeTags, setActiveTags] = useState<string[]>([]);
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
    if (activeTags.includes(tag)) {
      newTags = activeTags.filter((activeTag) => activeTag !== tag);
    } else {
      newTags = [...activeTags, tag];
    }
    setActiveTags(newTags);
  }

  return (
    <div className="grid justify-items-center pt-8 font-raleway">
      <div className="w-4/5">
        <div className="mb-5 text-center font-noto text-3xl font-bold text-text-1">
          Books
        </div>
        <div className="pb-5 text-center text-text-1">
          Sharing books can be a dangerous game, the knife's edge between a mind
          transformed and the most dreadful obligation of assigned reading. And
          book preferences are wonderfully personal. My own literary corner
          would no doubt be considered niche to many people. But if, on the off
          chance, you're a fan of one of the titles below you might consider
          picking up another, not assigned, obligation free.
        </div>
      </div>

      <div className="mt-2 flex flex-row justify-between gap-2">
        <div
          className={cn(
            "cursor-pointer border-2 border-accent transition-all hover:border-accent-focus",
            bookShape == "book" && "bg-accent",
          )}
          onClick={() => setBookShape("book")}
        >
          <BooksIcon
            size={32}
            color={bookShape == "book" ? "white" : "black"}
          />
        </div>
        <div
          className={cn(
            "cursor-pointer border-2 border-accent transition-all hover:border-accent-focus",
            bookShape == "square" && "bg-accent",
          )}
          onClick={() => setBookShape("square")}
        >
          <SquaresFour
            size={32}
            color={bookShape == "square" ? "white" : "black"}
          />
        </div>
      </div>

      <div className="mt-4 flex justify-center">
        {allTags.map((tag) => (
          <BookTag
            key={tag}
            tag={tag}
            onClick={onTagClick}
            active={activeTags.includes(tag)}
          />
        ))}
      </div>

      <div
        className={cn(
          "grid w-4/5 justify-items-center pt-5",
          bookShape == "square"
            ? "grid-cols-1 md:grid-cols-3 lg:grid-cols-4"
            : "grid-cols-1 md:grid-cols-4 lg:grid-cols-5",
        )}
      >
        {books
          .filter(
            (book) =>
              activeTags.length == 0 ||
              activeTags.every((tag) => book.tags.includes(tag)),
          )
          .sort(
            (bookA, bookB) => bookB.recommendability - bookA.recommendability,
          )
          .map((book) => (
            <Book
              key={book.isbn}
              book={book}
              onTagClick={onTagClick}
              activeTags={activeTags}
              bookShape={bookShape}
            />
          ))}
      </div>
    </div>
  );
}
