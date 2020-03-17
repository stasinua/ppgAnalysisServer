import React from 'react';
import { withStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';

import Paper from '@material-ui/core/Paper';

import backgroundImage from '../../assets/img/background.jpg'

const styles = {
  root: {
    background: '#A2CCE2',
    borderRadius: 3,
    border: 0,
    color: 'white',
    height: 48,
    padding: '0 30px'
  },
};

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      error: '',
      logInUser: {
        name: {
          value: ''
        },
        uniqueIdentifier: {
          value: ''
        }
      }
    };
  }

  userNameInput = evt => {
    this.setState({
      logInUser: {
        ...this.state.logInUser,
        name: {
          value: evt.target.value
        }
      }
    });
  }
  userUniqueIdentifierInput = evt => {
    this.setState({
      logInUser: {
        ...this.state.logInUser,
        uniqueIdentifier: {
          value: evt.target.value
        }
      }
    });
  }

  logIn = () => {
    this.props.logIn(this.state.logInUser.name.value, this.state.logInUser.uniqueIdentifier.value);
  }

  render() {
    const { classes } = this.props;
    return (
      <Grid container justify="center" alignItems="center" style={{ height: 1000, background: `url(${backgroundImage})`}}>
        <Grid item xs={12} style={{ padding: 50 }}>
          <Grid container justify="center" alignItems="center">
            <Grid item xs={8} style={{ padding: 20, background: 'rgba(255,255,255,0.7)', borderRadius: 5 }}>
              <Grid container justify="center" alignItems="center" spacing={10}>
                <Grid item xs={12}>
                  <Grid container justify="center" alignItems="center">
                    <Typography variant="title" style={{ fontSize: 26, marginBottom: 20 }} align="center">
                      Welcome to research PPG scan database
                    </Typography>
                  </Grid>
                </Grid>
                <Grid item xs={8} >
                  <Grid container justify="center" alignItems="center" spacing={4}>
                    <Grid item xs={6}>
                      <FormControl fullWidth>
                        <TextField
                          color="primary"
                          fullWidth
                          label={'Name'}
                          id="name"
                          type="string"
                          value={this.state.logInUser.name.value}
                          onChange={this.userNameInput}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                      <FormControl fullWidth>
                        <TextField
                          color="primary"
                          fullWidth
                          label={'Unique identifier'}
                          id="identifier"
                          type="string"
                          value={this.state.logInUser.uniqueIdentifier.value}
                          onChange={this.userUniqueIdentifierInput}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item>
                      <Button
                        classes={{
                          root: classes.root
                        }}
                        variant="contained"
                        size="large"
                        color="primary"
                        disabled={
                          this.state.logInUser.name.value.length < 3 ||
                          this.state.logInUser.uniqueIdentifier.length < 3
                        }
                        type="submit"
                        onClick={this.logIn}
                      >
                        {'Log in'}
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(Login);
