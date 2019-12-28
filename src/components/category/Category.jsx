import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";

import CategoryList from "./CategoryList";
import CategoryEdit from "./CategoryEdit";

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

const Category = () => {
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
            <CategoryList setEdit={setItemEdit} />
          </Paper>
        </Grid>
        <Grid item xs={6}>
          <Paper className={classes.paper}>
            <CategoryEdit edit={edit} />
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default Category;
