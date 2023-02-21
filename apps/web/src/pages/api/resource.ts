import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession as getServerSession } from "next-auth";
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
  const uploadRes = await fetch("http://107.155.121.13:8080/upload", {
    method: "POST",
    headers: {
      "Content-Type": req.headers["content-type"] ?? "",
      Authorization: "Bearer " + process.env.FS_TOKEN,
    },
    body: req.body,
  });

  if (!uploadRes.ok) throw new Error("It doesn't work");
  res.send("ok");
};

export default createResource;
