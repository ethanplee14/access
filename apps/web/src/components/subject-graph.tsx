import { LinkIcon, TrashIcon } from "@heroicons/react/24/outline";
import { VaultSubject } from "@prisma/client";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import ForceGraph2D, {
  ForceGraphMethods,
  LinkObject,
  NodeObject,
} from "react-force-graph-2d";
import { Point } from "../types/geometry";
import { trpc } from "../utils/trpc";
import ContextMenu from "./common/context-menu";

export interface SubjectGraphProps {
  width: number;
  height: number;
  subjectData?: Record<
    string,
    VaultSubject & {
      parents: string[];
      children: string[];
    }
  >;
  subjectFocus?: string;
}

export default function SubjectGraph(props: SubjectGraphProps) {
  const router = useRouter();
  const forceGraph = useRef<ForceGraphMethods>();

  const addRelationship = trpc.useMutation(["vault.addRelationship"]);
  const removeRelationship = trpc.useMutation(["vault.removeRelationship"]);

  const [graphData, setGraphData] = useState<
    { nodes: NodeObject[]; links: LinkObject[] } | undefined
  >();
  const [contextMenuPos, setContextMenuPos] = useState<Point>();
  const [linkMenuPos, setLinkMenuPos] = useState<Point>();
  const [targetNode, setTargetNode] = useState("");

  const ctxNode = useRef("");
  const ctxLink = useRef<LinkObject>();

  useEffect(() => {
    const graphData = parseForceGraphData();
    if (graphData) setGraphData(graphData);
  }, [props.subjectData]);

  useEffect(() => {
    if (!props.subjectFocus) return;

    forceGraph.current?.centerAt();
  }, [props.subjectFocus]);

  return (
    <>
      <ForceGraph2D
        ref={forceGraph}
        graphData={graphData}
        nodeColor={(n) => (targetNode == n.id ? "gold" : "#505050")}
        linkWidth={2}
        linkDirectionalArrowLength={3}
        linkDirectionalArrowRelPos={1}
        nodeCanvasObjectMode={() => "after"}
        nodeCanvasObject={(node: any, ctx) => {
          const fontSize = 8;
          ctx.font = `${fontSize}px Sans-Serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillStyle = "black";
          ctx.fillText(node.label, node.x, node.y! + 12);
        }}
        onNodeClick={(node: any) => {
          if (targetNode) {
            if (targetNode != node.id) {
              addRelationship.mutateAsync({
                parent: targetNode,
                child: node.id,
              });
              setGraphData({
                nodes: graphData?.nodes ?? [],
                links: [
                  ...(graphData?.links ?? []),
                  { source: targetNode, target: node.id },
                ],
              });
            }
            setTargetNode("");
          } else router.push("/vault/" + node["label"].toLowerCase());
        }}
        onNodeRightClick={(node: any, e: MouseEvent) => {
          e.preventDefault();
          setContextMenuPos({ x: e.clientX, y: e.clientY });
          ctxNode.current = node.id;
        }}
        onLinkRightClick={(link, e) => {
          setLinkMenuPos({ x: e.clientX, y: e.clientY });
          ctxLink.current = link;
        }}
        onBackgroundClick={(e) => {
          setContextMenuPos(undefined);
          setLinkMenuPos(undefined);
        }}
      />
      {/* Link menu */}
      <ContextMenu position={linkMenuPos}>
        <li>
          <a
            className="rounded"
            onClick={(_) => {
              const link = ctxLink.current;
              // i mighta crossed the names here
              removeRelationship.mutateAsync({
                parent: ((link?.source as NodeObject).id as string) ?? "",
                child: ((link?.target as NodeObject).id as string) ?? "",
              });
              console.log(link);
              setGraphData({
                nodes: graphData?.nodes ?? [],
                links:
                  graphData?.links?.filter(
                    (l) => l.source != link?.source || l.target != link?.target
                  ) ?? [],
              });
              setLinkMenuPos(undefined);
              ctxLink.current = undefined;
            }}
          >
            Disconnect
          </a>
        </li>
      </ContextMenu>
      {/* Subject Menu */}
      <ContextMenu
        position={contextMenuPos}
        onClose={() => setContextMenuPos(undefined)}
      >
        <li>
          <a
            className={"rounded"}
            onClick={(_) => {
              setTargetNode(ctxNode.current);
              setContextMenuPos(undefined);
              ctxNode.current = "";
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
    </>
  );

  function parseForceGraphData() {
    const BASE_SIZE = 3;
    const subjectGraph = props.subjectData;

    if (!subjectGraph) {
      return;
    }

    const nodes: NodeObject[] = [];
    const links: LinkObject[] = [];

    for (const subject of Object.values(subjectGraph)) {
      const nodeObject = {
        id: subject.id,
        label: subject.name,
        val: BASE_SIZE,
      };
      nodes.push(nodeObject);

      subject.children.forEach((childId) =>
        links.push({ source: nodeObject, target: childId })
      );
    }
    return { nodes, links };
  }
}
