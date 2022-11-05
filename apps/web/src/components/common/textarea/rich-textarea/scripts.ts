import { Editor, Element, Transforms } from "slate";
import { CustomElement, CustomText } from "../../../../types/slate";

const LIST_TYPES = ["ul", "ol"];

export function isMarkActive(
  editor: Editor,
  format: keyof Omit<CustomText, "text">
) {
  const marks = Editor.marks(editor);
  return marks ? marks[format] === true : false;
}

export function toggleMark(
  editor: Editor,
  format: keyof Omit<CustomText, "text">
) {
  if (isMarkActive(editor, format)) Editor.removeMark(editor, format);
  else Editor.addMark(editor, format, true);
}

export function isBlockActive(editor: Editor, format: CustomElement["type"]) {
  const { selection } = editor;
  if (!selection) return false;

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (n) =>
        !Editor.isEditor(n) && Element.isElement(n) && n["type"] === format,
    })
  );

  return match != undefined;
}

export function toggleBlock(editor: Editor, format: CustomElement["type"]) {
  const isActive = isBlockActive(editor, format);
  const isList = LIST_TYPES.includes(format);

  Transforms.unwrapNodes(editor, {
    match: (n) => Element.isElement(n) && LIST_TYPES.includes(n.type),
    split: true,
  });
  Transforms.setNodes(editor, {
    type: isActive ? "p" : isList ? "li" : format,
  });

  if (!isActive && isList) {
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }
}
