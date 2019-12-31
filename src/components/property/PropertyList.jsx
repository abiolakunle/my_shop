import React, { Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import { remove } from "actions/populateActions";

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
  CircularProgress
} from "@material-ui/core";
import Avatar from "react-avatar";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";

const PropertyList = props => {
  useFirestoreConnect([{ collection: "properties" }]);
  const { status, ordered, data } = useSelector(
    state => state.firestoreReducer
  );
  const store = useSelector(state => state.firestoreReducer);

  const dispatch = useDispatch();
  const collection = "properties";
  return (
    <div>
      Property List
      <div>
        <List dense={true}>
          {!data.properties &&
            !status?.requesting.properties &&
            "No properties to display, are you offline?"}
          {!status?.requested.properties && <CircularProgress />}
          {status?.requested.properties &&
            ordered.properties.map((item, index) => {
              return (
                <Fragment>
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
                      <IconButton
                        onClick={event => {
                          event.preventDefault();
                          props.setEdit(item);
                        }}
                        edge="end"
                        aria-label="edit"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={event => {
                          event.preventDefault();
                          dispatch(remove(collection)(item));
                        }}
                        edge="end"
                        aria-label="delete"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </Fragment>
              );
            })}
        </List>
      </div>
    </div>
  );
};

export default PropertyList;
