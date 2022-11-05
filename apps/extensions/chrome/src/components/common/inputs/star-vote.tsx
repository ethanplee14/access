import { ReactNode, useState } from "react";
import classNames from "classnames";
import { roundRange } from "../../../utils/math";
import { StarIcon } from "@heroicons/react/24/outline";

export interface StarVoteProps {
  value?: number;
  onChange?: (value: number) => void;
}

export default function StarVote(props: StarVoteProps) {
  const starValue = roundRange(props.value ?? 0, [0, 5]);
  const [score, setScore] = useState(0);

  return <div className="flex">{buildStars()}</div>;

  function buildStars(): ReactNode {
    const stars: ReactNode[] = [];
    for (let i = 1; i <= 5; i++) {
      const shouldFill = !score && starValue ? starValue >= i : score >= i;
      const starStyle = classNames("w-4 h-4 cursor-pointer", {
        "fill-base-content": shouldFill,
      });
      stars.push(
        <StarIcon
          key={"star-" + i}
          className={starStyle}
          onMouseEnter={(_) => setScore(i)}
          onMouseLeave={(_) => setScore(0)}
          onClick={(_) => props.onChange?.(i)}
        />
      );
    }
    return stars;
  }
}
