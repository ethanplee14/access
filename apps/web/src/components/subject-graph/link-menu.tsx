import { LinkObject, NodeObject } from "react-force-graph-2d";
import { Point } from "../../types/geometry";
import { trpc } from "../../utils/trpc";
import ContextMenu from "../common/context-menu";

export interface LinkMenuProps {
  linkObject?: LinkObject;
  position?: Point;
  onDisconnect?: () => void;
}

export default function LinkMenu(props: LinkMenuProps) {
  const removeRelationship = trpc.useMutation(["vault.removeRelationship"]);

  return (
    <ContextMenu position={props.position}>
      <li>
        <a
          className="rounded"
          onClick={() => {
            const link = props.linkObject;
            if (!link) return;
            removeRelationship.mutateAsync({
              parent: ((link?.source as NodeObject).id as string) ?? "",
              child: ((link?.target as NodeObject).id as string) ?? "",
            });
            props.onDisconnect?.();
          }}
        >
          Disconnect
        </a>
      </li>
    </ContextMenu>
  );
}
