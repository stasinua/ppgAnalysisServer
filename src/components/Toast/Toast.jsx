import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Slide from '@material-ui/core/Slide';

import Snackbar from '@material-ui/core/Snackbar';
import Grid from '@material-ui/core/Grid';
// import SnackbarContent from '@material-ui/core/SnackbarContent';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import IconClose from '@material-ui/icons/Close';
import IconCheck from '@material-ui/icons/People';

import { Link } from 'react-router-dom';

const styles = theme => ({
  aboveModal: {
    zIndex: 5
  },
  typography: {
    color: 'rgba(255, 255, 255, 1)'
  }
});

class Toast extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false
    };
  }

  handleRequestClose = () => {
    this.props.closeToast();
  };

  prepareMessageWithLink(message, withLinkObj) {
    let messageStart = '';
    let messageEnd = '';
    if (withLinkObj.inline) {
      messageStart = message.substring(0, message.indexOf(':link:'));
      messageEnd = message.substring(
        message.indexOf(':link:') + 6,
        message.length - 1
      );
    }

    const linkElement = withLinkObj => {
      if (withLinkObj.link.indexOf('capture') !== -1) {
        return (
          <a
            onClick={this.goToInvite}
            style={{
              color: '#fff',
              textDecoration: 'underline',
              cursor: 'pointer'
            }}
          >
            {withLinkObj.message}
          </a>
        );
      } else {
        return (
          <Link
            to={withLinkObj.link}
            style={{
              color: '#c58d03',
              textDecoration: 'none'
            }}
          >
            {withLinkObj.message}
          </Link>
        );
      }
    };
    return withLinkObj.inline ? (
      <React.Fragment>
        {messageStart}
        {linkElement(withLinkObj)}
        {messageEnd}
      </React.Fragment>
    ) : (
      <React.Fragment>
        {message + ' '}
        {linkElement(withLinkObj)}
      </React.Fragment>
    );
  }
  prepareMessageWithButton(message, withButtonObj) {
    let messageStart = '';
    let messageEnd = '';
    if (withButtonObj.inline) {
      messageStart = message.substring(0, message.indexOf(':buttonContent:'));
      messageEnd = message.substring(
        message.indexOf(':buttonContent:') + 15,
        message.length - 1
      );
    }
    return withButtonObj.inline ? (
      <React.Fragment>
        {messageStart}
        <Button
          onClick={this.goToInvite}
          style={{
            color: 'white'
          }}
        >
          {withButtonObj.buttonContent}
        </Button>
        {messageEnd}
      </React.Fragment>
    ) : (
      <React.Fragment>
        {message + ' '}
        <Button
          onClick={this.goToInvite}
          style={{
            color: 'white'
          }}
        >
          {withButtonObj.buttonContent}
        </Button>
      </React.Fragment>
    );
  }

  goToGuestList = () => {
    this.props.closeToast();
    this.props.goToGuestList(this.props.withLink.link);
  };
  goToInvite = () => {
    this.props.closeToast();
    if (this.props.withLink.status && this.props.withLink.link) {
      this.props.goToInvite(this.props.withLink.link.split('/')[2]);
    } else {
      this.props.goToInvite(this.props.withButton.buttonAction);
    }
  };

  render() {
    const { classes } = this.props;

    // console.log(this.props);

    return (
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        TransitionComponent={Slide}
        open={this.props.open}
        autoHideDuration={!this.props.keepOpen ? 6000 : null}
        onClose={this.handleRequestClose}
        onExited={this.handleRequestClose}
        style={{
          backgroundColor:
            this.props.withLink.status &&
            this.props.withLink.actionType === 'eventCreated'
              ? '#fe5153'
              : 'rgba(36, 36, 43, 1)',
          borderRadius:
            this.props.withLink.status &&
            this.props.withLink.actionType === 'eventCreated'
              ? 3
              : 3,
          paddingLeft: '14px',
          paddingRight: '14px',
          paddingTop: '14px',
          paddingBottom: '14px'
        }}
      >
        <Grid container justify="space-between" alignItems="center">
          <Grid item xs={12}>
            <Grid
              container
              justify="space-between"
              alignItems="center"
              spacing={24}
            >
              {this.props.withIcon ? (
                <Grid item>
                  <IconCheck style={{ color: '#fff', padding: 12 }} />
                </Grid>
              ) : null}
              <Grid item xs>
                {this.props.withLink.status &&
                !this.props.withLink.withButton ? (
                  <Typography
                    variant="body1"
                    align="left"
                    className={classes.typography}
                    style={{
                      color: this.props.type === 'error' ? '#ffffff' : '#ffffff'
                    }}
                  >
                    {this.prepareMessageWithLink(
                      this.props.message,
                      this.props.withLink
                    )}
                  </Typography>
                ) : this.props.withButton.status ? (
                  <Typography
                    variant="body1"
                    align="center"
                    className={classes.typography}
                    style={{
                      color: this.props.type === 'error' ? '#ffffff' : '#ffffff'
                    }}
                  >
                    {this.prepareMessageWithButton(
                      this.props.message,
                      this.props.withButton
                    )}
                  </Typography>
                ) : (
                  <Typography
                    variant="body2"
                    align="center"
                    className={classes.typography}
                    style={{
                      color: this.props.type === 'error' ? '#ffffff' : '#ffffff'
                    }}
                  >
                    {this.props.message}
                  </Typography>
                )}
              </Grid>
              {this.props.type === 'error' ||
              this.props.withLink.actionType === 'eventCreated' ? (
                <Grid item style={{ marginLeft: 12 }}>
                  <IconButton onClick={this.handleRequestClose}>
                    <IconClose style={{ color: '#fff' }} />
                  </IconButton>
                </Grid>
              ) : null}
            </Grid>
          </Grid>
          {this.props.withLink.withButton ? (
            <Grid item xs={12}>
              <Grid container justify="flex-end" alignItems="center">
                <Button
                  onClick={this.goToGuestList}
                  style={{
                    color: 'white'
                  }}
                >
                  {this.props.withLink.message}
                </Button>
              </Grid>
            </Grid>
          ) : null}
        </Grid>
      </Snackbar>
    );
  }
}

Toast.propTypes = {
  //values
  open: PropTypes.bool.isRequired,
  keepOpen: PropTypes.bool.isRequired,
  message: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  withLink: PropTypes.object,
  withButton: PropTypes.object,
  withIcon: PropTypes.bool,
  //functions
  closeToast: PropTypes.func.isRequired
};

export default withStyles(styles)(Toast);
