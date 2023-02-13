import fetchMetadata from "./src/server/scripts/meta-fetcher";

(async () => {
  console.log("Fetching meta data");
  try {
    const data = await fetchMetadata(
      "https://medium.com/swlh/k-nearest-neighbor-ca2593d7a3c4"
    );
    console.log("Fetch succeeded");
    console.log(data);
  } catch (e) {
    console.log("Error: " + e);
  }
})();
