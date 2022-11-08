import configs from "../../configs.json";

export async function checkLoggedIn() {
  const nextAuthURL = configs.ACCESS_URL;
  const tokenName = nextAuthURL.startsWith("https")
    ? "__Secure-next-auth.session-token"
    : "next-auth.session-token";
  const cookie = await chrome.cookies.get({
    url: nextAuthURL,
    name: tokenName,
  });
  return cookie != null;
}
