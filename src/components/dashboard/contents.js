import { ProductEdit, ProductList, Product } from "components/product/index";

export default [
  {
    title: "Product",
    component: Product,
    route: "/products"
  },
  {
    title: "Add product",
    component: ProductEdit,
    route: "/product/add"
  },
  {
    title: "Edit product",
    component: ProductEdit,
    route: "/product/edit"
  }
];
