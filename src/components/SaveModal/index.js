import React, { Component } from "react";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Typography from "@material-ui/core/Typography";
import equal from "fast-deep-equal";

class SaveModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: true,
      mines: props.mines,
      isSaved: props.isSaved
    };
  }

  handleClose = () => {
    this.setState({
      open: false
    });
  };

  componentDidUpdate(prevProps) {
    if (!equal(this.props.mines, prevProps.mines)) {
      this.setState({
        markers: this.props.mines,
        isSaved: this.props.isSaved,
        open: true
      });
    }
  }

  render() {
    return (
      <div>
        {this.state.isSaved ? (
          <Dialog
            onClose={this.handleClose}
            aria-labelledby="customized-dialog-title"
            open={this.state.open}
          >
            <DialogTitle
              id="customized-dialog-title"
              onClose={this.handleClose}
            >
              Success!
            </DialogTitle>
            <DialogContent dividers>
              <Typography gutterBottom>
                All {this.state.mines.length} mines' locations has been
                successfully stored in cloud DB.
              </Typography>
              <Typography gutterBottom>
                Note that from now on all clients will used these mines'
                locations as default ones. Remember that each recreation of
                minefield will affect all clients in detector mode.
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button autoFocus onClick={this.handleClose} color="primary">
                OK
              </Button>
            </DialogActions>
          </Dialog>
        ) : (
          <Dialog
            onClose={this.handleClose}
            aria-labelledby="customized-dialog-title"
            open={this.state.open}
          >
            <DialogTitle
              id="customized-dialog-title"
              onClose={this.handleClose}
            >
              Failure!
            </DialogTitle>
            <DialogContent dividers>
              <Typography gutterBottom>
                Something went wrong. Please try again.
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button autoFocus onClick={this.handleClose} color="primary">
                OK
              </Button>
            </DialogActions>
          </Dialog>
        )}
      </div>
    );
  }
}

export default SaveModal;
