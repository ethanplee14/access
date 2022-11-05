import { MarkButton, BlockButton } from "./toolbar-buttons";

export default function Toolbar() {
  return (
    <div className={"flex flex-wrap gap-1"}>
      <MarkButton format={"bold"} title={"bold"}>
        B
      </MarkButton>
      <MarkButton format={"italic"} title={"italic"}>
        I
      </MarkButton>
      <MarkButton format={"underline"} title={"underline"}>
        U
      </MarkButton>
      <div className="divider divider-horizontal m-0" />
      <BlockButton format={"h1"} title={"large header"}>
        H1
      </BlockButton>
      <BlockButton format={"h2"} title={"medium header"}>
        H2
      </BlockButton>
      <BlockButton format={"q"} title={"quote"}>
        Q
      </BlockButton>
      <div className="divider divider-horizontal m-0" />
      <BlockButton format={"ol"} title={"numbered list"}>
        OL
      </BlockButton>
      <BlockButton format={"ul"} title={"bullet list"}>
        UL
      </BlockButton>
    </div>
  );
}
