import React from "react";
import { render } from "@testing-library/react";
import App from "./App";

test("renders message", () => {
  const { getByText } = render(<App />);
  const linkElement = getByText(/for the day/i);
  expect(linkElement).toBeInTheDocument();
});
