import { BookData } from "../models/booksModels";
import { cn } from "../utilities/styleUtilities";
import { BookTag } from "./BookTag";

interface BookProps {
  book: BookData;
  activeTags: string[];
  onTagClick: (tag: string) => void;
  bookShape: string;
}

export function Book(props: BookProps) {
  const imageLinks = props.book.image_links;
  const isSquare = props.bookShape == "square";
  const imageLink = isSquare ? imageLinks.square : imageLinks.book;
  const timestamp = Date.now();
  return (
    <div className={cn("px-2", isSquare ? "py-0" : "py-3")}>
      <div className="mb-2 flex justify-center">
        <a href={props.book.goodreads_link} target="_blank">
          <img
            src={`${imageLink}?a=${timestamp}`}
            className={cn(
              "border-2 border-background-dark transition-all hover:border-accent",
              isSquare ? "h-[300px] md:h-[200px]" : "h-[300px] md:h-[250px]",
            )}
          />
        </a>
      </div>

      {props.bookShape == "book" && (
        <div>
          <a href={props.book.goodreads_link} target="_blank">
            <div className="text-center font-bold">{props.book.title}</div>
            <div className="text-center">{props.book.author}</div>
          </a>

          <div className="mt-1 flex justify-center">
            {props.book.tags.map((tag) => (
              <BookTag
                key={tag}
                tag={tag}
                onClick={props.onTagClick}
                active={props.activeTags.includes(tag)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
