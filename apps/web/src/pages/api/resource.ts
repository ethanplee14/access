import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession as getServerSession } from "next-auth";
import { createResourceValidator } from "../../server/router/validators/resource";
import { authOptions as nextAuthOptions } from "./auth/[...nextauth]";
import { prisma } from "../../server/db/client";

const createResource = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method != "POST") res.status(404).send("Not found");

  const session = await getServerSession(req, res, nextAuthOptions);
  if (!session || !session.user) {
    res.status(403).send({
      content: "You need to login before you can access this route.",
    });
    return;
  }

  try {
    const input = createResourceValidator.parse(JSON.parse(req.body));
    console.log("We receiving input");
    console.log(input);

    // const subjectCompositeId = {
    //   userId_name: {
    //     userId: session.user.id,
    //     name: input.subjectName,
    //   },
    // };
    // const { tags: existingTags } = await prisma.vaultSubject.findUniqueOrThrow({
    //   where: subjectCompositeId,
    //   select: { tags: { select: { name: true } } },
    // });
    // const missingTags = input.tags.filter(
    //   (t) => !existingTags.map((et) => et.name).includes(t)
    // );
    // const { tags: tagIds } = await prisma.vaultSubject.update({
    //   where: subjectCompositeId,
    //   data: {
    //     tags: { create: missingTags.map((t) => ({ name: t })) },
    //   },
    //   select: {
    //     tags: { select: { id: true } },
    //   },
    // });
    // return prisma.vaultSubject.update({
    //   where: subjectCompositeId,
    //   data: {
    //     resources: {
    //       create: {
    //         name: input.name,
    //         url: input.url,
    //         score: input.review?.score,
    //         review: input.review?.comment,
    //         tags: { connect: tagIds },
    //       },
    //     },
    //   },
    // });
  } catch (e) {
    console.log("error");
    console.log(e);

    res.status(400).send("Bad request for - create resource");
  }
};

export default createResource;
