import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Grid,
  TextField,
  DialogContent,
  DialogTitle,
  CircularProgress,
  Box,
  DialogActions,
  Button,
  Dialog,
  IconButton,
  ButtonBase,
  Fab
} from "@material-ui/core";
import SaveIcon from "@material-ui/icons/Save";
import CloseIcon from "@material-ui/icons/Close";
import ListIcon from "@material-ui/icons/List";

import useMediaQuery from "@material-ui/core/useMediaQuery";
import { useTheme } from "@material-ui/core/styles";

import { makeStyles } from "@material-ui/core/styles";

import { KeyboardDateTimePicker } from "@material-ui/pickers";

import { updateDetails, fillOrder, clearOrder } from "actions/orderActions";

import OrderProducts from "./OrderProducts";

import { add, update } from "actions/populateActions";

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
  }
}));

const OrderEdit = ({ edit, setEdit }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const { id, details, orderProducts } = useSelector(
    state => state.orderReducer
  );
  console.log("details", details, "products", orderProducts);

  const handleUpdateDetails = event => {
    dispatch(updateDetails({ [event.target.name]: event.target.value }));
  };

  const handleDateChange = ({ _d }) => {
    dispatch(updateDetails({ date: _d.toString() }));
  };

  const [productsOpen, setproductsOpen] = useState(false);

  const handleSubmit = event => {
    event.preventDefault();
    const collection = "orders";
    const order = { details, orderProducts };
    console.log("order to sub", order);
    dispatch(add(collection)(order));
  };

  const formInputs = (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <TextField
          id="customer_name"
          name="customerName"
          label="Customer's name"
          fullWidth
          placeholder="Enter Customer name "
          value={details.customerName}
          onChange={handleUpdateDetails}
          required
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          id="customer_address"
          name="customerAddress"
          label="Customer's address"
          fullWidth
          placeholder="Enter Customer address "
          value={details.customerAddress}
          onChange={handleUpdateDetails}
        />
        <Grid item xs={12}>
          <KeyboardDateTimePicker
            margin="normal"
            id="time-picker"
            label="Order Date & Time"
            value={details.date}
            onChange={handleDateChange}
            KeyboardButtonProps={{
              "aria-label": "change time"
            }}
            //readOnly
          />
        </Grid>
      </Grid>
    </Grid>
  );

  return (
    <React.Fragment>
      <Dialog
        fullScreen={fullScreen}
        open={edit}
        scroll={"paper"}
        onClose={() => {
          setEdit(false);
        }}
        aria-labelledby="responsive-dialog-title"
      >
        {!edit ? (
          <CircularProgress />
        ) : (
          <form
            className={classes.root}
            onSubmit={handleSubmit}
            autoComplete="off"
            validate
          >
            <DialogTitle id="scroll-dialog-title">
              {edit ? "Update " : "Add "}
              {"Order"}
            </DialogTitle>
            <DialogContent dividers={true}>
              {formInputs}
              <Box className={classes.center}>{<CircularProgress />}</Box>
              <Fab
                variant="extended"
                color="primary"
                aria-label="add"
                onClick={() => {
                  setproductsOpen(true);
                }}
              >
                <ListIcon className={classes.extendedIcon} />
                Order product list
              </Fab>
            </DialogContent>
            <DialogActions>
              {
                <Button
                  variant="contained"
                  color="light"
                  className={classes.button}
                  onClick={() => {
                    setEdit(false);
                  }}
                  startIcon={<CloseIcon />}
                >
                  Close
                </Button>
              }
              <Button
                variant="contained"
                color="primary"
                className={classes.button}
                type="submit"
                disabled={""}
                startIcon={<SaveIcon />}
              >
                {id ? "Update" : "Save"}
              </Button>
            </DialogActions>
          </form>
        )}
      </Dialog>
      <OrderProducts open={productsOpen} setOpen={setproductsOpen} />
    </React.Fragment>
  );
};

export default OrderEdit;
