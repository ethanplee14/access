import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession as getServerSession } from "next-auth";
import { decodeReadableStream } from "../../utils/string";
import { authOptions as nextAuthOptions } from "./auth/[...nextauth]";

const createResource = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method != "POST") res.status(405).send("Not allowed");

  const session = await getServerSession(req, res, nextAuthOptions);
  if (!session || !session.user) {
    res.status(403).send({
      content: "You need to login to access this route.",
    });
    return;
  }

  /* THIS IS A SECURITY RISK!!!!!
    right now just forwarding the userId clint side straight to be stored to the back-end. This means if someone's clever enough on the front-end, 
    they can send files to other people's resource folders. Trying to figure out how to transform multipart/form-data before it's forwarded. 
    Will keep it like this until further investigations. 
  */
  const FS_URL = "http://107.155.121.13:8080";
  const uploadRes = await fetch(FS_URL + "/upload", {
    method: "POST",
    headers: {
      "Content-Type": req.headers["content-type"] ?? "",
      Authorization: "Bearer " + process.env.FS_TOKEN,
    },
    body: req as any,
  });

  if (!uploadRes.ok || !uploadRes.body)
    throw new Error("Failed to read upload response");

  const resPath = await decodeReadableStream(uploadRes.body);
  res.send(FS_URL + "/res/" + resPath);
};

export default createResource;

export const config = {
  api: {
    bodyParser: false,
    // body parser malforms the data being forwarded and corrupts data
    // Setting to false to keep it, will need to check file upload size manually.
  },
};
