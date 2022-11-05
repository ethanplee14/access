import { BaseEditor } from "slate";
import { ReactEditor } from "slate-react";
import { HistoryEditor } from "slate-history";

type CustomElement = {
  type: "p" | "h1" | "h2" | "q" | "ol" | "ul" | "li";
  children: CustomText[];
};

type CustomText = {
  text: string;
  bold?: true;
  italic?: true;
  underline?: true;
};

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor & HistoryEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}
