import { screen, waitFor } from "@testing-library/react";
import { expectNoAxeViolations } from "@/test/axe";
import { renderWithIntl } from "@/test/render";
import type { LocalWeather } from "./open-meteo";

const weather: LocalWeather = {
  temperature: 19.7,
  weatherCode: 0,
  isDay: true,
  sunrise: "06:37",
  sunset: "18:53",
};

// The stores are module-level singletons: import fresh modules per test.
async function load() {
  vi.resetModules();
  const { BuenosAiresNow } = await import("./BuenosAiresNow");
  const { DayPhaseAmbient } = await import("./DayPhaseAmbient");
  return { BuenosAiresNow, DayPhaseAmbient };
}

function mockApi(body: LocalWeather | null, ok = true) {
  vi.spyOn(globalThis, "fetch").mockImplementation(
    async () => new Response(JSON.stringify(body), { status: ok ? 200 : 502 }),
  );
}

beforeEach(() => {
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(new Date("2026-09-26T18:45:00Z")); // 15:45 in Buenos Aires
  vi.spyOn(Date.prototype, "getTimezoneOffset").mockReturnValue(-120); // visitor in Madrid
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
  delete document.documentElement.dataset.baPhase;
});

describe("BuenosAiresNow", () => {
  it("shows the local time, weather and the visitor's time difference", async () => {
    mockApi(weather);
    const { BuenosAiresNow } = await load();
    renderWithIntl(<BuenosAiresNow />);

    const card = screen.getByRole("group", { name: "Buenos Aires ahora" });
    await waitFor(() => expect(card).toHaveTextContent("15:45"));
    await waitFor(() => expect(card).toHaveTextContent("Despejado"));
    expect(card).toHaveTextContent("20 °C");
    expect(card).toHaveTextContent("Vas 5 h adelante");
  });

  it("still shows time and difference when the weather is unavailable", async () => {
    mockApi(null, false);
    const { BuenosAiresNow } = await load();
    renderWithIntl(<BuenosAiresNow />, { locale: "en" });

    const card = screen.getByRole("group", { name: "Buenos Aires now" });
    await waitFor(() => expect(card).toHaveTextContent("You are 5 h ahead"));
    expect(card).not.toHaveTextContent("°C");
  });

  it("has no axe violations", async () => {
    mockApi(weather);
    const { BuenosAiresNow } = await load();
    const { container } = renderWithIntl(<BuenosAiresNow />);
    await screen.findByText(/Despejado/);
    await expectNoAxeViolations(container);
  });
});

describe("DayPhaseAmbient", () => {
  it("marks the day phase in Buenos Aires on <html>", async () => {
    mockApi(weather);
    const { DayPhaseAmbient } = await load();
    renderWithIntl(<DayPhaseAmbient />);

    await waitFor(() => expect(document.documentElement.dataset.baPhase).toBe("day"));
  });

  it("leaves the default look without weather data", async () => {
    mockApi(null, false);
    const { DayPhaseAmbient } = await load();
    renderWithIntl(<DayPhaseAmbient />);

    await new Promise((resolve) => setTimeout(resolve, 20));
    expect(document.documentElement.dataset.baPhase).toBeUndefined();
  });
});
