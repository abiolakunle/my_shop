import React from "react";

const ProductEdit = props => {
  console.log("this", props);
  return (
    <div>
      Product Edit
      <div>{props.edit && props.edit.name}</div>
    </div>
  );
};

export default ProductEdit;
