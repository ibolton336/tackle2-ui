// handlers.js

import { Identity } from "@app/api/models";
import { rest } from "msw";

const mockIdentities: Identity[] = [
  { id: 0, name: "cred Zero" },
  { id: 1, name: "cred One" },
];

const getIdentitiesPath = `http://localhost/hub/identities`;
const getProxiesPath = `http://localhost/hub/proxies`;
const getLocalesPath = "http://localhost/locales/en/translation.json";

const identitiesHandler = rest.get(getIdentitiesPath, async (req, res, ctx) =>
  res(ctx.json(mockIdentities))
);

const proxiesHandler = rest.get(getProxiesPath, async (req, res, ctx) =>
  res(ctx.json(mockIdentities))
);

const localesHandler = rest.get(getLocalesPath, async (req, res, ctx) =>
  res(ctx.json(mockIdentities))
);

export const handlers = [identitiesHandler, proxiesHandler, localesHandler];
