import twilio from "twilio";
import withHandler, { ResponseType } from "@libs/server/withHanler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import mail from "@sendgrid/mail";

// mail.setApiKey(process.env.SENDGRIDKEY!);

// const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const { phone, email } = req.body;
  // if (email) {
  //   user = await client.user.findUnique({
  //     where: {
  //       email,
  //     },
  //   });
  //   if(user){
  //     console.log('found it')
  //   }
  //   if (!user) {
  //     console.log('did not find, will create')
  //     user = await client.user.create({
  //       data: {
  //         name: "Anonymous",
  //         email,
  //       },
  //     });
  //   }
  //   console.log(user)
  // }
  // if (phone) {
  //   user = await client.user.findUnique({
  //     where: {
  //       phone: +phone,
  //     },
  //   });
  //   if(user){
  //     console.log('found it')
  //   }
  //   if (!user) {
  //     console.log('did not find, will create')
  //     user = await client.user.create({
  //       data: {
  //         name: "Anonymous",
  //         phone: +phone,
  //       },
  //     });
  //   }
  //   console.log(user)
  // }
  const user = phone ? { phone: +phone } : email ? { email } : null;
  if (!user) return res.status(400).json({ ok: false });
  // 인증번호 같은거임
  const payload = Math.floor(100000 + Math.random() * 900000) + "";
  // const user = await client.user.upsert({
  //   where: {
  //     // ... =>if else와 같은 의미
  //     // phone 이 있으면 phone: +phone을 리턴하겠다.
  //     ...payload,
  //   },
  //   create: {
  //     name: "Anonymous",
  //     ...payload,
  //   },
  //   update: {},
  // });
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
  if (phone) {
  //   const message = await twilioClient.messages.create({
  //     messagingServiceSid: process.env.TWILIO_MSID,
  //     // 원래 user에서 받은 phone으로 보내야 하지만 트라이얼 계정이니 env에 저장한 내 번호로 보낸다
  //     // ! !표시는 타입스크립트에게 반드시 존재할거라고 알려주는 표시
  //     to: process.env.PHONE_NUMBER!,
  //     body: `Your login token is ${payload}`,
  //   });
  //   console.log(message);
  }
  else if (email) {
    // const msg = {
    //   to: "dhdytjq2@gmail.com",
    //   from: "dhdytjq2@naver.com",
    //   subject: "캐럿마켓 이메일 인증",
    //   text: `캐럿마켓 인증번호를 화면에 입력해주세요.`,
    //   html: `<strong>캐럿마켓 인증번호 ${payload}를 화면에 입력해주세요.</strong>`,
    // };
    // console.log(msg);
  }
  
  return res.json({
    ok: true,
  });
}
export default withHandler("POST", handler);
