import { Product } from "@prisma/client";
import { ProductWithCount } from "pages";
import useSWR from "swr";
import Item from "./item";

interface ProductListProps {
  kind: "fav" | "sales" | "purchases";
}

interface Record extends Product {
  id: number;
  product: ProductWithCount;
}
interface ProductListResponse {
  [key: string]: Record[];
}

function ProductLists({ kind }: ProductListProps) {
  const { data } = useSWR<ProductListResponse>(`/api/users/me/${kind}`);

  return data ? (
    <>
      {data[kind]?.map((record) => (
        <Item
          id={record.product.id}
          key={record.id}
          title={record.product.name}
          price={record.product.price}
          hearts={record.product._count.favs}
        />
      ))}
    </>
  ) : null;
}

export default ProductLists;
