import twilio from "twilio";
import withHandler, { ResponseType } from "@libs/server/withHanler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import mail from "@sendgrid/mail";


async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const { phone, email } = req.body;
  const user = phone ? { phone } : email ? { email } : null;
  if (!user) return res.status(400).json({ ok: false });
  // 랜덤 인증번호 생성
  const payload = Math.floor(100000 + Math.random() * 900000) + "";
  const token = await client.token.create({
    // data의 타입을 확인해보면 connect, create, connectOrCreate 세가지 옵션이 있다
    // createOrConnect 는 찾아보고 있으면 연결하고 없으면 새로 만드는 것
    // create는 새로운 유저를 생성하고, connect는 존재하는 user에 연결하는 것
    //! 토큰을 생성하고 서버를 껏다가 켜야함
    data: {
      payload,
      user: {
        // id는 user에 있는 id와 맞추겠다
        connectOrCreate: {
          where: {
            ...user,
          },
          create: {
            name: "Anonymous",
            ...user,
          },
        },
      },
    },
  });

  return res.json({
    ok: true, 
  });
}

export default withHandler({ methods: ["POST"], handler, isPrivate: false });
