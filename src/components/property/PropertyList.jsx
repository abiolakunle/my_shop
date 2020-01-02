import React, { Fragment, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import DeleteDialog from "components/deleteDialog/DeleteDialog";
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

const PropertyList = props => {
  useFirestoreConnect([{ collection: "properties" }]);
  const { status, ordered, data } = useSelector(
    state => state.firestoreReducer
  );

  const dispatch = useDispatch();

  const [deleteItem, setDeleteItem] = useState(undefined);
  const deleteDialog = item => {
    setDeleteItem(deleteItem ? undefined : item);
  };
  return (
    <div>
      Property List
      <div
        onClick={event => {
          const dataAction = event.target.getAttribute("data-action");
          const id = event.target.getAttribute("data-id");
          dispatch(resetPopulate());
          switch (dataAction) {
            case "delete":
              deleteDialog(ordered.properties[id]);
              break;
            case "edit":
              props.setEdit(ordered.properties[id]);
              break;
            default:
          }
        }}
      >
        <List dense={true}>
          {!data.properties &&
            !status?.requesting.properties &&
            "No properties to display, are you offline?"}
          {!status?.requested.properties && <CircularProgress />}
          {status?.requested.properties &&
            ordered.properties.map((item, index) => {
              return (
                <Fragment key={index}>
                  <ListItem>
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

export default PropertyList;
