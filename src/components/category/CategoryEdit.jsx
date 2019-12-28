import React from "react";

const CategoryEdit = props => {
  console.log("this", props);
  return (
    <div>
      Category Edit
      <div>{props.edit && props.edit.name}</div>
    </div>
  );
};

export default CategoryEdit;
