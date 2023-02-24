import * as cheerio from "cheerio";

export interface Metadata {
  title: string;
  description: string;
  image: string;
}

export default function fetchMetadata(
  url: string,
  timeout: number = 5000
): Promise<Metadata> {
  let urlRegex =
    /(ftp|http|https):\/\/(\w+:?\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@\-\/]))?/;
  if (!urlRegex.test(url)) {
    throw new Error("Invalid URL");
  }

  return new Promise((res, rej) => {
    if (url.endsWith(".pdf")) {
      return {
        title: "",
        description: "",
        img: "",
      };
    }
    setTimeout(() => {
      rej("we timing out");
    }, timeout);

    fetch(url)
      .then((res) => res.text())
      .then((html) => {
        const $ = cheerio.load(html);
        const title =
          $("title").text() ||
          $("meta[property='og:title']").attr("content") ||
          "";

        const description =
          $("meta[property='og:description']").attr("content") ||
          $("meta[name='Description']").attr("content") ||
          "";

        const image =
          $('meta[property="og:image"]').attr("content") ||
          $('meta[property="og:image:url"]').attr("content") ||
          "";

        res({ title, description, image });
      });
  });
}
