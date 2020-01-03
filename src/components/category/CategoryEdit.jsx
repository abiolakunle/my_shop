import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useFirestoreConnect } from "react-redux-firebase";
import { useAlert } from "react-alert";
import { add, update, remove } from "actions/populateActions";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import ChipInput from "material-ui-chip-input";
import {
  Button,
  CircularProgress,
  DialogContent,
  DialogTitle,
  DialogActions,
  Dialog,
  Box,
  FormControl,
  InputLabel,
  Select,
  Input,
  Chip,
  MenuItem
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
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    maxWidth: 300
  },
  chips: {
    display: "flex",
    flexWrap: "wrap"
  },
  chip: {
    margin: 2
  },
  noLabel: {
    marginTop: theme.spacing(3)
  }
}));

const getStyles = (name, personName, theme) => {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium
  };
};

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
};

const CategoryEdit = ({ edit, setEdit, open, setOpen }) => {
  const classes = useStyles();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("xs"));

  //redux
  const dispatch = useDispatch();

  const initialFormState = { name: "", categoryProperties: [] };
  //form state management
  const [form, setForm] = useState(initialFormState);
  const resetForm = () => {
    setEdit(undefined);
    setForm(initialFormState);
  };

  //console.log("form ..", form);

  // firestore
  useFirestoreConnect([
    {
      collection: "categoryProperties",
      where: ["categoryId", "==", edit?.id || ""]
    },
    {
      collection: "properties"
    }
  ]);
  const { ordered, data } = useSelector(state => state.firestoreReducer);
  console.log("ordered", ordered);

  const filterSelectedProperties = (
    properties = [],
    categoryProperties = []
  ) => {
    return properties.filter(({ id }) => {
      return categoryProperties
        .map(({ propertyId }) => propertyId)
        .includes(id);
    });
  };

  const [current, setCurrent] = useState([]);
  useEffect(() => {
    const categoryProperties = filterSelectedProperties(
      ordered.properties,
      ordered.categoryProperties
    );
    setCurrent(categoryProperties);
    console.log("catProps", categoryProperties);
    edit && setForm({ ...edit, categoryProperties });
  }, [edit, ordered]);

  //all properties
  const [allProperties, setAllProperties] = useState([]);
  useEffect(() => {
    setAllProperties(ordered.properties);
  }, [ordered]);

  //add categoryProperties
  const onAdd = chip => {
    setForm({
      ...form,
      categoryProperties: [...form.categoryProperties, { name: chip }]
    });
  };

  //handle alerts and progress
  const alert = useAlert();
  const { sending, sent, error, message } = useSelector(state => {
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
  const [added, setAdded] = useState([]);
  const [removed, setRemoved] = useState([]);

  const getAdded = (selected, current) => {
    console.log("selected", selected, "current", current);
    const result = selected.filter(
      ({ id }) => !current.map(({ id }) => id).includes(id)
    );
    console.log("Added: ", result);
    return result;
  };
  const getRemoved = (selected, current) => {
    console.log("selected", selected, "current", current);
    const result = current.filter(
      ({ id }) => !selected.map(({ id }) => id).includes(id)
    );
    console.log("Removed: ", result);
    return result;
  };

  useEffect(() => {
    setAdded(getAdded(form.categoryProperties, current));
    setRemoved(getRemoved(form.categoryProperties, current));
  }, [form]);

  const handleChange = event => {
    console.log("change", event.target);
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  //handle form submission
  const collection = "categories";
  const handleSubmit = event => {
    event.preventDefault();
    if (form.categoryProperties.length) {
      if (edit) {
        //update
        const AddedPropertyIds = added.map(property => ({
          propertyId: property.id
        }));
        dispatch(
          update(collection)({ ...form, categoryProperties: AddedPropertyIds })
        );
        //subCollection items to delete
        const getRemovedIds = (removed, categoryProperties) => {
          return categoryProperties.filter(({ propertyId }) => {
            return removed.map(({ id }) => id).includes(propertyId);
          });
        };
        const subCollection = "categoryProperties";
        getRemovedIds(removed, ordered.categoryProperties).forEach(item => {
          //delete
          dispatch(remove(subCollection)(item));
        });
      } else {
        //add
        const propertyIds = form.categoryProperties.map(property => ({
          propertyId: property.id
        }));
        dispatch(add(collection)({ ...form, categoryProperties: propertyIds }));
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
        <FormControl className={classes.formControl}>
          <InputLabel id="demo-mutiple-chip-label">Chip</InputLabel>
          <Select
            labelId="demo-mutiple-chip-label"
            id="demo-mutiple-chip"
            multiple
            value={form.categoryProperties}
            name="categoryProperties"
            onChange={handleChange}
            input={<Input id="select-multiple-chip" />}
            renderValue={selected => (
              <div className={classes.chips}>
                {selected.map(value => (
                  <Chip
                    key={value.name}
                    label={value.name}
                    className={classes.chip}
                  />
                ))}
              </div>
            )}
            MenuProps={MenuProps}
          >
            {allProperties?.map(property => (
              <MenuItem
                key={property.id}
                value={property}
                style={getStyles(property, form.categoryProperties, theme)}
              >
                {property.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
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
        {edit && !data.categoryProperties ? (
          <CircularProgress />
        ) : (
          <form
            className={classes.root}
            onSubmit={handleSubmit}
            autoComplete="off"
          >
            <DialogTitle id="scroll-dialog-title">
              {edit ? "Edit " : "Add "}
              {"category"}
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
export default CategoryEdit;
