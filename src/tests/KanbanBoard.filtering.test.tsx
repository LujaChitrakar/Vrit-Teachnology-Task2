import { render, screen } from "@testing-library/react";
import KanbanBoard from "../components/KanbanBoard";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { useState } from "react";

// Mock wrapper to simulate the state
const KanbanBoardWithSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  return (
    <KanbanBoard searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
  );
};

test("filters tasks based on search query", async () => {
  render(<KanbanBoardWithSearch />);

  // Simulate typing in the search input
  const searchInput = screen.getByPlaceholderText("Search tasks...");
  await userEvent.type(searchInput, "Task 1");

  // Ensure "Task 1" is displayed
  expect(screen.getByText("Task 1")).toBeInTheDocument();

  // Ensure other tasks like "Task 2" are not displayed
  expect(screen.queryByText("Task 2")).not.toBeInTheDocument();
});
