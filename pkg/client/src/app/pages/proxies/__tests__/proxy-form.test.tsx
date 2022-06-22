import React from "react";
import "@testing-library/jest-dom";
import {
  render,
  waitFor,
  screen,
  waitForElementToBeRemoved,
  act,
} from "@app/test-config/test-utils";

import { Proxies } from "../proxies";
import { ProxyForm } from "../proxy-form";
import { mswServer } from "@app/test-config/msw-server";
import { getByAltText } from "@testing-library/react";
import { useTranslation } from "react-i18next";

jest.mock("react-i18next");
/* Your test code using useTranslation */

describe("Component: proxy-form", () => {
  it("Display switch statements on initial load", async () => {
    render(<Proxies />);
    await waitFor(() => screen.getByTestId("http-proxy-switch"), {
      timeout: 3000,
    });

    await waitFor(() => screen.getByTestId("https-proxy-switch"), {
      timeout: 3000,
    });
  });
});
