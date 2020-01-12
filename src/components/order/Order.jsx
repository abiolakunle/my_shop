import React, { useState } from "react";
import { OrderList, OrderEdit } from ".";
import { Fab } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import EditIcon from "@material-ui/icons/Edit";
import OrderProducts from "./OrderProducts";

const useStyles = makeStyles(theme => ({
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
    <div>
      Order
      <OrderList />
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
  );
};

export default Order;
