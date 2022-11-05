import React, { ReactNode, useEffect } from "react";
import classNames from "classnames";

export interface ModalProps {
  isOpen: boolean;
  title?: string;
  onClose?: () => void;
  children?: ReactNode;
  className?: string;
  boxClass?: string;
}

export function Modal(props: ModalProps) {
  useEffect(() => {
    if (props.isOpen) {
      window.addEventListener("keydown", escListener as any);
    }
  }, [props.isOpen]);

  return (
    <div>
      <input
        type="checkbox"
        id="my-modal-2"
        checked={props.isOpen}
        className="modal-toggle"
        onChange={() => {}}
      />
      <div
        className={classNames(`modal`, props.className)}
        onMouseDown={(e: React.MouseEvent) => {
          if (e.currentTarget === e.target) {
            props.onClose?.();
          }
        }}
      >
        <div className={classNames("modal-box", props.boxClass)}>
          {props.title && (
            <h1 className={"label-lg uppercase font-semibold mb-4"}>
              {props.title}
            </h1>
          )}
          <div className="px-4">{props.children}</div>
        </div>
      </div>
    </div>
  );

  function escListener(e: React.KeyboardEvent) {
    if (e.key == "Escape") {
      props.onClose?.();
      window.removeEventListener("keydown", escListener as any);
    }
  }
}
