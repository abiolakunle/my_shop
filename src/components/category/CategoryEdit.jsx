import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useFirestoreConnect } from "react-redux-firebase";
import { useAlert } from "react-alert";
import { add, update, remove } from "actions/populateActions";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
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
  MenuItem,
  Fab
} from "@material-ui/core";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import { PropertyEdit } from "components/property";

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

const getStyles = ({ deleted, added }, property, properties, theme) => {
  return {
    fontWeight:
      properties.indexOf(property) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
    backgroundColor: "primary !important"
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
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  //redux
  const dispatch = useDispatch();

  const initialFormState = { name: "", categoryProperties: [] };
  //form state management
  const [form, setForm] = useState(initialFormState);

  const handleChange = event => {
    console.log("change", event.target);
    setForm({ ...form, [event.target.name]: event.target.value });
  };
  const resetForm = () => {
    setEdit && setEdit(undefined);
    setForm(initialFormState);
  };

  //redux queries firestore
  useFirestoreConnect([
    {
      collection: "categoryProperties",
      where: ["categoryId", "==", edit?.id || ""]
    },
    {
      collection: "properties"
    }
  ]);
  //get ordered data from firestore reducer
  const { ordered, data } = useSelector(state => state.firestoreReducer);

  //use property id to gets current properties from all properties list
  const filterSelectedProperties = (properties, categoryProperties) => {
    return properties?.filter(({ id }) => {
      return categoryProperties
        ?.map(({ propertyId }) => propertyId)
        .includes(id);
    });
  };

  //intial properties for category to be edited
  const [current, setCurrent] = useState([]);
  useEffect(() => {
    const { properties, categoryProperties } = ordered;
    const currentProperties = filterSelectedProperties(
      properties,
      categoryProperties
    );
    setCurrent(currentProperties);
    edit && setForm({ ...edit, categoryProperties: currentProperties });
  }, [edit, ordered]);

  //all properties
  const [allProperties, setAllProperties] = useState([]);
  useEffect(() => {
    setAllProperties(ordered.properties);
  }, [ordered]);

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

  //store removed and added properties for category to be edited
  const [added, setAdded] = useState([]);
  const [removed, setRemoved] = useState([]);

  //get new properties added to category properties
  const getAdded = (selected, current) => {
    return selected?.filter(
      ({ id }) => !current.map(({ id }) => id).includes(id)
    );
  };

  //get properties remove from category properties
  const getRemoved = (selected, current) => {
    return current?.filter(
      ({ id }) => !selected.map(({ id }) => id).includes(id)
    );
  };
  //gets ids of removed categoryProperties
  const getRemovedIds = (removed, categoryProperties) => {
    return categoryProperties.filter(({ propertyId }) => {
      return removed.map(({ id }) => id).includes(propertyId);
    });
  };

  //handle effect for change in added or remove properties
  useEffect(() => {
    const { categoryProperties } = form;
    setAdded(getAdded(categoryProperties, current));
    setRemoved(getRemoved(categoryProperties, current));
  }, [form, current]);

  //handle form submission
  const collection = "categories";
  const handleSubmit = event => {
    event.preventDefault();
    if (form.categoryProperties.length) {
      if (edit) {
        //extract ids of added properties
        const AddedPropertyIds = added.map(property => ({
          propertyId: property.id
        }));
        const dbForm = { ...form, categoryProperties: AddedPropertyIds };
        //dispatch update
        dispatch(update(collection)(dbForm));
        //subCollection items to delete
        const subCollection = "categoryProperties";
        getRemovedIds(removed, ordered.categoryProperties).forEach(item => {
          //dispatch delete
          dispatch(remove(subCollection)(item));
        });
      } else {
        //extract ids of add properties
        const propertyIds = form.categoryProperties.map(property => ({
          propertyId: property.id
        }));
        dispatch(add(collection)({ ...form, categoryProperties: propertyIds }));
      }
    } else {
      alert.show("Please add at least one property value", { type: "info" });
    }
  };

  const [propertyEdit, setAddPropertyEdit] = useState(false);

  const formInputs = (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <TextField
          id="name"
          name="name"
          label="Category name"
          fullWidth
          placeholder="Enter property name, e.g. Shoes, Drinks, Electronics, ....  "
          value={form.name}
          onChange={handleChange}
          required
        />
      </Grid>

      <Grid item xs={12}>
        <FormControl className={classes.formControl}>
          <Grid container spacing={2}>
            <Grid item md={9}>
              <InputLabel id="demo-mutiple-chip-label">Properties</InputLabel>
              <Select
                labelId="demo-mutiple-chip-label"
                id="demo-mutiple-chip"
                multiple
                fullWidth
                value={form.categoryProperties || []}
                name="categoryProperties"
                onChange={handleChange}
                input={<Input id="select-multiple-chip" />}
                renderValue={selected => (
                  <div className={classes.chips}>
                    {selected.map(value => {
                      console.log("value", value, "delete", removed);
                      return (
                        <Chip
                          key={value.name}
                          label={value.name}
                          className={classes.chip}
                        />
                      );
                    })}
                  </div>
                )}
                MenuProps={MenuProps}
              >
                {allProperties?.map(property => (
                  <MenuItem
                    key={property.id}
                    value={property}
                    style={getStyles(
                      { removed, added },
                      property,
                      form.categoryProperties,
                      theme
                    )}
                  >
                    {property.name}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item md={3}>
              <Fab
                size="small"
                color="primary"
                aria-label="add"
                className={classes.margin}
                onClick={() => {
                  setAddPropertyEdit(true);
                }}
              >
                <AddIcon />
              </Fab>
            </Grid>
          </Grid>
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
      <PropertyEdit
        setOpen={value => setAddPropertyEdit(value)}
        open={propertyEdit}
      />
    </React.Fragment>
  );
};
export default CategoryEdit;
