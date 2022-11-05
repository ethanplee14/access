import { useCallback, useMemo } from "react";
import {
  Editable,
  RenderElementProps,
  RenderLeafProps,
  Slate,
  withReact,
} from "slate-react";
import { withHistory } from "slate-history";
import { createEditor, Descendant, Node } from "slate";
import isHotkey from "is-hotkey";
import Toolbar from "./toolbar";
import { CustomText } from "../../../../types/slate";
import { toggleMark } from "./scripts";
import classNames from "classnames";

const HOTKEYS = {
  "mod+b": "bold",
  "mod+i": "italic",
  "mod+u": "underline",
} as Record<string, keyof Omit<CustomText, "text">>;

export interface RichTextareaProps {
  initialValue?: Descendant[];
  onChange?: (val: Descendant[]) => void;
  readonly?: boolean;
  className?: string;
}

export default function RichTextarea({
  initialValue,
  onChange,
  readonly,
  className,
}: RichTextareaProps) {
  const editor = useMemo(() => withReact(withHistory(createEditor())), []);
  initialValue = initialValue ?? [
    {
      type: "p",
      children: [{ text: "Resource review here." }],
    },
  ];

  const renderElementCbk = useCallback(renderElement, []);
  const renderLeafCbk = useCallback(renderLeaf, []);

  return (
    <Slate
      editor={editor}
      value={initialValue}
      onChange={(val) => {
        const isNotSelectionOp = editor.operations.some(
          (op) => "set_selection" !== op.type
        );
        if (isNotSelectionOp) {
          onChange?.(val);
        }
      }}
    >
      <div
        className={classNames(
          "border border-gray-300 p-2 rounded-lg w-full",
          className
        )}
      >
        {!readonly && <Toolbar />}
        <div className="divider mt-0" />
        <Editable
          id={"Test"}
          readOnly={readonly}
          className={"px-4 pb-4"}
          renderElement={renderElementCbk}
          renderLeaf={renderLeafCbk}
          onKeyDown={(e) => {
            if (!e.ctrlKey) return;
            for (const hotkey in HOTKEYS) {
              if (isHotkey(hotkey, e)) {
                e.preventDefault();
                const mark = HOTKEYS[hotkey as keyof typeof HOTKEYS];
                toggleMark(editor, mark!);
              }
            }
          }}
        />
      </div>
    </Slate>
  );

  function renderElement({
    attributes,
    children,
    element,
  }: RenderElementProps) {
    switch (element.type) {
      case "h1":
        return (
          <h1 {...attributes} className={"text-2xl"}>
            {children}
          </h1>
        );
      case "h2":
        return (
          <h2 {...attributes} className={"text-xl"}>
            {children}
          </h2>
        );
      case "q":
        return (
          <blockquote
            {...attributes}
            className={"text-gray-400 italic border-l-2 border-gray-300 pl-4"}
          >
            {children}
          </blockquote>
        );
      case "ol":
        return (
          <ol {...attributes} className={"list-decimal ml-6"}>
            {children}
          </ol>
        );
      case "ul":
        return (
          <ul {...attributes} className={"list-disc ml-6"}>
            {children}
          </ul>
        );
      case "li":
        return <li {...attributes}>{children}</li>;
      default:
        return <p {...attributes}>{children}</p>;
    }
  }

  function renderLeaf({ attributes, children, leaf }: RenderLeafProps) {
    if (leaf.bold) {
      children = <strong>{children}</strong>;
    }
    if (leaf.italic) {
      children = <em>{children}</em>;
    }
    if (leaf.underline) {
      children = <u>{children}</u>;
    }
    return <span {...attributes}>{children}</span>;
  }
}
