import withHandler, { ResponseType } from "@libs/server/withHanler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSesstion";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  // 프론트에서 보낸 것을 받는 부분

  if (req.method === "POST") {
    const {
      body: { question, latitude, longitude },
      // query는 두가지를 제공할 수 있다.
      // 1. /posts/[id]
      // 2. /posts?latitude=lalalal
      session: { user },
    } = req;
    const post = await client.post.create({
      data: {
        question,
        latitude,
        longitude,
        user: {
          connect: {
            id: user?.id,
          },
        },
      },
    });
    res.json({
      ok: true,
      post,
    });
  }
  if (req.method === "GET") {
    const {
      query: { latitude, longitude },
    } = req;

    if (latitude && longitude) {
      const parsedLatitude = parseFloat(latitude.toString());
      const parsedLongitue = parseFloat(longitude.toString());

      const posts = await client.post.findMany({
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
          _count: {
            select: {
              wondering: true,
              answers: true,
            },
          },
        },
        where: {
          latitude: {
            gte: parsedLatitude - 0.01,
            lte: parsedLongitue + 0.01,
          },
          longitude: {
            gte: parsedLatitude - 0.01,
            lte: parsedLongitue + 0.01,
          },
        },

      });

      res.json({
        ok: true,
        posts,
      });
    }
  }
}

export default withApiSession(
  withHandler({
    methods: ["POST", "GET"],
    handler,
  })
);
