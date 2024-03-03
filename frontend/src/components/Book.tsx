import { BookData } from "../models/booksModels";
import { cn } from "../utilities/styleUtilities";
import { BookTag } from "./BookTag";

interface BookProps {
  book: BookData;
  activeTags: string[];
  onTagClick: (tag: string) => void;
  bookShape: string;
}

export function Book({ book, activeTags, onTagClick, bookShape }: BookProps) {
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

          <div className="mt-1 flex justify-center">
            {book.tags.map((tag) => (
              <BookTag
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
