import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PriorityBadge, StatusBadge } from "../Badge";

describe("StatusBadge", () => {
  it("renders a human-readable label for multi-word statuses", () => {
    render(<StatusBadge status="IN_PROGRESS" />);
    expect(screen.getByText("IN PROGRESS")).toBeInTheDocument();
  });

  it("renders single-word statuses unchanged", () => {
    render(<StatusBadge status="DONE" />);
    expect(screen.getByText("DONE")).toBeInTheDocument();
  });
});

describe("PriorityBadge", () => {
  it.each(["LOW", "MEDIUM", "HIGH", "URGENT"] as const)("renders the %s priority label", (priority) => {
    render(<PriorityBadge priority={priority} />);
    expect(screen.getByText(priority)).toBeInTheDocument();
  });
});
