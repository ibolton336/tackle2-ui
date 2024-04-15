import React from "react";
import {
  render,
  waitFor,
  screen,
  fireEvent,
} from "@app/test-config/test-utils";

import { BUSINESS_SERVICES } from "@app/api/rest";
import mock from "@app/test-config/mockInstance";
import userEvent from "@testing-library/user-event";

import "@testing-library/jest-dom/extend-expect";
import "@testing-library/jest-dom";
import { BusinessService } from "@app/api/models";
import { ApplicationFormModal } from "../application-form-modal";

describe("Component: application-form", () => {
  const mockChangeValue = jest.fn();

  it("Validation tests", async () => {
    const businessServices: BusinessService[] = [{ id: 1, name: "service" }];

    mock
      .onGet(`${BUSINESS_SERVICES}`)
      .reply(200, businessServices)
      .onAny()
      .reply(200, []);

    render(
      <ApplicationFormModal application={null} onClose={mockChangeValue} />
    );
    const nameInput = await screen.findByLabelText("Name *");
    fireEvent.change(nameInput, {
      target: { value: "app-name" },
    });
    await waitFor(
      () => {
        fireEvent.click(
          screen.getByRole("button", {
            name: /Business service select dropdown toggle/i,
          })
        );
      },
      {
        timeout: 3000,
      }
    );

    await userEvent.selectOptions(screen.getByRole("listbox"), ["service"]);

    const sourceCodeButton = screen.getByRole("button", {
      name: "terms.sourceCode",
    });

    await waitFor(
      () => {
        fireEvent.click(sourceCodeButton);
      },
      {
        timeout: 3000,
      }
    );

    const branchInput = screen.getByRole("textbox", {
      name: "Repository branch",
    });

    await waitFor(
      () => {
        fireEvent.change(branchInput, {
          target: { value: "branch-test" },
        });
      },
      {
        timeout: 3000,
      }
    );

    const createButton = screen.getByRole("button", { name: /submit/i });

    expect(createButton).not.toBeEnabled();

    const rootInput = screen.getByRole("textbox", {
      name: "terms.sourceRootPath",
    });

    await waitFor(
      () => {
        fireEvent.change(rootInput, {
          target: { value: "path-test" },
        });
      },
      {
        timeout: 3000,
      }
    );

    expect(createButton).not.toBeEnabled();
    const urlInput = screen.getByRole("textbox", {
      name: "terms.sourceRepo",
    });
    const testURL = "https://github.com/username/tackle-testapp.git";

    await waitFor(
      () => {
        fireEvent.change(urlInput, {
          target: { value: testURL },
        });
      },
      {
        timeout: 3000,
      }
    );

    expect(createButton).toBeEnabled();
  }, 10000);
});
