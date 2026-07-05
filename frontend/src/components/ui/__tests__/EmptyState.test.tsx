import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { EmptyState } from "../EmptyState";

describe("EmptyState", () => {
  it("renders title and description", () => {
    render(<EmptyState title="No projects" description="Create one to get started" />);
    expect(screen.getByText("No projects")).toBeInTheDocument();
    expect(screen.getByText("Create one to get started")).toBeInTheDocument();
  });

  it("renders an action when provided", () => {
    const onClick = vi.fn();
    render(<EmptyState title="No projects" action={<button onClick={onClick}>Create</button>} />);
    screen.getByText("Create").click();
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
