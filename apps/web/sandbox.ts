import fetchMetadata from "./src/server/scripts/meta-fetcher";

(async () => {
  console.log("Fetching meta data");
  try {
    const data = await fetchMetadata(
      "https://visitas.ru/howtodo/Steve_Schoger_Adam_Wathan_Refactoring_UI.pdf"
    );
    console.log("Fetch succeeded");
  } catch (e) {
    console.log("Error: " + e);
  }
})();
