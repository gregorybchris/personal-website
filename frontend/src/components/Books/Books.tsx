import { Books as BooksIcon, SquaresFour } from "@phosphor-icons/react";
import { GET, makeQuery } from "../../utilities/requestUtilities";
import { useEffect, useState } from "react";

import Book from "./Book";
import BookData from "./BookData";
import BookTag from "./BookTag";

export default function Books() {
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
    <div className="font-raleway pt-8 grid justify-items-center">
      <div className="w-4/5">
        <div className="font-noto text-text-1 text-3xl font-bold mb-5 text-center">Books</div>
        <div className="text-text-1 pb-5 text-center">
          I don't consider myself a huge reader, but I do try to get a couple in every year. Here are some books I
          enjoyed!
        </div>
      </div>

      <div className="flex flex-row justify-between gap-2 mt-2">
        <div
          className="cursor-pointer hover:border-accent-focus border-accent border-2 transition-all"
          onClick={() => setBookShape("book")}
        >
          <BooksIcon size={32} />
        </div>
        <div
          className="cursor-pointer hover:border-accent-focus border-accent border-2 transition-all"
          onClick={() => setBookShape("square")}
        >
          <SquaresFour size={32} />
        </div>
      </div>

      <div className="flex justify-center mt-4">
        {allTags.map((tag) => (
          <BookTag key={tag} tag={tag} onClick={onTagClick} active={activeTags.includes(tag)} />
        ))}
      </div>

      <div className="w-4/5 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 pt-5 justify-items-center">
        {books
          .filter((book) => activeTags.length == 0 || activeTags.every((tag) => book.tags.includes(tag)))
          .sort((bookA, bookB) => bookB.recommendability - bookA.recommendability)
          .map((book) => (
            <Book key={book.isbn} book={book} onTagClick={onTagClick} activeTags={activeTags} bookShape={bookShape} />
          ))}
      </div>
    </div>
  );
}
