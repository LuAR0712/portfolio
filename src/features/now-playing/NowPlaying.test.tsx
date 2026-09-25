import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expectNoAxeViolations } from "@/test/axe";
import { renderWithIntl } from "@/test/render";
import type { NowPlaying as Track } from "./lastfm";
import { NowPlaying } from "./NowPlaying";

const playing: Track = {
  status: "playing",
  title: "De música ligera",
  artist: "Soda Stereo",
  url: "https://www.last.fm/music/Soda+Stereo/_/De+m%C3%BAsica+ligera",
  image: "https://lastfm.freetls.fastly.net/i/u/174s/abc.png",
};

function mockApi(body: Track | null, ok = true) {
  vi.spyOn(globalThis, "fetch").mockImplementation(
    async () => new Response(JSON.stringify(body), { status: ok ? 200 : 502 }),
  );
}

function mockReducedMotion() {
  const original = window.matchMedia;
  vi.spyOn(window, "matchMedia").mockImplementation((query) => ({
    ...original(query),
    matches: query.includes("prefers-reduced-motion"),
  }));
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("NowPlaying", () => {
  it("shows the track playing now, linked to Last.fm", async () => {
    mockApi(playing);
    renderWithIntl(<NowPlaying />);

    const player = await screen.findByRole("region", {
      name: "Reproductor: lo que estoy escuchando",
    });
    expect(player).toHaveTextContent("Escuchando ahora");
    expect(player).toHaveTextContent("Soda Stereo");
    const link = screen.getByRole("link", { name: /De música ligera/ });
    expect(link).toHaveAttribute("href", playing.url);
    expect(link).toHaveAttribute("target", "_blank");
  });

  it("lets visitors pause the looping animation", async () => {
    const user = userEvent.setup();
    mockApi(playing);
    const { container } = renderWithIntl(<NowPlaying />);

    const toggle = await screen.findByRole("button", { name: "Animación del reproductor" });
    expect(toggle).toHaveAttribute("aria-pressed", "true");

    await user.click(toggle);

    expect(toggle).toHaveAttribute("aria-pressed", "false");
    expect(container.querySelector(".animate-scan")).toHaveClass("[animation-play-state:paused]");
  });

  it("starts paused when reduced motion is requested", async () => {
    mockReducedMotion();
    mockApi(playing);
    renderWithIntl(<NowPlaying />);

    expect(
      await screen.findByRole("button", { name: "Animación del reproductor" }),
    ).toHaveAttribute("aria-pressed", "false");
  });

  it("shows how long ago the last track played, without a pause control", async () => {
    const minutesAgo = Date.now() - 12 * 60_000;
    mockApi({ ...playing, status: "recent", image: null, playedAt: minutesAgo });
    renderWithIntl(<NowPlaying />, { locale: "en" });

    expect(await screen.findByText("Last played")).toBeInTheDocument();
    expect(screen.getByText("12 minutes ago")).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("renders nothing when Last.fm isn't configured or fails", async () => {
    mockApi(null, false);
    const { container } = renderWithIntl(<NowPlaying />);
    await new Promise((resolve) => setTimeout(resolve, 20));
    expect(container).toBeEmptyDOMElement();
  });

  it("has no axe violations", async () => {
    mockApi(playing);
    const { container } = renderWithIntl(<NowPlaying />);
    await screen.findByText("Escuchando ahora");
    await expectNoAxeViolations(container);
  });
});
