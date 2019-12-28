import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";

import ProductList from "./ProductList";
import ProductEdit from "./ProductEdit";

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary
  }
}));

const Product = () => {
  const classes = useStyles();
  const [edit, setEdit] = useState({ name: "Football" });

  const setItemEdit = item => {
    setEdit(item);
  };
  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <Paper className={classes.paper}>
            <ProductList setEdit={setItemEdit} />
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper className={classes.paper}>
            <ProductEdit edit={edit} />
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default Product;
