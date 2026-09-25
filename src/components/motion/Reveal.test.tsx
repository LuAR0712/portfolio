import { render, screen } from "@testing-library/react";
import { Reveal } from "./Reveal";
import { Stagger } from "./Stagger";
import { StaggerItem } from "./StaggerItem";

describe("reveal wrappers", () => {
  it("render the requested element without adding wrapper nodes", () => {
    render(
      <Stagger as="ul" aria-label="list">
        <StaggerItem as="li">one</StaggerItem>
      </Stagger>,
    );

    const list = screen.getByRole("list", { name: "list" });
    expect(list.tagName).toBe("UL");
    expect(list.firstElementChild?.tagName).toBe("LI");
  });

  it("mark animated nodes for the no-JavaScript fallback", () => {
    render(<Reveal as="p">text</Reveal>);
    expect(screen.getByText("text")).toHaveAttribute("data-reveal");
  });
});
