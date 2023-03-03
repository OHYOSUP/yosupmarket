import withHandler, { ResponseType } from "@libs/server/withHanler";
import { NextApiRequest, NextApiResponse } from "next";
import { withIronSessionApiRoute } from "iron-session/next";
import client from "@libs/server/client";



declare module "iron-session"{
  interface IronSessionData{
    user?: {
      id: number;
    }
  }
}


async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const { token } = req.body;
  const exists = await client.token.findUnique({
    where: {
      payload: token,
    },
    // include: { user: true },
  });

  if (!exists) {
    return res.status(404).end();
  }
  req.session.user = {
    id: exists.userId
  }
  await req.session.save();
  res.status(200).end();
}

export default withIronSessionApiRoute(withHandler("POST", handler), {
  cookieName: "carrotsession",
  password: "josephoh21!josephoh21!josephoh21!",
});
