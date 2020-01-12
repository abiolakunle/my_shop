import React, { Fragment, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addProduct, removeProduct } from "actions/orderActions";
import DeleteDialog from "./DeleteDialog";
import { resetPopulate, remove } from "actions/populateActions";

import { useFirestoreConnect } from "react-redux-firebase";
import {
  ListItemSecondaryAction,
  ListItem,
  List,
  Divider,
  IconButton,
  ListItemText,
  ListItemAvatar,
  Avatar as MaterialAvatar,
  CircularProgress,
  ButtonBase,
  ButtonGroup
} from "@material-ui/core";
import Avatar from "react-avatar";
import EditIcon from "@material-ui/icons/Edit";
import AddShoppingCartIcon from "@material-ui/icons/AddShoppingCart";
import RemoveShoppingCartIcon from "@material-ui/icons/RemoveShoppingCart";
import DeleteIcon from "@material-ui/icons/Delete";

const ListButton = ({ children, ...rest }) => {
  return (
    <ButtonBase style={{ "border-radius": "50%" }} {...rest}>
      <IconButton style={{ "pointer-events": "none" }}>
        {React.cloneElement(children, {
          ...rest,
          style: { "pointer-events": "none" }
        })}
      </IconButton>
    </ButtonBase>
  );
};

const ProductList = props => {
  useFirestoreConnect([{ collection: "products" }]);
  const { status, ordered, data } = useSelector(
    state => state.firestoreReducer
  );

  const dispatch = useDispatch();

  const [deleteItem, setDeleteItem] = useState(undefined);
  const deleteDialog = item => {
    setDeleteItem(deleteItem ? undefined : item);
  };

  const doListAction = event => {
    const dataAction = event.target.getAttribute("data-action");
    const itemId = event.target.getAttribute("data-id");
    switch (dataAction) {
      case "delete":
        dispatch(resetPopulate());
        deleteDialog(ordered.products[itemId]);
        break;
      case "edit":
        dispatch(resetPopulate());
        props.setEdit(undefined);
        props.setEdit(ordered.products[itemId]);
        break;
      case "order-add":
        const { id, name } = ordered.products[itemId];
        dispatch(
          addProduct({ id, name, quantity: "1", unit: "piece(s)", price: "0" })
        );
        break;
      case "order-remove":
        dispatch(removeProduct(ordered.products[itemId].id));
        break;
      default:
    }
  };

  //order
  const { orderProducts } = useSelector(state => state.orderReducer);

  return (
    <div>
      Product List
      <div onClick={doListAction}>
        <List dense={true}>
          {!data.products &&
            !status?.requesting.products &&
            "No products to display, are you offline?"}
          {!status?.requested.products && <CircularProgress />}
          {status?.requested.products &&
            ordered.products.map((item, index) => {
              return (
                <Fragment key={index}>
                  <ListItem dense>
                    <ListItemAvatar>
                      <MaterialAvatar>
                        <Avatar name={item.name[0]} />
                      </MaterialAvatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={item.name}
                      // secondary={""}
                    />
                    <ListItemSecondaryAction>
                      {orderProducts.map(p => p.id).includes(item.id) ? (
                        <ListButton
                          color="primary"
                          aria-label="remove from order"
                          data-action="order-remove"
                          edge="end"
                          data-id={index}
                        >
                          <RemoveShoppingCartIcon />
                        </ListButton>
                      ) : (
                        <ListButton
                          color="primary"
                          aria-label="add to order"
                          data-action="order-add"
                          edge="end"
                          data-id={index}
                        >
                          <AddShoppingCartIcon />
                        </ListButton>
                      )}

                      <ListButton
                        data-action="edit"
                        edge="end"
                        aria-label="edit"
                        data-id={index}
                      >
                        <EditIcon />
                      </ListButton>
                      <ListButton
                        data-action="delete"
                        edge="end"
                        aria-label="delete"
                        data-id={index}
                      >
                        <DeleteIcon />
                      </ListButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </Fragment>
              );
            })}
        </List>
        {deleteItem && (
          <DeleteDialog
            item={deleteItem}
            open={!!deleteItem}
            handleClose={deleteDialog}
          />
        )}
      </div>
    </div>
  );
};

export default ProductList;
