import { render, screen } from "@testing-library/react";
import KanbanBoard from "../components/KanbanBoard";
import "@testing-library/jest-dom";
it("renders all columns", () => {
  render(<KanbanBoard searchQuery="" setSearchQuery={() => {}} />);

  const inProgressColumnHeader = screen.getByRole("heading", {
    name: "In Progress",
  });
  expect(inProgressColumnHeader).toBeInTheDocument();

  // Check that other column headers l are rendered
  expect(screen.getByRole("heading", { name: "Done" })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "To Do" })).toBeInTheDocument();
});

test("renders tasks in their respective columns", () => {
  render(<KanbanBoard searchQuery="" setSearchQuery={() => {}} />);

  // Check if tasks are in the correct column
  expect(screen.getByText("Task 1")).toBeInTheDocument();
  expect(screen.getByText("Task 2")).toBeInTheDocument();
  expect(screen.getByText("Task 3")).toBeInTheDocument();
  expect(screen.getByText("Task 4")).toBeInTheDocument();
});
