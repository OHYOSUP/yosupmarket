import type { NextPage } from "next";
import Item from "@components/item";
import Layout from "@components/layout";
import ProductLists from "@components/product-lists";

const Loved: NextPage = () => {
  return (
    <Layout title="관심목록" canGoBack>
      <div className="flex flex-col space-y-5 pb-10  divide-y">
      <ProductLists kind= "fav" />
      </div>
    </Layout>
  );
};

export default Loved;
