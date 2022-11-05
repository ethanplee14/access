import * as cheerio from "cheerio";

export interface Metadata {
  title: string;
  description: string;
  image: string;
}

export default async function fetchMetadata(url: string): Promise<Metadata> {
  let urlRegex =
    /(ftp|http|https):\/\/(\w+:?\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@\-\/]))?/;
  if (!urlRegex.test(url)) {
    throw new Error("Invalid URL");
  }

  const response = await fetch(url);
  const html = await response.text();
  const $ = cheerio.load(html);
  const title =
    $("title").text() || $("meta[property='og:title']").attr("content") || "";

  const description =
    $("meta[property='og:description']").attr("content") ||
    $("meta[name='Description']").attr("content") ||
    "";

  const image =
    $('meta[property="og:image"]').attr("content") ||
    $('meta[property="og:image:url"]').attr("content") ||
    "";

  return { title, description, image };
}
