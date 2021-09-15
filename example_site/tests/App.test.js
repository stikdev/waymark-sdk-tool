import { render } from "@testing-library/react";
import App from "../src/components/App";

test("renders without throwing an error", () => {
  render(<App />);
});
