import React, { useEffect, useState, useMemo } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { getAllCityScenes, getCityScenes } from "../services";
import { useParams } from "react-router-dom";
import useInfiniteScroll from "react-infinite-scroll-hook";
import CssBaseline from "@material-ui/core/CssBaseline";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import cities from "../constants/cities.json";
import Skeleton from "@material-ui/lab/Skeleton";
const useStyles = makeStyles({
  root: {
    minWidth: 275,
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});

export default function ScenicSpot(props) {
  const { cityName } = useParams();
  const [hasNextPage, setHasNextPage] = useState(true);
  const [loading, setLoading] = useState(false);
  const [scenes, setScenes] = useState([]);
  const classes = useStyles();
  const [page, setPage] = useState(0);
  //   const [lastPage, setLastPage] = useState(false);
  const pageNum = useMemo(() => page * 30, [page]);

  // Gets the current path name, filters the cities list and finds its corresponding chinese name and have it displayed as title.
  // e.g. if the path name is "Taipei", "臺北市" will be returned.
  function showCityName() {
    const thisCity = cities.filter((city) => {
      return city.en === cityName;
    });
    const thisCityZh = thisCity[0].zh;
    return thisCityZh;
  }
  // Page number is added by 1 each time the bottom page is reached.
  function handleLoadMore() {
    // setLoading(true);
    setPage(page + 1);
  }

  const infiniteRef = useInfiniteScroll({
    loading,
    hasNextPage,
    threshold: 10,
    checkInterval: 1000,
    onLoadMore: handleLoadMore,
    scrollContainer: "window",
  });

  // Each time the page number changes(increases), an api will be called to get the next 30 scenic spots.
  useEffect(() => {
    if (page !== 0 && !loading) {
      setLoading(true);

      (async () => {
        try {
          let payload;
          // Determines which api to call depending on the existence of cityName
          if (cityName) {
            payload = await getCityScenes(pageNum, cityName);
          } else {
            payload = await getAllCityScenes(pageNum);
          }
          if (payload && payload.length) {
            // Adds the 30 scenic spots to the existing list of spots
            setScenes([...scenes, ...payload]);
            setLoading(false);
          } else {
            console.log("Failed to load more");
            // Turns hasNextPage to false, so that each time the bottom of the page is reached, page count will not increase, so that further api calls will not occur.
            setHasNextPage(false);
            setLoading(false);
          }
        } catch (e) {
          setLoading(false);
          console.log(e);
        }
      })();
    }
    console.log(scenes);
  }, [pageNum]);

  useEffect(() => {
    // Executed when the route(cityName) is changed
    setHasNextPage(true);
    setLoading(true);
    (async () => {
      try {
        // Determines which api to call depending on the existence of cityName
        let payload;
        if (cityName) {
          payload = await getCityScenes(pageNum, cityName);
        } else {
          payload = await getAllCityScenes(pageNum);
        }

        if (payload && payload.length) {
          // Scenic spots are put into the "Scenes" array.
          setScenes(payload);
          setLoading(false);
        } else {
          setLoading(false);
        }
      } catch (e) {
        setLoading(false);
        console.log(e);
      }
    })();
  }, [cityName]);

  return (
    <div ref={infiniteRef}>
      <CssBaseline />
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" noWrap style={{ marginLeft: 240 }}>
            {/* Title will change according to the path name */}
            {cityName ? showCityName() : "全部"}
          </Typography>
        </Toolbar>
      </AppBar>
      {scenes.length ? (
        scenes.map((scene) => {
          return (
            <div key={scene.ID}>
              <Card className={classes.root}>
                <CardContent>
                  <Typography
                    className={classes.title}
                    color="textSecondary"
                    gutterBottom
                  >
                    {scene.City}
                  </Typography>
                  <Typography variant="h5" component="h2">
                    {scene.Name}
                  </Typography>
                  <Typography className={classes.pos} color="textSecondary">
                    {scene.OpenTime}
                  </Typography>
                  <Typography variant="body2" component="p">
                    {scene.Description}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small">Learn More</Button>
                </CardActions>
              </Card>

              <br />
            </div>
          );
        })
      ) : (
        //   Simple skeleton animations while loading
        <Typography variant="h1">
          <Skeleton animation="wave" />
        </Typography>
      )}
      {loading ? <Skeleton animation="wave" /> : <div></div>}
    </div>
  );
}
