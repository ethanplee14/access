import { ReactNode } from "react";
import classNames from "classnames";

export type AsyncButtonProps = {
  type?: "button" | "submit" | "reset";
  className?: string;
  loading?: boolean;
  children?: ReactNode;
  onClick?: React.MouseEventHandler;
};

export default function AsyncButton(props: AsyncButtonProps) {
  /**
   * TODO:
   *  Should really allow for onclick to take a promise and handle loading state through that instead of a
   *  passed in response.
   */
  return (
    <button
      type={props.type}
      className={classNames("btn", { loading: props.loading }, props.className)}
      onClick={props.onClick}
    >
      {!props.loading && props.children}
    </button>
  );
}
