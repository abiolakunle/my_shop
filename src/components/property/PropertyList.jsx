import React from "react";

const products = [
  { name: "Color" },
  {
    name: "Size"
  },
  { name: "Model" }
];

const PropertyList = props => {
  console.log("list", props);
  return (
    <div>
      Property List
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

export default PropertyList;
