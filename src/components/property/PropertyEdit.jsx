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
import {
  Button,
  CircularProgress,
  DialogContent,
  DialogTitle,
  DialogContentText,
  DialogActions,
  Dialog,
  Box
} from "@material-ui/core";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  chipInput: { minWidth: 300, marginBottom: theme.spacing(4) },
  buttons: {
    display: "flex",
    justifyContent: "flex-end"
  },
  button: {
    marginBottom: theme.spacing(2)
  },
  center: {
    display: "flex",
    flexDirection: "column",
    margin: "auto",
    width: "fit-content"
  }
}));

const PropertyEdit = ({ edit, setEdit, open, setOpen }) => {
  const classes = useStyles();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("xs"));

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
  const propertyValues = ordered?.propertyValues;
  useEffect(() => {
    setForm({ ...edit, propertyValues });
  }, [edit, propertyValues]);

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
    console.log("state", state);
    return state.populateReducer;
  });
  useEffect(() => {
    if (sent || error) {
      alert.show(message, { type: error ? "error" : "success" });
      sent && resetForm();
      sent && setOpen(false);
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
  const formInputs = (
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
    </Grid>
  );

  return (
    <React.Fragment>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        scroll={"paper"}
        onClose={() => {
          setOpen(false);
        }}
        aria-labelledby="responsive-dialog-title"
      >
        {edit && !data.propertyValues ? (
          <CircularProgress />
        ) : (
          <form
            className={classes.root}
            onSubmit={handleSubmit}
            autoComplete="off"
          >
            <DialogTitle id="scroll-dialog-title">
              {edit ? "Edit " : "Add "}
              {"property"}
            </DialogTitle>
            <DialogContent dividers={true}>
              {formInputs}
              <Box className={classes.center}>
                {sending && <CircularProgress />}
              </Box>
            </DialogContent>

            <DialogActions>
              {
                <Button
                  variant="contained"
                  color="light"
                  className={classes.button}
                  onClick={() => {
                    resetForm();
                    setOpen(false);
                  }}
                >
                  Cancel
                </Button>
              }
              <Button
                variant="contained"
                color="primary"
                className={classes.button}
                type="submit"
                disabled={sending}
              >
                {edit ? "Update" : "Add"}
              </Button>
            </DialogActions>
          </form>
        )}
      </Dialog>
    </React.Fragment>
  );
};
export default PropertyEdit;
