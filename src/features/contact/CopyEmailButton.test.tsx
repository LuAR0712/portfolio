import { act, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithIntl } from "@/test/render";
import { CopyEmailButton } from "./CopyEmailButton";

describe("CopyEmailButton", () => {
  it("copies the email and confirms it", async () => {
    const user = userEvent.setup(); // provides a working navigator.clipboard stub
    renderWithIntl(<CopyEmailButton email="lrossi0798@gmail.com" />);

    await user.click(screen.getByRole("button", { name: "Copiar el email al portapapeles" }));

    expect(await navigator.clipboard.readText()).toBe("lrossi0798@gmail.com");
    expect(screen.getByText("¡Copiado!")).toBeInTheDocument();
  });

  it("goes back to its idle label after a moment", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    renderWithIntl(<CopyEmailButton email="a@b.co" />);

    await user.click(screen.getByRole("button"));
    expect(screen.getByText("¡Copiado!")).toBeInTheDocument();

    await act(() => vi.advanceTimersByTimeAsync(2100));
    expect(screen.getByText("Copiar")).toBeInTheDocument();
    vi.useRealTimers();
  });
});
