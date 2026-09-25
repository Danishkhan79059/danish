export default async function sitemap() {
  const baseUrl = "https://yourportfolio.com";

  const routes = [
    "",
    "/about",
    "/experience",
    "/projects",
    "/skills",
    "/bug-hunter",
    "/coding-challenge",
    "/spinner-game",
    "/github-analyzer",
    "/tools/json-formatter",
    "/jwt-decoder",
    "/freelance",
    "/blog",
    "/contact",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency:
      route === "/tools/json-formatter" || route === "/jwt-decoder"
        ? "weekly"
        : "monthly",
    priority:
      route === ""
        ? 1.0
        : route === "/tools/json-formatter" || route === "/jwt-decoder"
        ? 0.9
        : 0.8,
  }));
}
