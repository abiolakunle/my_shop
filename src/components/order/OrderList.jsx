import React, { useState, useEffect, Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getAll } from "actions/readActions";

import { resetPopulate } from "actions/populateActions";

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
  ButtonBase
} from "@material-ui/core";
import Avatar from "react-avatar";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";

const ListButton = ({ children, ...rest }) => {
  return (
    <ButtonBase style={{ "border-radius": "50%" }} {...rest}>
      <IconButton style={{ "pointer-events": "none" }}>
        {React.cloneElement(children, { style: { "pointer-events": "none" } })}
      </IconButton>
    </ButtonBase>
  );
};

const OrderList = props => {
  const dispatch = useDispatch();
  const { data } = useSelector(state => state.readReducer);

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    dispatch(getAll("orders")(["orderProducts"]));
  }, []);

  console.log("orders", data);
  useEffect(() => {
    setOrders(data);
  }, [data]);

  return (
    <div>
      Order List
      <div
        onClick={event => {
          const dataAction = event.target.getAttribute("data-action");
          const id = event.target.getAttribute("data-id");

          switch (dataAction) {
            case "delete":
              dispatch(resetPopulate());
              //deleteDialog(ordered.properties[id]);
              break;
            case "edit":
              dispatch(resetPopulate());
              //props.setEdit(ordered.properties[id]);
              break;
            default:
          }
        }}
      >
        <List dense={true}>
          {orders?.map((item, index) => {
            return (
              <Fragment key={index}>
                <ListItem>
                  <ListItemAvatar>
                    <MaterialAvatar>
                      <Avatar name={item.details.customerName[0]} />
                    </MaterialAvatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={item.details.customerName}
                    // secondary={""}
                  />
                  <ListItemSecondaryAction>
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
        {/* {deleteItem && (
          <DeleteDialog
            item={deleteItem}
            open={!!deleteItem}
            handleClose={deleteDialog}
          />
        )} */}
      </div>
    </div>
  );
};

export default OrderList;
