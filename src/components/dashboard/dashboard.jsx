import React, { useState, useEffect, Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useSnackbar } from "notistack";
import { Product } from "components/product/index";
import { Category } from "components/category/index";
import { Property } from "components/property/index";
import { StoreTabs } from "components/store/index";
import { signOut } from "actions/authActions";

import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";
import Order from "components/order/Order";

const drawerWidth = 240;

const a11yProps = index => {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`
  };
};

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex"
  },
  drawer: {
    [theme.breakpoints.up("lg")]: {
      width: drawerWidth,
      flexShrink: 0
    }
  },
  appBar: {
    [theme.breakpoints.up("lg")]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth
    }
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("lg")]: {
      display: "none"
    }
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(1)
  }
}));

const TabPanel = props => {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && <Fragment p={1}>{children}</Fragment>}
    </Typography>
  );
};

const Dashboard = props => {
  const { container } = props;
  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  //redux
  const dispatch = useDispatch();

  //tab changes
  const tabLabels = ["Orders", "Store"];
  const tabs = [
    { label: "Orders", comp: <Order /> },
    { label: "Store", comp: <StoreTabs /> }
  ];
  const [current, setCurrent] = useState(0);
  const [title, setTitle] = useState(tabLabels[0]);
  const handleChange = (event, newValue) => {
    setTitle(tabLabels[newValue]);
    setCurrent(newValue);
  };

  //snack bar for sign up alerts
  const signedOut = useSelector(state => state.authReducer.signedOut);
  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    signedOut &&
      enqueueSnackbar("Signed out", {
        variant: "info",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right"
        }
      });
  }, [signedOut]);

  const drawer = (
    <div>
      <div className={classes.toolbar} />
      <Divider />
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={current}
        onChange={handleChange}
        aria-label="Vertical tabs example"
        className={classes.tabs}
      >
        {tabs.map(({ label }, index) => {
          return <Tab label={label} key={index} {...a11yProps(index)} />;
        })}
      </Tabs>

      <Divider />
      <Button
        onClick={() => {
          dispatch(signOut());
        }}
      >
        Sign out
      </Button>
    </div>
  );

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            {title}
          </Typography>
        </Toolbar>
      </AppBar>
      <nav className={classes.drawer} aria-label="mailbox folders">
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Hidden lgUp implementation="css">
          <Drawer
            container={container}
            variant="temporary"
            anchor={theme.direction === "rtl" ? "right" : "left"}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            onClick={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper
            }}
            ModalProps={{
              keepMounted: true // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden mdDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper
            }}
            variant="permanent"
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        {tabs.map(({ comp }, index) => {
          return (
            <TabPanel value={current} index={index}>
              {comp}
            </TabPanel>
          );
        })}
      </main>
    </div>
  );
};

export default Dashboard;
