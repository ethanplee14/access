import dynamic from "next/dynamic";

/**
 * Need a wrapper in order to access react-force-graph's methods. Not exactly sure why...
 * Best guess is NextJS' lazy loading messes with how some of the methods are attached
 * to the force graph.
 *
 * https://github.com/vasturiano/react-force-graph/issues/324#issuecomment-942725048
 */
const SubjectGraph = dynamic(() => import("./subject-graph"), {
  ssr: false,
});

export default SubjectGraph;
