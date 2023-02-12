import { LinkIcon, TrashIcon } from "@heroicons/react/24/outline";
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
import LoadingDisplay from "./common/loading-display";
import GraphSearch from "./graph-search";

export interface SubjectGraphProps {
  width: number;
  height: number;
}

//Replace NodeObjects with this new type and remove use of any
type SubjectNode = NodeObject & {
  id: string;
  label: string;
  val: number;
};

export default function SubjectGraph(props: SubjectGraphProps) {
  const router = useRouter();
  const forceGraph = useRef<ForceGraphMethods>();

  const { data: subjectData } = trpc.useQuery(["vault.subjectGraph"]);
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

  const sortedSubjectNames =
    subjectData != undefined
      ? Object.values(subjectData)
          .map((s) => s.name)
          .sort((s1, s2) => (s1 < s2 ? -1 : 1))
      : [];

  useEffect(() => {
    const graphData = parseForceGraphData();
    if (graphData) setGraphData(graphData);
  }, [subjectData]);

  return (
    <>
      {subjectData == undefined ? (
        <div className={"mt-24"}>
          <LoadingDisplay />
        </div>
      ) : (
        <>
          <div className="absolute p-3 z-10 right-0">
            <GraphSearch
              selections={sortedSubjectNames}
              onSelect={(selection) => {
                const searchedNode = graphData?.nodes?.find(
                  (n: any) => n.label == selection
                );
                //add 30 to account for navbar
                forceGraph.current?.centerAt(
                  searchedNode?.x,
                  (searchedNode?.y ?? 0) + 30,
                  500
                );
                forceGraph.current?.zoom(3, 500);
              }}
            />
          </div>
          <ForceGraph2D
            ref={forceGraph}
            width={props.width}
            height={props.height}
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
                  setGraphData({
                    nodes: graphData?.nodes ?? [],
                    links:
                      graphData?.links?.filter(
                        (l) =>
                          l.source != link?.source || l.target != link?.target
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
      )}
    </>
  );

  function parseForceGraphData() {
    const BASE_SIZE = 3;
    const subjectGraph = subjectData;

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
