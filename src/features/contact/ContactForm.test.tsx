import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expectNoAxeViolations } from "@/test/axe";
import { renderWithIntl } from "@/test/render";
import { sendContactMessage } from "./actions";
import { ContactForm } from "./ContactForm";
import type { SubmitResult } from "./submit";

vi.mock("./actions", () => ({ sendContactMessage: vi.fn() }));
const send = vi.mocked(sendContactMessage);

const field = {
  name: () => screen.getByRole("textbox", { name: "Nombre" }),
  email: () => screen.getByRole("textbox", { name: "Email" }),
  company: () => screen.getByRole("textbox", { name: /Empresa/ }),
  subject: () => screen.getByRole("textbox", { name: "Asunto" }),
  message: () => screen.getByRole("textbox", { name: "Mensaje" }),
};
const submitButton = () => screen.getByRole("button", { name: /Enviar mensaje|Enviando/ });

async function fillValid(user: ReturnType<typeof userEvent.setup>) {
  await user.type(field.name(), "  María   José  ");
  await user.type(field.email(), "maria@example.com");
  await user.type(field.subject(), "Posición frontend");
  await user.type(field.message(), "Hola Luciano, me gustaría conversar.");
}

// Motion applies the final state of an enter animation on the next frame.
async function expectVisible(element: Promise<HTMLElement> | HTMLElement) {
  const node = await element;
  await waitFor(() => expect(node).toBeVisible());
}

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((r) => (resolve = r));
  return { promise, resolve };
}

// Block body on purpose: mockReset() returns the mock, and a function returned from beforeEach
// is run by Vitest as a teardown, which would call the mocked action after every test.
beforeEach(() => {
  send.mockReset();
});

describe("ContactForm", () => {
  it("shows every error on submit, focuses the first invalid field and doesn't send", async () => {
    const user = userEvent.setup();
    renderWithIntl(<ContactForm />);

    await user.click(submitButton());

    expect(await screen.findAllByText("Este campo es obligatorio.")).toHaveLength(4);
    expect(field.name()).toHaveFocus();
    expect(screen.getByText("Revisá los campos marcados.")).toBeInTheDocument();
    expect(send).not.toHaveBeenCalled();
  });

  it("waits for blur before validating, then revalidates on every change", async () => {
    const user = userEvent.setup();
    renderWithIntl(<ContactForm />);

    await user.type(field.name(), "A");
    expect(screen.queryByText(/al menos 2 caracteres/)).not.toBeInTheDocument();

    await user.tab();
    await expectVisible(screen.findByText("El nombre debe tener al menos 2 caracteres."));

    await user.type(field.name(), "na");
    await waitFor(() =>
      expect(screen.queryByText(/al menos 2 caracteres/)).not.toBeInTheDocument(),
    );
  });

  it("ties errors to their input with aria-invalid and aria-describedby", async () => {
    const user = userEvent.setup();
    renderWithIntl(<ContactForm />);

    await user.type(field.email(), "maria@");
    await user.tab();

    const error = await screen.findByText(/Ingresá un email válido/);
    expect(field.email()).toHaveAttribute("aria-invalid", "true");
    expect(field.email()).toHaveAttribute("aria-describedby", error.id);
    expect(field.email()).toHaveAccessibleDescription(error.textContent!);
  });

  it("rejects a name with digits using a translated message", async () => {
    const user = userEvent.setup();
    renderWithIntl(<ContactForm />, { locale: "en" });

    await user.type(screen.getByRole("textbox", { name: "Name" }), "R2D2");
    await user.tab();

    await expectVisible(screen.findByText("Use only letters, spaces, apostrophes and hyphens."));
  });

  it("counts message characters live and flags the limit", async () => {
    const user = userEvent.setup();
    renderWithIntl(<ContactForm />);

    expect(screen.getByText("0 / 1000")).toHaveAttribute("data-state", "ok");

    await user.click(field.message());
    await user.paste("a".repeat(950));
    expect(screen.getByText("950 / 1000")).toHaveAttribute("data-state", "warning");

    await user.paste("a".repeat(51));
    expect(screen.getByText("1001 / 1000")).toHaveAttribute("data-state", "over");
    await user.tab();
    await expectVisible(screen.findByText("El mensaje puede tener hasta 1000 caracteres."));
  });

  it("disables the button while sending, then confirms and focuses the success message", async () => {
    const user = userEvent.setup();
    const response = deferred<SubmitResult>();
    send.mockReturnValue(response.promise);
    renderWithIntl(<ContactForm />);

    await fillValid(user);
    await user.click(submitButton());

    const button = await screen.findByRole("button", { name: "Enviando…" });
    expect(button).toBeDisabled();
    expect(screen.getByRole("form", { name: "Formulario de contacto" })).toHaveAttribute(
      "aria-busy",
      "true",
    );

    response.resolve({ status: "success" });

    const heading = await screen.findByRole("heading", { name: "¡Mensaje enviado!" });
    await waitFor(() => expect(heading).toHaveFocus());

    // The client sends normalized values plus the anti-spam fields.
    expect(send).toHaveBeenCalledWith({
      name: "María José",
      email: "maria@example.com",
      subject: "Posición frontend",
      message: "Hola Luciano, me gustaría conversar.",
      website: "",
      startedAt: expect.any(Number),
    });

    await user.click(screen.getByRole("button", { name: "Enviar otro mensaje" }));
    expect(await screen.findByRole("textbox", { name: "Nombre" })).toHaveValue("");
  });

  it("shows server-side field errors on the right field", async () => {
    const user = userEvent.setup();
    send.mockResolvedValue({
      status: "error",
      code: "invalid",
      fieldErrors: { email: "emailInvalid" },
    });
    renderWithIntl(<ContactForm />);

    await fillValid(user);
    await user.click(submitButton());

    await expectVisible(screen.findByText(/Ingresá un email válido/));
    expect(field.email()).toHaveFocus();
  });

  it("explains rate limiting", async () => {
    const user = userEvent.setup();
    send.mockResolvedValue({ status: "error", code: "rateLimited" });
    renderWithIntl(<ContactForm />);

    await fillValid(user);
    await user.click(submitButton());

    await expectVisible(screen.findByText(/Esperá unos minutos/));
    expect(submitButton()).toBeEnabled();
  });

  it("offers the email address when the request fails", async () => {
    const user = userEvent.setup();
    send.mockRejectedValue(new Error("network"));
    renderWithIntl(<ContactForm />);

    await fillValid(user);
    await user.click(submitButton());

    await expectVisible(screen.findByText(/escribime a lrossi0798@gmail\.com/));
  });

  it("keeps the honeypot out of the tab order and the accessibility tree", async () => {
    const user = userEvent.setup();
    renderWithIntl(<ContactForm />);

    expect(screen.queryByRole("textbox", { name: "No completes este campo" })).toBeNull();

    await user.click(field.message());
    await user.tab();
    expect(submitButton()).toHaveFocus();
  });

  it("has no axe violations with errors showing", async () => {
    const user = userEvent.setup();
    const { container } = renderWithIntl(<ContactForm />);

    await user.click(submitButton());
    await screen.findAllByText("Este campo es obligatorio.");

    await expectNoAxeViolations(container);
  });
});
