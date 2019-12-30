import React from "react";
import { useSelector } from "react-redux";

import { useFirestoreConnect } from "react-redux-firebase";
import {
  ListItemSecondaryAction,
  ListItem,
  List,
  IconButton,
  ListItemText,
  ListItemAvatar,
  Avatar as MaterialAvatar
} from "@material-ui/core";
import Avatar from "react-avatar";
import EditIcon from "@material-ui/icons/Edit";

const PropertyList = props => {
  useFirestoreConnect([{ collection: "properties" }]);
  const { status, ordered } = useSelector(state => state.firestoreReducer);
  console.log("FireStore", ordered, status);

  return (
    <div>
      Property List
      <div>
        {Object.entries(status.requested).length &&
          status.requested.properties &&
          ordered.properties.map((item, index) => {
            return (
              <List dense={true}>
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
                  </ListItemSecondaryAction>
                </ListItem>
              </List>
            );
          })}
      </div>
    </div>
  );
};

export default PropertyList;
