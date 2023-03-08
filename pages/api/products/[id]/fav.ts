import withHandler, { ResponseType } from "@libs/server/withHanler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import { withApiSession } from "@libs/server/withSesstion";


async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    query: { id },
    session: { user },
  } = req;

  const alreadyExists = await client.fav.findFirst({
    where: {
      productId: Number(id),
      userId: user?.id
    },
  });
  // fav에 이미 아이템이 존재하면 한번 더 눌렀을 때 삭제하겠다
  if(alreadyExists){
    // delete()은 unique만 삭제할 수 있다. Fav테이블에서 id만 unique니까 fav.id를 알아야 함
    // 만약 unique필드가 없으면 deleteMany()를 쓰면 session의 user.id가 가진 모든 favorite데이터를 삭제 가능
    await client.fav.delete({
      where: {
        id: alreadyExists.id
      }
    })
  }else{
    await client.fav.create({
      data:{
        user:{
          connect:{
            id: user?.id
          }
        } ,
        product:{
          connect:{
            id: Number(id)
          },
        },
      }
    })

  }
  res.json({
    ok: true,
  });
}

export default withApiSession(
  withHandler({
    methods: ["POST"],
    handler,
  })
);
