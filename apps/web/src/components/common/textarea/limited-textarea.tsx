import { ChangeEvent, ChangeEventHandler } from "react";
import classNames from "classnames";

export interface LimitedTextareaProps {
  limit?: number;
  rows?: number;
  className?: string;
  placeholder?: string;
  value?: string;
  onChange?: ChangeEventHandler<HTMLTextAreaElement>;
}

export function LimitedTextarea(props: LimitedTextareaProps) {
  return (
    <>
      <textarea
        className={classNames("textarea leading-5 w-full", props.className)}
        rows={props.rows ?? 6}
        placeholder={props.placeholder}
        value={props.value}
        onChange={changeHandler}
      />
      <label className="label pt-1 pb-0">
        {/*this is here because when putting alt text it starts bottom left corner 1st then bottom right 2nd*/}
        <span className="label-text-alt" />
        <span className="label-text-alt">
          {props.value?.length ?? 0}/{props.limit}
        </span>
      </label>
    </>
  );

  function changeHandler(e: ChangeEvent<HTMLTextAreaElement>) {
    const text = e.target.value;

    if (text.length <= (props.limit ?? 0)) props.onChange?.(e);
  }
}
