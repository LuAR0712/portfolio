import { screen } from "@testing-library/react";
import { expectNoAxeViolations } from "@/test/axe";
import { renderWithIntl } from "@/test/render";
import { NowPlaying } from "./NowPlaying";
import type { NowPlaying as Track } from "./spotify";

const playing: Track = {
  status: "playing",
  title: "De música ligera",
  artists: "Soda Stereo",
  url: "https://open.spotify.com/track/1",
  image: { url: "https://i.scdn.co/image/64", width: 64, height: 64 },
};

function mockApi(body: Track | null, ok = true) {
  vi.spyOn(globalThis, "fetch").mockImplementation(
    async () => new Response(JSON.stringify(body), { status: ok ? 200 : 502 }),
  );
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("NowPlaying", () => {
  it("shows what is playing, linked to Spotify", async () => {
    mockApi(playing);
    renderWithIntl(<NowPlaying />);

    expect(await screen.findByText("Escuchando ahora")).toBeInTheDocument();
    const link = screen.getByRole("link", { name: /De música ligera de Soda Stereo/ });
    expect(link).toHaveAttribute("href", "https://open.spotify.com/track/1");
    expect(link).toHaveAttribute("target", "_blank");
  });

  it("labels a past track as the last one played", async () => {
    mockApi({ ...playing, status: "recent" });
    renderWithIntl(<NowPlaying />, { locale: "en" });
    expect(await screen.findByText("Last played")).toBeInTheDocument();
  });

  it("renders nothing when Spotify isn't configured or fails", async () => {
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
