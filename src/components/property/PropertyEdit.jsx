import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useFirestoreConnect } from "react-redux-firebase";

import { addProperty, updateProperty } from "actions/propertyActions";
import { removeValue } from "actions/propertyValueActions";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import ChipInput from "material-ui-chip-input";
import { Button } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  chipInput: { minWidth: 300 },
  buttons: {
    display: "flex",
    justifyContent: "flex-end"
  },
  button: {
    marginTop: theme.spacing(4),
    marginLeft: theme.spacing(1)
  }
}));

const PropertyEdit = ({ id = "", ...rest }) => {
  const classes = useStyles();

  //redux
  const dispatch = useDispatch();

  //form state management
  const [form, setForm] = useState({
    name: "",
    values: []
  });

  // firestore
  useFirestoreConnect([
    { collection: "propertyValues", where: ["propertyId", "==", id] }
  ]);
  const { status, ordered } = useSelector(state => state.firestoreReducer);
  useEffect(() => {
    const values = ordered?.propertyValues?.map(propertyValue => {
      return propertyValue;
    });
    setForm({ ...rest, values });
  }, [id, ordered]);

  console.log("Props form", form);

  const onAdd = chip => {
    setForm({ ...form, values: [...form.values, { name: chip }] });
    console.log("Props form", form);
  };

  //deleted propertyValues
  const [deleted, setDeleted] = useState([]);
  const onDelete = (chip, index) => {
    setDeleted([...deleted, form.values[index]]);
    const newValues = form.values
      .slice(0, index)
      .concat(form.values.slice(index + 1));
    setForm({ ...form, values: [...newValues] });

    console.log("Props form", form);
  };

  const handleChange = event => {
    setForm({ ...form, [event.target.name]: event.target.value });
    console.log("Props form", form);
  };

  const handleSubmit = event => {
    event.preventDefault();
    if (id) {
      //update
      dispatch(updateProperty(id, form));
      deleted.length &&
        deleted.forEach(item => {
          //delete
          dispatch(removeValue(item));
        });
    } else {
      //add
      dispatch(addProperty(form));
    }
  };

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Property form
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            id="name"
            name="name"
            label="Property name"
            fullWidth
            placeholder="Enter property name, e.g. Color "
            value={form.name}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <ChipInput
            className={classes.chipInput}
            helperText="Type value, hit enter to type another"
            value={form.values?.map(value => value.name)}
            onAdd={onAdd}
            onDelete={onDelete}
            placeholder="Enter values for property, e.g. Red"
            fullWidth
          />
        </Grid>
      </Grid>
      <Button
        onClick={handleSubmit}
        variant="contained"
        color="primary"
        className={classes.button}
      >
        {id ? "Update" : "Add"}
      </Button>
    </React.Fragment>
  );
};
export default PropertyEdit;
