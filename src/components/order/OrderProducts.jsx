import React, { Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import { editProduct, addProduct, removeProduct } from "actions/orderActions";
import MaterialTable, { MTableBodyRow } from "material-table";

import { makeStyles, withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";
import { TableRow, TableCell } from "@material-ui/core";

//Add material icons to your html
//<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">

const useStyles = makeStyles(theme => ({
  appBar: {
    position: "relative"
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1
  }
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const StyledTableCell = withStyles(theme => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white
  },
  body: {
    fontSize: 14
  }
}))(TableCell);

const OrderProducts = ({ open, setOpen }) => {
  const classes = useStyles();
  const { orderProducts } = useSelector(state => state.orderReducer);
  const dispatch = useDispatch();

  const withExtendedPrice = products => {
    return products.map(prod => ({
      ...prod,
      extendedPrice: prod.quantity * prod.price
    }));
  };

  const columns = [
    { title: "Name", field: "name", editable: "never" },
    { title: "Quantity", field: "quantity", type: "numeric" },
    { title: "Unit", field: "unit" },
    { title: "Unit Price", field: "price", type: "numeric" },
    {
      title: "Extended Price",
      field: "extendedPrice",
      type: "numeric",
      editable: "never"
    }
  ];

  const handleProductUpdate = ({ extendedPrice, ...rest }, oldData) => {
    return new Promise((resolve, reject) => {
      oldData && dispatch(editProduct({ ...rest }));
      resolve();
    });
  };

  const handleProductDelete = oldData => {
    return new Promise((resolve, reject) => {
      dispatch(removeProduct(oldData.id));
      resolve();
    });
  };

  const handleOpened = () => {
    setOpen(false);
  };

  const editable = {
    //onRowAdd: handleAddProduct,
    onRowUpdate: handleProductUpdate,
    onRowDelete: handleProductDelete
  };

  const calcTotal = products => {
    return products.reduce(
      (prev, { price, quantity }) => (prev += price * quantity),
      0
    );
  };

  const row = (props, products) => {
    console.log("Row", props, "length", "index", props.index);
    const { data } = props;

    const mtableRow = <MTableBodyRow {...props} key={data.id}></MTableBodyRow>;
    return products.length - 1 === props.index ? (
      <Fragment>
        {mtableRow}
        <TableRow>
          <TableCell colSpan={4} />
          <StyledTableCell align="right">Total</StyledTableCell>
          <StyledTableCell align="right">{calcTotal(products)}</StyledTableCell>
        </TableRow>
      </Fragment>
    ) : (
      mtableRow
    );
  };

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={handleOpened}
      TransitionComponent={Transition}
    >
      <AppBar className={classes.appBar}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleOpened}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Order products
          </Typography>
        </Toolbar>
      </AppBar>
      <MaterialTable
        title="Products in current order"
        columns={columns}
        data={withExtendedPrice(orderProducts)}
        editable={editable}
        components={{
          Row: props => row(props, orderProducts)
        }}
        options={{ add: false, exportButton: true }}
      />
    </Dialog>
  );
};

export default OrderProducts;
