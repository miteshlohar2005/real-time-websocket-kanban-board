import { render, screen } from "@testing-library/react";

import KanbanBoard from "../../components/KanbanBoard.jsx";

test("renders Kanban board title", () => {
  render(<KanbanBoard />);
  expect(screen.getByText("Real-Time Kanban")).toBeInTheDocument();
});

// TODO: Add more unit tests for individual components
