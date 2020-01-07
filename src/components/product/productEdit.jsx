import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useFirestoreConnect } from "react-redux-firebase";
import { useAlert } from "react-alert";
import { add, update, remove } from "actions/populateActions";

import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
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
  Fab,
  Input,
  Chip,
  MenuItem,
  FormHelperText
} from "@material-ui/core";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";

import ProductPropertyEdit from "./ProductPropertyEdit";
import CategoryEdit from "components/category/CategoryEdit";

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

const ProductEdit = ({ edit, setEdit, open, setOpen }) => {
  const classes = useStyles();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("xs"));

  //redux
  const dispatch = useDispatch();

  const initialFormState = { name: "", categoryId: "" };
  //form state management
  const [form, setForm] = useState(initialFormState);
  console.log("form", form);

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
      collection: "productPropertyValues",
      where: ["productId", "==", edit?.id || ""]
    },
    {
      collection: "categories"
    }
  ]);
  //get ordered data from firestore reducer
  const { ordered, data } = useSelector(state => state.firestoreReducer);
  const { categories, productPropertyValues } = ordered;

  //set productPropertyValue
  useEffect(() => {
    edit && setForm({ ...edit, productPropertyValues });
  }, [edit, productPropertyValues]);

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

  //handle form submission
  const collection = "products";
  const handleSubmit = event => {
    event.preventDefault();
    if (edit) {
      // //extract ids of added properties
      // const AddedPropertyIds = added.map(property => ({
      //   propertyId: property.id
      // }));
      // const dbForm = { ...form, categoryProperties: AddedPropertyIds };
      // //dispatch update
      // dispatch(update(collection)(dbForm));
      // //subCollection items to delete
      // const subCollection = "categoryProperties";
      // getRemovedIds(removed, ordered.categoryProperties).forEach(item => {
      //   //dispatch delete
      //   dispatch(remove(subCollection)(item));
      //});
      dispatch(update(collection)(form));
    } else {
      dispatch(add(collection)(form));
      //functionsAdd(form);
    }
  };

  const [addCat, setAddCat] = useState(false);

  const formInputs = (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <TextField
          id="name"
          name="name"
          label="product name"
          fullWidth
          placeholder="Enter product name, e.g. Hp 630, Ipone 11 pro max, Nike air max 720, ....  "
          value={form.name}
          onChange={handleChange}
          required
        />
      </Grid>

      <Grid item xs={12}>
        <FormControl className={classes.formControl}>
          <InputLabel shrink id="demo-simple-select-placeholder-label-label">
            Category
          </InputLabel>

          <Grid container spacing={2}>
            <Grid item md={10}>
              <Select
                labelId="demo-simple-select-placeholder-label-label"
                id="demo-simple-select-placeholder-label"
                value={form.categoryId}
                name="categoryId"
                onChange={handleChange}
                className={classes.selectEmpty}
                fullWidth
              >
                {categories?.map(category => (
                  <MenuItem
                    //selected={form.categoryId === category.id}
                    value={category.id}
                  >
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>
                Select suitable category for this product
              </FormHelperText>
            </Grid>
            <Grid md={2} item>
              <Fab
                size="small"
                color="primary"
                aria-label="add"
                className={classes.margin}
                onClick={() => {
                  setAddCat(true);
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
        {edit && !data.categories ? (
          <CircularProgress />
        ) : (
          <form
            className={classes.root}
            onSubmit={handleSubmit}
            autoComplete="off"
          >
            <DialogTitle id="scroll-dialog-title">
              {edit ? "Edit " : "Add "}
              {"Product"}
            </DialogTitle>
            <DialogContent dividers={true}>
              {formInputs}
              {form.categoryId && (
                <ProductPropertyEdit
                  propertyValues={productPropertyValues}
                  categoryId={form.categoryId}
                  form={form}
                  setForm={setForm}
                />
              )}
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
        <CategoryEdit setOpen={value => setAddCat(value)} open={addCat} />
      </Dialog>
    </React.Fragment>
  );
};

export default ProductEdit;
