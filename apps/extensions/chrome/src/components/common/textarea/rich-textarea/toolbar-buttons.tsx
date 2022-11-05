import { ReactNode } from "react";
import classNames from "classnames";
import { CustomElement, CustomText } from "../../../../types/slate";
import { useSlate } from "slate-react";
import {
  isBlockActive,
  isMarkActive,
  toggleBlock,
  toggleMark,
} from "./scripts";

export interface MarkButtonProps {
  format: keyof Omit<CustomText, "text">;
  children?: ReactNode;
  title?: string;
}

export function MarkButton({ format, children, title }: MarkButtonProps) {
  const editor = useSlate();
  return (
    <ToolbarButton
      isActive={isMarkActive(editor, format)}
      onMouseDown={(e) => {
        e.preventDefault();
        toggleMark(editor, format);
      }}
      title={title}
    >
      {children}
    </ToolbarButton>
  );
}

export interface BlockButtonProps {
  format: CustomElement["type"];
  children?: ReactNode;
  title?: string;
}

export function BlockButton({ format, children, title }: BlockButtonProps) {
  const editor = useSlate();
  return (
    <ToolbarButton
      isActive={isBlockActive(editor, format)}
      onMouseDown={(e) => {
        e.preventDefault();
        toggleBlock(editor, format);
      }}
      title={title}
    >
      {children}
    </ToolbarButton>
  );
}

export interface ToolbarButtonProps {
  isActive?: boolean;
  children?: ReactNode;
  onMouseDown?: React.MouseEventHandler<HTMLButtonElement>;
  title?: string;
}

export function ToolbarButton({
  isActive,
  children,
  onMouseDown,
  title,
}: ToolbarButtonProps) {
  const btnStyle = "btn btn-xs btn-ghost btn-square";
  const btnActiveStyle = { "bg-base-300": isActive };
  return (
    <button
      className={classNames(btnStyle, btnActiveStyle)}
      onMouseDown={onMouseDown}
      title={title}
    >
      {children}
    </button>
  );
}
