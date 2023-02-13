import { LinkIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Point } from "../../types/geometry";
import ContextMenu from "../common/context-menu";

export interface SubjectMenuProps {
  position?: Point;
  onConnect?: () => void;
  onDelete?: () => void;
}

export default function SubjectMenu(props: SubjectMenuProps) {
  return (
    <ContextMenu position={props.position}>
      <li>
        <a
          className={"rounded"}
          onClick={(_) => {
            props.onConnect?.();
            // setTargetNode(ctxNode.current);
            // setContextMenuPos(undefined);
            // ctxNode.current = "";
          }}
        >
          <LinkIcon className={"w-5"} />
          Connect
        </a>
      </li>
      <li>
        <a className={"rounded hover:bg-error"} onClick={(_) => {}}>
          <TrashIcon className={"w-5"} />
          Delete
        </a>
      </li>
    </ContextMenu>
  );
}
