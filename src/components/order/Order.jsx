import React, { useState, Fragment } from "react";
import { OrderList, OrderEdit } from ".";
import { Fab, Grid, Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import EditIcon from "@material-ui/icons/Edit";
import OrderProducts from "./OrderProducts";

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

const Order = () => {
  const classes = useStyles();
  const [edit, setEdit] = useState(false);

  return (
    <Fragment>
      <div className={classes.root}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <OrderList />
            </Paper>
          </Grid>
        </Grid>

        <OrderEdit edit={edit} setEdit={setEdit} />
        <OrderProducts />
        <Fab
          className={classes.fab}
          color="secondary"
          aria-label="edit"
          onClick={() => {
            setEdit(true);
          }}
        >
          <EditIcon />
        </Fab>
      </div>
    </Fragment>
  );
};

export default Order;
