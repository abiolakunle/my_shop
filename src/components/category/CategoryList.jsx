import React from "react";

const products = [
  { name: "Soccer" },
  {
    name: "Swimming"
  },
  { name: "Hockey" }
];

const CategoryList = props => {
  console.log("list", props);
  return (
    <div>
      Category List
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

export default CategoryList;
