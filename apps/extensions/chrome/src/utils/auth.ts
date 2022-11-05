import configs from "../../configs.json";

export async function checkLoggedIn() {
  const nextAuthSessionURL = configs.ACCESS_URL + "/api/auth/session";
  const tokenName = nextAuthSessionURL.startsWith("http")
    ? "next-auth.session-token"
    : "__Secure-next-auth.session-token";
  const cookie = await chrome.cookies.get({
    url: nextAuthSessionURL,
    name: tokenName,
  });
  return cookie != null;
}
