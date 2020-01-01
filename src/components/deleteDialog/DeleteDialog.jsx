import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { remove } from "actions/populateActions";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { useFirestoreConnect } from "react-redux-firebase";

const AlertDialog = ({ open, handleClose, item }) => {
  const collection = "properties";
  useFirestoreConnect([
    {
      collection: "propertyValues",
      where: ["propertyId", "==", item?.id || ""]
    }
  ]);

  //redux
  const dispatch = useDispatch();
  const { status, ordered, data } = useSelector(
    state => state.firestoreReducer
  );

  const handleDelete = () => {
    const toDelete = {
      ...item,
      propertyValues: ordered.propertyValues
    };
    dispatch(remove(collection)(toDelete));
  };

  return (
    <div>
      <Dialog
        open={open}
        //onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Delete"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {`Are you sure you want to delete ${item.name} from ${collection}?`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="primary" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
export default AlertDialog;
