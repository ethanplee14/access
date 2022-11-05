import React, { ReactNode } from "react";
import classNames from "classnames";
import { Point } from "../../types/geometry";

export interface ContextMenuProps {
  position?: Point;
  onClose?: () => void;
  children?: ReactNode;
}

export default function ContextMenu(props: ContextMenuProps) {
  const ref = React.createRef<HTMLUListElement>();

  if (props.position) registerCloseListener();

  return (
    <ul
      ref={ref}
      style={{
        top: `${props.position?.y ?? 0}px`,
        left: `${props.position?.x ?? 0}px`,
      }}
      className={classNames(
        "fixed menu menu-compact rounded drop-shadow bg-base-200",
        { hidden: props.position == undefined }
      )}
    >
      {props.children}
    </ul>
  );

  function registerCloseListener() {
    window.addEventListener(
      "mousedown",
      function closeSubjectMenu(e: MouseEvent) {
        if (ref.current && !ref.current.contains(e.target as Node)) {
          props.onClose?.();
          window.removeEventListener("mousedown", closeSubjectMenu);
        }
      }
    );
  }
}
