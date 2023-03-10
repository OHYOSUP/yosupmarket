import withHandler, { ResponseType } from "@libs/server/withHanler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSesstion";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    session: { user },
  } = req;

  const reviews = await client.review.findMany({
    where: { createdById: user?.id },
    include: { createdBy: { select: { name: true, id: true, avatar: true } } }
  });

  res.json({
    ok: true,
    reviews,
  });
}

export default withApiSession(
  withHandler({
    methods: ["GET"],
    handler,
  })
);
