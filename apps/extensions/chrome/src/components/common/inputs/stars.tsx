import { ReactNode } from "react";
import classNames from "classnames";
import StarIcon from "@heroicons/react/24/outline/StarIcon";

export interface StarsProps {
  value?: number;
}

export default function Stars(props: StarsProps) {
  return <div className="flex">{buildStars()}</div>;

  function buildStars(): ReactNode {
    const stars: ReactNode[] = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <StarIcon
          key={"starview-" + i}
          className={classNames("w-4 h-4", {
            "fill-base-content": i <= (props.value ?? 0),
          })}
        />
      );
    }
    return stars;
  }
}
