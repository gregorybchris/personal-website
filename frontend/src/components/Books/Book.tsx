import BookData from "./BookData";
import BookTag from "./BookTag";
import { cn } from "../../utilities/styleUtilities";

interface BookProps {
  book: BookData;
  activeTags: string[];
  onTagClick: (tag: string) => void;
  bookShape: string;
}

export default function Book(props: BookProps) {
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
              "border-2 border-dark-background hover:border-accent transition-all",
              isSquare ? "h-[300px] md:h-[200px]" : "h-[300px] md:h-[250px]"
            )}
          />
        </a>
      </div>

      {props.bookShape == "book" && (
        <div>
          <a href={props.book.goodreads_link} target="_blank">
            <div className="font-bold text-center">{props.book.title}</div>
            <div className="text-center">{props.book.author}</div>
          </a>

          <div className="flex justify-center mt-1">
            {props.book.tags.map((tag) => (
              <BookTag key={tag} tag={tag} onClick={props.onTagClick} active={props.activeTags.includes(tag)} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
