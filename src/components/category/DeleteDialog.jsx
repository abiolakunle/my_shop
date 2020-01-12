import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useAlert } from "react-alert";
import { remove } from "actions/populateActions";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { useFirestoreConnect } from "react-redux-firebase";
import { CircularProgress } from "@material-ui/core";

const AlertDialog = ({ open, handleClose, item }) => {
  const collection = "categories";
  useFirestoreConnect([
    {
      collection: "categoryProperties",
      where: ["categoryId", "==", item?.id || ""]
    }
  ]);

  //redux
  const dispatch = useDispatch();
  const { ordered } = useSelector(state => state.firestoreReducer);
  const { sending, sent, error, message } = useSelector(
    state => state.populateReducer
  );
  const alert = useAlert();
  useEffect(() => {
    if (sent || error) {
      alert.show(message, { type: error ? "error" : "success" });
      sent && handleClose();
    }
  }, [sent, error, message]);

  const handleDelete = () => {
    const toDelete = {
      ...item,
      categoryProperties: ordered.categoryProperties
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
          <Button
            onClick={handleDelete}
            color="primary"
            disabled={!!!ordered.categoryProperties || sending}
            autoFocus
          >
            Delete
          </Button>
          {(!!!ordered.categoryProperties || sending) && (
            <CircularProgress size={20} />
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
};
export default AlertDialog;
