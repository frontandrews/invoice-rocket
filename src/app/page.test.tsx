import { render, screen } from "@testing-library/react";
import Page from "./page";
import "@testing-library/jest-dom";
import { NotificationProvider } from "./providers/NotificationProvider";
import { Provider } from "react-redux";
import { store } from "../redux/store";

jest.mock('next/navigation', () => jest.requireActual('next-router-mock'))

describe("Home", () => {
  it("Render text and links as expected", () => {

    render(
      <Provider store={store}>
        <NotificationProvider>
          <Page />
        </NotificationProvider>
      </Provider>
    );

    const heading = screen.getByRole("heading", {
      name: /simplify the way you create invoices/i,
    });

    expect(heading).toBeInTheDocument();

    const createAccountLink = screen.getByRole('link', { name: /create account/i });
    expect(createAccountLink).toBeInTheDocument();
    expect(createAccountLink).toHaveAttribute('href', 'create-account');

    const signInLink = screen.getByRole('link', { name: /sign in/i });
    expect(signInLink).toBeInTheDocument();
    expect(signInLink).toHaveAttribute('href', 'login');
  });
});
