import withHandler, { ResponseType } from "@libs/server/withHanler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSesstion";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  // req.query = 프론트에서 router.query와 같은 것
  const {
    query: { id },
    session: { user },
  } = req;
  const cleanID = Number(id);

  const product = await client.product.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    },
  });
  const terms = product?.name.split(" ").map((word) => ({
    name: {
      contains: word,
    },
  }));
  // 연관 상품 검색
  const relatedProducts = await client.product.findMany({
    where: {
      OR: terms,
      // AND = 찾는 조건
      AND: {
        id: {
          not: product?.id,
        },
      },
    },
  });
  const isLiked = Boolean(
    await client.fav.findFirst({
      where: {
        productId: product?.id,
        userId: user?.id
      },
      select: {
        id: true,
      },
    })
  );
  res.json({
    ok: true,
    product,
    relatedProducts,
    isLiked,
  });
}

export default withApiSession(
  withHandler({
    methods: ["GET"],
    handler,
  })
);
