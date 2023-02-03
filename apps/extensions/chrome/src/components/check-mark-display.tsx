import { CheckBadgeIcon } from "@heroicons/react/24/outline";

export interface CheckMarkDisplayProps {
  name: string;
}

export default function CheckMarkDisplay(props: CheckMarkDisplayProps) {
  return (
    <div className="text-center">
      <div>Resource {props.name} saved successfully!</div>;
      <div>
        <CheckBadgeIcon />
      </div>
    </div>
  );
}
