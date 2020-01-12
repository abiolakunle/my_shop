import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

import { useFirestoreConnect } from "react-redux-firebase";

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  }
}));

const ProductPropertyEdit = ({ form, setForm }) => {
  const classes = useStyles();

  const { ordered } = useSelector(state => {
    console.log("store", state.firestoreReducer);
    return state.firestoreReducer;
  });

  const { categoryProperties } = ordered;
  //create properties queries from categoryProperties
  const [propertyQueries, setPropertyQueries] = useState([]);
  useEffect(() => {
    //console.log("properties", categoryProperties);
    const queries =
      categoryProperties?.map(({ propertyId }) => {
        return {
          collection: "properties",
          doc: propertyId,
          storeAs: propertyId
        };
      }) || [];

    setPropertyQueries(queries);
  }, [categoryProperties]);

  //get properites data from queries
  const [properties, setProperties] = useState([]);
  //console.log("properties", properties);
  useEffect(() => {
    const newProperties = categoryProperties?.map(({ propertyId }) => {
      const property = ordered[propertyId];
      return property && property[0];
    });
    setProperties(newProperties?.filter(p => p));
  }, [ordered, categoryProperties]);

  //create propertyValues queries from properties
  const [valueQueries, setValueQueries] = useState([]);

  useEffect(() => {
    console.log("properties", properties);
    const queries =
      properties?.map(({ id }) => {
        return {
          collection: "propertyValues",
          where: ["propertyId", "==", id],
          storeAs: `value_${id}`
        };
      }) || [];
    setValueQueries(queries);
  }, [properties]);

  //firestore
  useFirestoreConnect([
    {
      collection: "categoryProperties",
      where: ["categoryId", "==", form?.categoryId || ""]
    },
    ...propertyQueries,
    ...valueQueries
  ]);

  const handleSelectChange = event => {
    const name = event.target.name;
    const value = event.target.value;
    setForm({
      ...form,
      productPropertyValues: [
        ...(form.productPropertyValues || []),
        { [name]: value }
      ]
    });
  };

  return (
    <div>
      {properties?.map(({ id, name }) => {
        const selected = form.productPropertyValues?.find(item =>
          item.hasOwnProperty(id)
        );
        return (
          <FormControl required className={classes.formControl}>
            <InputLabel id="demo-simple-select-required-label">
              {name}
            </InputLabel>
            <Select
              labelId="demo-simple-select-required-label"
              name={id}
              value={selected && selected[id]}
              id="demo-simple-select-required"
              onChange={handleSelectChange}
            >
              {ordered[`value_${id}`]?.map(({ name, id }) => {
                return <MenuItem value={id}>{name}</MenuItem>;
              })}
            </Select>
            <FormHelperText>Required</FormHelperText>
          </FormControl>
        );
      })}
    </div>
  );
};

export default ProductPropertyEdit;
