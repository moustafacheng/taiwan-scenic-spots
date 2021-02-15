import "./App.css";
import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import "./components/ScenicSpot";
import ScenicSpot from "./components/ScenicSpot";
//The list of Cities and Counties are imported from cities.json
import cities from "./constants/cities.json";

const cityList = cities.filter((city) => {
  return city.type === "city";
});
const countyList = cities.filter((county) => {
  return county.type === "county";
});
const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(3),
  },
}));

function App() {
  const classes = useStyles();

  return (
    <Router>
      <div className={classes.root}>
        <Drawer
          className={classes.drawer}
          variant="permanent"
          classes={{
            paper: classes.drawerPaper,
          }}
          anchor="left"
        >
          <div className={classes.toolbar} />
          <List>
            <Link to="/scenicSpot" style={{ textDecoration: "none" }}>
              <ListItem button key="全部">
                <ListItemText primary="全部" />
              </ListItem>
            </Link>
          </List>
          <Divider />
          <List>
            {/* Map all cities here */}
            {cityList.map((city) => (
              <Link
                to={`/scenicSpot/${city.en}`}
                style={{ textDecoration: "none" }}
              >
                <ListItem button key={city.zh}>
                  <ListItemText primary={city.zh} />
                </ListItem>
              </Link>
            ))}
          </List>
          <Divider />
          <List>
            {/* Map all counties here */}
            {countyList.map((county) => (
              <Link
                to={`/scenicSpot/${county.en}`}
                style={{ textDecoration: "none" }}
              >
                <ListItem button key={county.zh}>
                  <ListItemText primary={county.zh} />
                </ListItem>
              </Link>
            ))}
          </List>
        </Drawer>
        <main className={classes.content}>
          <div className={classes.toolbar} />
          <Switch>
            {/* All classifications share the same component which is ScenicSpot. The path name is passed down using useParams of React Router. */}
            {/* If there is a city name passed down, scenic spots of that specific city will be displayed. */}
            {/* If no city name is passed down, all scenic spots will be displayed. */}
            <Route
              exact
              path="/scenicSpot"
              component={ScenicSpot}
              key="main"
            ></Route>
            <Route
              path="/scenicSpot/:cityName"
              component={ScenicSpot}
              key="city"
            ></Route>
          </Switch>
        </main>
      </div>
    </Router>
  );
}

export default App;
