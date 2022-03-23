export default {
  devRoutes: {
    route: "/",
    roles: ["tackle-admin", "tackle-architect", "tackle-migrator"],
  },
  adminRoutes: {
    route: "/",
    roles: ["tackle-admin"],
  },
  readScopes: [
    "addons:get",
    "applications:get",
    "businessservices:get",
    "dependencies:get",
    "identities:get",
    "imports:get",
    "jobFunctions:get",
    "proxies:get",
    "reviews:get",
    "settings:get",
    "stakeholdergroups:get",
    "stakeholders:get",
    "tags:get",
    "tagtypes:get",
    "tasks:get",
  ],
  writeScopes: [
    "addons:post",
    "addons:put",
    "addons:delete",
    "applications:put",
    "applications:post",
    "applications:delete",
    "businessservices:put",
    "businessservices:post",
    "businessservices:delete",
    "dependencies:put",
    "dependencies:post",
    "dependencies:delete",
    "identities:put",
    "identities:post",
    "identities:delete",
    "imports:put",
    "imports:post",
    "imports:delete",
    "jobfunctions:put",
    "jobfunctions:post",
    "jobFunctions:delete",
    "proxies:put",
    "proxies:post",
    "proxies:delete",
    "reviews:put",
    "reviews:post",
    "reviews:delete",
    "settings:put",
    "settings:post",
    "settings:delete",
    "stakeholdergroups:put",
    "stakeholdergroups:post",
    "stakeholdergroups:delete",
    "stakeholders:put",
    "stakeholders:post",
    "stakeholders:delete",
    "tags:put",
    "tags:post",
    "tags:delete",
    "tagtypes:put",
    "tagtypes:post",
    "tagtypes:delete",
  ],
  taskWriteScopes: ["tasks:put", "tasks:post", "tasks:delete"],
};
