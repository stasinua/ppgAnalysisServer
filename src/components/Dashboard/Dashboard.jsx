import React from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

import Paper from "@material-ui/core/Paper";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import Avatar from "@material-ui/core/Avatar";

import avatarImage from "../../assets/img/user-icon.png";
import backgroundImage from "../../assets/img/background.jpg";
import LineChart from "../LineChart";

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData("ppg_scan_153457394", 159, 111, 120, 4.0),
  createData("ppg_scan_123782378", 122, 150, 89, 4.3),
  createData("ppg_scan_178439048", 89, 96, 90, 6.0),
  createData("ppg_scan_129445766", 72, 78, 67, 4.3),
  createData("ppg_scan_115464577", 66, 58, 62, 3.9)
];

export default class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      latestBPM: [90, 64, 82, 77, 72, 69, 87],
      name: "Test",
      uniqueIdentifier: "Subject",
      currentPPGData: []
    };
  }

  componentDidMount() {
    this.props.getUserScans(this.props.userId);
  }

  componentWillReceiveProps(newProps) {
    if (this.props.userId !== newProps.userId) {
      this.props.getUserScans(newProps.userId);
    }
  }

  setPPGData = rawPPG => () => {
    this.setState({
      currentPPGData: rawPPG
    });
  };

  renderScans() {
    return this.props.scans.map(scan => {
      const bpmArray = [
        scan.modifiedADT,
        scan.bandpassFilteredADT,
        scan.weightedPeaksAverageBPM
      ];
      const highestBpm = Math.max(...bpmArray);
      const lowestBpm = Math.min(...bpmArray);
      return (
        <ListItem
          button
          onClick={this.setPPGData(scan.rawPPG)}
          key={scan.fileName}
        >
          <Grid container justify="center">
            <Grid item xs={2}>
              <Typography>
                {scan.fileName.substring(
                  scan.fileName.lastIndexOf("_") + 1,
                  scan.fileName.length
                )}
              </Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography>{highestBpm}</Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography>{lowestBpm}</Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography>{(highestBpm + lowestBpm) / 2}</Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography>{scan.watchBPM[0]}</Typography>
            </Grid>
            <Grid item xs={2}>
              <Typography>
                {`${100 -
                  Math.abs(
                    (scan.watchBPM[0] - scan.bandpassFilteredADT) / (100 / 120)
                  )}%`}
              </Typography>
            </Grid>
          </Grid>
        </ListItem>
      );
    });
  }

  calculateAverageBPM() {
    let total = 0;

    this.props.scans.forEach(scan => {
      total = total + ((scan.modifiedADT + scan.bandpassFilteredADT + scan.weightedPeaksAverageBPM) / 3)
    });

    return parseInt(total / this.props.scans.length);
  }

  render() {
    // console.log(this.props);
    return (
      <Grid
        container
        justify="center"
        alignItems="flex-start"
        style={{ height: 1000, background: `url(${backgroundImage})` }}
      >
        <Grid item xs={12} style={{ padding: 50 }}>
          <Grid container justify="center" alignItems="center">
            <Grid item xs={12} style={{ marginBottom: 50 }}>
              <Grid container justify="center" spacing={3}>
                <Grid item xs={4}>
                  <Paper>
                    <Grid container justify="center" style={{ padding: 20 }}>
                      <Grid item xs={12}>
                        <Grid container justify="flex-start">
                          <Typography
                            variant="title"
                            style={{ fontSize: 26, marginBottom: 20 }}
                          >
                            {`${this.props.userName} ${this.props.uniqueIdentifier}`}
                          </Typography>
                        </Grid>
                      </Grid>
                      <Grid item xs={6}>
                        <Grid container justify="flex-start">
                          <Avatar
                            alt="Remy Sharp"
                            src={avatarImage}
                            style={{
                              height: 150,
                              width: 150
                            }}
                          />
                        </Grid>
                      </Grid>
                      <Grid item xs={6}>
                        <Grid container justify="flex-start">
                          <Grid item xs={12}>
                            <Typography align="left">
                              {`Age: ${this.props.age}`}
                            </Typography>
                          </Grid>
                          <Grid item xs={12}>
                            <Typography align="left">
                              {`Biological sex: ${this.props.biologicalSex}`}
                            </Typography>
                          </Grid>
                          <Grid item xs={12}>
                            <Typography align="left">
                              {this.props.scans.length > 0
                                ? `Your average heart rate: ${this.calculateAverageBPM()} bpm`
                                : "Your average heart rate: undetermined"}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
                <Grid item xs={8}>
                  <Paper>
                    <Grid container justify="center">
                      <Grid
                        item
                        xs={12}
                        style={{
                          padding: 16,
                          borderBottom: "1px solid #bfbfbf"
                        }}
                      >
                        <Grid container alignItems="center">
                          <Grid item xs={2}>
                            <Typography>{"Scan name"}</Typography>
                          </Grid>
                          <Grid item xs={2}>
                            <Typography>{"Highest detected BPM"}</Typography>
                          </Grid>
                          <Grid item xs={2}>
                            <Typography>{"Lowest detected BPM"}</Typography>
                          </Grid>
                          <Grid item xs={2}>
                            <Typography>{"Average detected BPM"}</Typography>
                          </Grid>
                          <Grid item xs={2}>
                            <Typography>{"Watch BPM"}</Typography>
                          </Grid>
                          <Grid item xs={2}>
                            <Typography>{"Best accuracy"}</Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                      <Grid item xs={12}>
                        <List component="nav" aria-label="main mailbox folders">
                          {this.renderScans()}
                        </List>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Paper>
                {this.state.currentPPGData.length > 0 ? (
                  <LineChart payload={this.state.currentPPGData} />
                ) : (
                  <Typography align="center">
                    {"Your PPG graph will be displayed here"}
                  </Typography>
                )}
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}
