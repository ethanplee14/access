import Head from "next/head";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import { LinkObject, NodeObject } from "react-force-graph-2d";

import NavBar from "../../components/nav-bar";
import { trpc } from "../../utils/trpc";
import LoadingDisplay from "../../components/common/loading-display";
import { useElementResize } from "../../hooks/element-resize";
import getAuthServerSideProps from "../../server/common/get-auth-server-side-props";
import { Point } from "../../types/geometry";
import ContextMenu from "../../components/common/context-menu";
import { TrashIcon } from "@heroicons/react/24/outline";

const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), {
  ssr: false,
});

export default function Vault() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const containerSize = useElementResize(containerRef);
  const router = useRouter();

  const subjectGraphQuery = trpc.useQuery(["vault.subjectGraph"]);

  const [graphData, setGraphData] = useState<
    { nodes: NodeObject[]; links: LinkObject[] } | undefined
  >();
  const [contextMenuPos, setContextMenuPos] = useState<Point>();

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
        <NavBar />
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
              width={containerSize.width - 1}
              height={containerSize.height - 1}
              graphData={graphData}
              nodeColor={(_) => "#505050"}
              onNodeClick={(node: any, e: MouseEvent) => {
                console.log("We received clik");
                router.push("/vault/" + node["label"].toLowerCase());
              }}
              onNodeRightClick={(node: any, e: MouseEvent) => {
                e.preventDefault();
              }}
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
        <ContextMenu
          position={contextMenuPos}
          onClose={() => setContextMenuPos(undefined)}
        >
          <li>
            <a className={"rounded-none hover:bg-error"} onClick={(_) => {}}>
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
