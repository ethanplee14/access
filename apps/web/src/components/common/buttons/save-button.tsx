import { CheckCircleIcon } from "@heroicons/react/24/outline";
import AsyncButton, { AsyncButtonProps } from "./async-button";
import classNames from "classnames";

export interface SaveButtonProps extends AsyncButtonProps {
  label?: string;
}

export default function SaveButton(props: SaveButtonProps) {
  return (
    <AsyncButton
      type={"submit"}
      loading={props.loading}
      className={classNames("btn btn-sm w-full mt-2 gap-2", props.className)}
      onClick={props.onClick}
    >
      <CheckCircleIcon className={"w-5 h-5"} /> {props.label || "Save"}
    </AsyncButton>
  );
}
