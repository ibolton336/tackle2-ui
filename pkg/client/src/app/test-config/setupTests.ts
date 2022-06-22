// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";
import { mswServer } from "./msw-server";
const OLD_ENV = process.env;
beforeAll(() => {
  process.env = { ...OLD_ENV, AUTH_REQUIRED: "false" };
  mswServer.listen();
});
afterEach(() => mswServer.resetHandlers());
afterAll(() => mswServer.close());

import "jest-enzyme";
import { configure } from "enzyme";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
configure({ adapter: new Adapter() });
