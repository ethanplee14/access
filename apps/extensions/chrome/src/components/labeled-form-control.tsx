import { ReactNode } from "react";
import classNames from "classnames";

export interface LabeledFormControlProps {
  label: string;
  subLabel?: string;
  children?: ReactNode;
  className?: string;
}

export function LabeledFormControl(props: LabeledFormControlProps) {
  const containerClassNames = classNames("form-control", props.className);

  return (
    <div className={containerClassNames}>
      <label className="label font-semibold pt-0">
        <span className="label-text">
          {props.label}
          {props.subLabel && (
            <span className={"text-xs text-gray-500"}> {props.subLabel}</span>
          )}
        </span>
      </label>
      {props.children}
    </div>
  );
}
