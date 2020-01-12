import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { resetPopulate } from "actions/populateActions";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import AddIcon from "@material-ui/icons/Add";

import ProductEdit from "./ProductEdit";
import ProductList from "./ProductList";
import { Fab } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    position: "relative"
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
    paddingBottom: theme.spacing(12)
  },
  fab: {
    position: "absolute",
    bottom: theme.spacing(3),
    right: theme.spacing(3)
  }
}));

const Product = () => {
  const classes = useStyles();
  const [edit, setEdit] = useState();
  const [openEdit, setOpenEdit] = useState(false);

  const dispatch = useDispatch();
  const openAndEdit = edit => {
    dispatch(resetPopulate());
    setEdit(edit);
    setOpenEdit(true);
  };

  return (
    <div className={classes.root}>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <ProductList edit={edit} setEdit={openAndEdit} />
          </Paper>
        </Grid>
        <Fab
          color="secondary"
          aria-label="add"
          className={classes.fab}
          onClick={() => {
            dispatch(resetPopulate());
            setOpenEdit(true);
          }}
        >
          <AddIcon />
        </Fab>
        {openEdit && (
          <ProductEdit
            open={openEdit}
            setOpen={setOpenEdit}
            edit={edit}
            setEdit={setEdit}
          />
        )}
      </Grid>
    </div>
  );
};

export default Product;
