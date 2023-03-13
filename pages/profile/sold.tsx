import type { NextPage } from "next";
import Layout from "@components/layout";
import ProductLists from "@components/product-lists";


const Sold: NextPage = () => {
  
  return (
    <Layout title="판매내역" canGoBack>
      <div className="flex flex-col space-y-5 pb-10  divide-y">
        <ProductLists kind= "sales" />
      </div>
    </Layout>
  );
};

export default Sold;
