import { Books as BooksIcon, SquaresFour } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { Tag } from "../components/Tag";
import { GET, makeQuery } from "../utilities/requestUtilities";
import { cn } from "../utilities/styleUtilities";

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
        <div className="mx-auto w-[95%] py-3 text-center text-text-1 md:w-[70%]">
          I don't love recommending books because it always feels like assigned
          reading and I never liked assigned reading. But on the off chance
          you're a fan of one of the titles below you might consider picking up
          another, totally unassigned.
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

      <div className="mt-4 flex flex-row justify-center space-x-2">
        {allTags.map((tag) => (
          <Tag
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
          .sort((bookA, bookB) => bookB.general_appeal - bookA.general_appeal)
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

interface BookProps {
  book: BookData;
  activeTags: string[];
  onTagClick: (tag: string) => void;
  bookShape: string;
}

function Book({ book, activeTags, onTagClick, bookShape }: BookProps) {
  const imageLinks = book.image_links;
  const isSquare = bookShape == "square";
  const imageLink = isSquare ? imageLinks.square : imageLinks.book;
  const timestamp = Date.now();
  return (
    <div className={cn("px-2", isSquare ? "py-0" : "py-3")}>
      <div className="mb-2 flex justify-center">
        <a href={book.goodreads_link} target="_blank">
          <img
            src={`${imageLink}?a=${timestamp}`}
            className={cn(
              "border-2 border-background-dark transition-all hover:border-accent",
              isSquare ? "h-[300px] md:h-[200px]" : "h-[300px] md:h-[250px]",
            )}
          />
        </a>
      </div>

      {bookShape == "book" && (
        <div>
          <a href={book.goodreads_link} target="_blank">
            <div className="text-center font-bold">{book.title}</div>
            <div className="text-center">{book.author}</div>
          </a>

          <div className="mt-1 flex flex-row justify-center space-x-1">
            {book.tags.map((tag) => (
              <Tag
                key={tag}
                tag={tag}
                onClick={onTagClick}
                active={activeTags.includes(tag)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
