import withHandler, { ResponseType } from "@libs/server/withHanler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSesstion";
import { request } from "http";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {

  if (req.method === "GET") {
    const profile = await client.user.findUnique({
      where: { id: req.session.user?.id },
    });

    res.json({
      ok: true,
      profile,
    });
  }

  if (req.method === "POST") {
    
    const {
      session: { user },
      body: { email, phone, name },
    } = req;
// session 에서 받아온 user정보와 body에서 받아온 정보를 비교해서 다른 경우에만 if문 실행
    const currentUser = await client.user.findUnique({
      where:{
        id: user?.id
      }
    })

    if (email && email !== currentUser?.email) {
      const alreadyExists = Boolean(
        await client.user.findUnique({
          where: {
            email,
          },
          select: {
            id: true,
          },
        })
      );
      if (alreadyExists) {
        return res.json({
          ok: false,
          error: "이미 존재하는 이메일입니다.",
        });
      }
      await client.user.update({
        where: {
          id: user?.id,
        },
        data: {
          email,
        },
      });
      res.json({
        ok: true,
      });
    }
    if (phone && phone !== currentUser?.phone) {
      const alreadyExists = Boolean(
        await client.user.findUnique({
          where: {
            email,
          },
          select: {
            id: true,
          },
        })
      );
      if (alreadyExists) {
        return res.json({
          ok: false,
          error: "이미 존재하는 번호입니다",
        });
      }
      await client.user.update({
        where: {
          id: user?.id,
        },
        data: {
          phone,
        },
      });
      res.json({
        ok: true,
      });
    }
    if(name){
      await client.user.update({
        where:{
          id: user?.id,
        },
        data:{
          name,
        }
      })
    }
    res.json({
      ok: true
    })
  }
}

export default withApiSession(
  withHandler({
    methods: ["GET", "POST"],
    handler,
  })
);
