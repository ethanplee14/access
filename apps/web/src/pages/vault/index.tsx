import Head from "next/head";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import {
  ForceGraphMethods,
  LinkObject,
  NodeObject,
} from "react-force-graph-2d";

import NavBar from "../../components/nav-bar";
import { trpc } from "../../utils/trpc";
import LoadingDisplay from "../../components/common/loading-display";
import { useElementResize } from "../../hooks/element-resize";
import getAuthServerSideProps from "../../server/common/get-auth-server-side-props";
import { Point } from "../../types/geometry";
import ContextMenu from "../../components/common/context-menu";
import { TrashIcon } from "@heroicons/react/24/outline";
import { LinkIcon } from "@heroicons/react/20/solid";

const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), {
  ssr: false,
});

export default function Vault() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const containerSize = useElementResize(containerRef);
  const router = useRouter();

  const subjectGraphQuery = trpc.useQuery(["vault.subjectGraph"]);
  const addRelationship = trpc.useMutation(["vault.addRelationship"]);
  const removeRelationship = trpc.useMutation(["vault.removeRelationship"]);

  const [graphData, setGraphData] = useState<
    { nodes: NodeObject[]; links: LinkObject[] } | undefined
  >();
  const [contextMenuPos, setContextMenuPos] = useState<Point>();
  const [linkMenuPos, setLinkMenuPos] = useState<Point>();
  const [targetNode, setTargetNode] = useState("");
  const forceGraph = useRef();
  const ctxNode = useRef("");
  const ctxLink = useRef<LinkObject>();

  useEffect(() => {
    const graphData = parseGraphData();
    if (graphData) setGraphData(graphData);
  }, [subjectGraphQuery.data]);

  return (
    <>
      <Head>
        <title>{`Resource vault - Access`}</title>
        <link rel="icon" href="/icons/favicon.ico" />
      </Head>
      <main className={"w-screen h-screen flex flex-col"}>
        <NavBar
          subjects={graphData?.nodes
            ?.map((n) => ((n as any).label as string) ?? "")
            ?.sort((s1, s2) => (s1 < s2 ? -1 : 1))}
          // onSearch={}
        />
        <div className={"relative flex-1 w-full"}>
          <div ref={containerRef} className="absolute w-full h-full" />
          <div className="absolute w-full h-full overflow-hidden">
            {graphData == undefined && (
              <div className={"mt-24"}>
                <LoadingDisplay />
              </div>
            )}
            {/* When conditionally rendered ForceGraph2D doesn't render contents for some reason */}
            <ForceGraph2D
              ref={forceGraph}
              width={containerSize.width - 1}
              height={containerSize.height - 1}
              graphData={graphData}
              nodeColor={(node) => {
                return targetNode == node.id ? "gold" : "#505050";
              }}
              onNodeClick={(node: any, e: MouseEvent) => {
                console.log(forceGraph.current);
                // forceGraph.current?.centerAt(node.x, node.y, 500);
                // if (targetNode) {
                //   if (targetNode != node.id) {
                //     addRelationship.mutateAsync({
                //       parent: targetNode,
                //       child: node.id,
                //     });
                //     setGraphData({
                //       nodes: graphData?.nodes ?? [],
                //       links: [
                //         ...(graphData?.links ?? []),
                //         { source: targetNode, target: node.id },
                //       ],
                //     });
                //   }
                //   setTargetNode("");
                // } else router.push("/vault/" + node["label"].toLowerCase());
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
              linkWidth={2}
              linkDirectionalArrowLength={3}
              linkDirectionalArrowRelPos={1}
              nodeCanvasObjectMode={() => "after"}
              nodeCanvasObject={(node: any, ctx, globalScale) => {
                const fontSize = 8;
                ctx.font = `${fontSize}px Sans-Serif`;
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                // Creates white outline
                // ctx.strokeStyle = 'white'
                // ctx.lineWidth = 2 / globalScale
                // ctx.strokeText(node.name, node.x, node.y!)
                ctx.fillStyle = "black"; //node.color;
                ctx.fillText(node.label, node.x, node.y! + 12);
              }}
            />
          </div>
        </div>
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
      </main>
    </>
  );

  function parseGraphData() {
    const BASE_SIZE = 3;
    const subjectGraph = subjectGraphQuery.data;

    if (!subjectGraph) {
      return;
    }

    const nodes: NodeObject[] = [];
    const links: LinkObject[] = [];

    for (const subject of Object.values(subjectGraph)) {
      // cast to object in order to be accepted as NodeObject.
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

export const getServerSideProps = getAuthServerSideProps();
