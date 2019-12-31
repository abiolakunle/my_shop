import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useFirestoreConnect } from "react-redux-firebase";
import { useAlert } from "react-alert";
import { add, update, remove } from "actions/populateActions";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import ChipInput from "material-ui-chip-input";
import { Button, CircularProgress } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  chipInput: { minWidth: 300, marginBottom: theme.spacing(4) },
  buttons: {
    display: "flex",
    justifyContent: "flex-end"
  },
  button: {
    marginBottom: theme.spacing(2)
  }
}));

const PropertyEdit = ({ edit, setEdit }) => {
  const classes = useStyles();

  //redux
  const dispatch = useDispatch();

  //form state management
  const [form, setForm] = useState({
    name: "",
    propertyValues: []
  });
  const resetForm = () => {
    setEdit(undefined);
    setForm({ name: "", propertyValues: [] });
  };

  // firestore
  useFirestoreConnect([
    {
      collection: "propertyValues",
      where: ["propertyId", "==", edit?.id || ""]
    }
  ]);
  const { ordered, data } = useSelector(state => state.firestoreReducer);
  useEffect(() => {
    const values = ordered?.propertyValues?.map(propertyValue => {
      return propertyValue;
    });
    setForm({ ...edit, propertyValues: values });
  }, [edit, ordered]);

  //add propertyValues
  const onAdd = chip => {
    setForm({
      ...form,
      propertyValues: [...form.propertyValues, { name: chip }]
    });
  };

  //delete propertyValues
  const [deleted, setDeleted] = useState([]);
  const onDelete = (chip, index) => {
    setDeleted([...deleted, form.propertyValues[index]]);
    const newValues = form.propertyValues
      .slice(0, index)
      .concat(form.propertyValues.slice(index + 1));
    setForm({ ...form, propertyValues: [...newValues] });
  };

  //handle alerts and progress
  const alert = useAlert();
  const { sending, sent, error, message } = useSelector(state => {
    console.log("state", state.populateReducer);
    return state.populateReducer;
  });
  useEffect(() => {
    if (sent || error) {
      alert.show(message, { type: error ? "error" : "success" });
      sent && resetForm();
    }
  }, [sent, error, message]);

  //handle from state change
  const handleChange = event => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  //handle form submission
  const collection = "properties";
  const handleSubmit = event => {
    event.preventDefault();
    if (form.propertyValues.length) {
      if (edit) {
        const { id, ...rest } = form;
        //update
        dispatch(update(collection)(id, { ...rest }));
        deleted.length &&
          deleted.forEach(item => {
            //delete
            dispatch(remove(collection)(item));
          });
      } else {
        //add
        dispatch(add(collection)(form));
      }
    } else {
      alert.show("Please add at least one property value", { type: "info" });
    }
  };

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Property form
      </Typography>
      {edit && !data.propertyValues ? (
        <CircularProgress />
      ) : (
        <form
          className={classes.root}
          onSubmit={handleSubmit}
          autoComplete="off"
        >
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
                required
              />
            </Grid>
            <Grid item xs={12}>
              <ChipInput
                className={classes.chipInput}
                helperText="Type value, hit enter to type another"
                value={form.propertyValues?.map(value => value.name)}
                onAdd={onAdd}
                onDelete={onDelete}
                placeholder="Enter values for property, e.g. Red"
                fullWidth
              />
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                {sending && <CircularProgress />}
              </Grid>
              <Grid item xs={12}>
                <Grid container>
                  <Grid item xs={edit ? 6 : 12}>
                    <Button
                      variant="contained"
                      color="primary"
                      className={classes.button}
                      type="submit"
                    >
                      {edit ? "Update" : "Add"}
                    </Button>
                  </Grid>
                  {edit && (
                    <Grid item xs={6}>
                      <Button
                        variant="contained"
                        color="light"
                        className={classes.button}
                        onClick={() => {
                          resetForm();
                        }}
                      >
                        Cancel
                      </Button>
                    </Grid>
                  )}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </form>
      )}
    </React.Fragment>
  );
};
export default PropertyEdit;
