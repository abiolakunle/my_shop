import React from "react";

const products = [
  { name: "Football" },
  {
    name: "Volley ball"
  },
  { name: "Net ball" }
];

const ProductList = props => {
  console.log("list", props);
  return (
    <div>
      Product List
      <div>
        {products.map((item, index) => {
          return (
            <div>
              {item.name}{" "}
              <button
                onClick={event => {
                  event.preventDefault();
                  props.setEdit(item);
                }}
              >
                Edit
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductList;
