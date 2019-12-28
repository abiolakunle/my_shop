import React, { useState } from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import { makeStyles } from "@material-ui/core/styles";
import ChipInput from "material-ui-chip-input";
import { Button } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  chipInput: { minWidth: 300 },
  buttons: {
    display: "flex",
    justifyContent: "flex-end"
  },
  button: {
    marginTop: theme.spacing(4),
    marginLeft: theme.spacing(1)
  }
}));

const PropertyEdit = () => {
  const classes = useStyles();

  const [form, setForm] = useState({
    name: "",
    values: []
  });

  const onAdd = chip => {
    setForm({ ...form, values: [...form.values, chip] });
    console.log("Props form", form);
  };

  const onDelete = (chip, index) => {
    const newValues = form.values
      .slice(0, index)
      .concat(form.values.slice(index + 1));
    setForm({ ...form, values: [...newValues] });
    console.log("Props form", form);
  };

  const handleChange = event => {
    setForm({ ...form, [event.target.name]: event.target.value });
    console.log("Props form", form);
  };

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Property form
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            id="name"
            name="name"
            label="Property name"
            fullWidth
            placeholder="Enter property name, e.g. Color "
            values={form.name}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <ChipInput
            className={classes.chipInput}
            helperText="Type value, hit enter to type another"
            value={form.values}
            onAdd={onAdd}
            onDelete={onDelete}
            placeholder="Enter values for property, e.g. Red"
            fullWidth
          />
        </Grid>
      </Grid>
      <Button variant="contained" color="primary" className={classes.button}>
        Add
      </Button>
    </React.Fragment>
  );
};
export default PropertyEdit;
