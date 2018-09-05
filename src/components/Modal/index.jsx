import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';


function Modal({ open, title, close, approve, reject, content }) {

  const buildReject = () => {
    if (typeof reject.click === 'function') {
      return (
        <Button onClick={reject.click} color="primary">
          {reject.text}
        </Button>
      )
    }

    return (
      <a href={reject.click} target="_blank">
        <Button color="primary">
          {reject.text}
        </Button>
      </a>
    )  
  }

  const buildApprove = () => {
    console.log(approve, approve.click, typeof approve.click)
    if (typeof approve.click === 'function') {
      return (
        <Button onClick={approve.click} color="primary" autoFocus>
          {approve.text}
        </Button>
      )
    }

    return (
      <a href={approve.click} target="_blank">
        <Button color="primary">
          {approve.text}
        </Button>
      </a>
    )
  }

  const buildModal = () => {
    return (
      <Dialog
        open={open}
        onClose={close}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        <DialogContent>
          {content}
        </DialogContent>
        <DialogActions>
          {reject && buildReject()}
          {approve && buildApprove()}
        </DialogActions>
      </Dialog>
    )
  }

  if (!open) {
    return null;
  }

  return buildModal();
}


export default Modal;