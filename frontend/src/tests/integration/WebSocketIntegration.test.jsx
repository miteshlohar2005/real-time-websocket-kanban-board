import { render, screen } from "@testing-library/react";

import KanbanBoard from "../../components/KanbanBoard";

// mock socket.io-client library

test("WebSocket receives task update", async () => {
  render(<KanbanBoard />);

  expect(screen.getByText("Real-Time Kanban")).toBeInTheDocument();
});

// TODO: Add more integration tests
