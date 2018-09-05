import React, { Component } from 'react'
import { connect } from 'react-redux';
import AffidavitsList from './../../../components/AffidavitsList';
import Header from './../../../components/Header';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';
import Modal from './../../../components/Modal';
import DialogContentText from '@material-ui/core/DialogContentText';


class AffidavitsPage extends Component {
  constructor(...props) {
    super(...props);

    this.state = {
      view: 'list',
      step: 1,
      notification: null,
    }

    this.events = {
      proceedStep: this.proceedStep.bind(this),
      setView: this.setView.bind(this),
      sendEmail: this.sendEmail.bind(this),
    }
  }

  sendEmail() {
    console.log('asdsa')
    return this.setState({ 
      notification: {
        title: 'Missing content',
        content: (
          <DialogContentText>
            Affidavit has not been completed yet, are you sure you want to send it in it's current state?
          </DialogContentText>
        ),
        open: true,
        close: () => this.setState({ notification: null }),
        reject: {
          text: 'Cancel',
          click: () => this.setState({ notification: null })
        },
        approve: {
          text: 'Send',
          click: 'mailto:shaun@nu.org.za'
        }
      }
    })
  }


  setView(view) {
    return this.setState({ view })
  }


  proceedStep(id) {
    if (id === true) {
      return this.setState({ step: this.state.step + 1 })
    }
    
    if (id === false) {
      return this.setState({ step: this.state.step - 1 })
    }
  }

  render() {
    const { step, view, notification } = this.state;
    const { proceedStep, setView, sendEmail } = this.events;
    return <DetermineStep {...{ step, proceedStep, view, setView, notification, sendEmail }} />
  }
}


function DetermineStep({ step, proceedStep, view, setView, notification = { open: false }, sendEmail }) {
  const determineView = () => {
    switch (view) {
      case 'list': return <List {...{ setView }} /> 
      case 'overview': return <Overview {...{ setView, sendEmail }} /> 
      case 'personal': return <Personal {...{ setView }} /> 
      case 'occupants': return <Occupants {...{ setView }} /> 
      default: return <List {...{ setView }} /> 
    }
  }

  return (
    <div>
      <Modal {...notification} />
      {determineView()}
    </div>
  )
}


function List({ setView }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header text="Your Affidavits" backLink="/" />
      <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, padding: '2rem' }}>
        <Typography component="p">
          Most recent affidavits:
        </Typography>
        <div style={{ margin: '0.5rem 0', flexGrow: 1 }}>
          <AffidavitsList />
        </div>
        <Button variant="contained" color="primary" onClick={() => setView('overview')}>
          Create a new Affidavit
        </Button>
      </div>
    </div>
  );
}


function Overview({ setView, sendEmail }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header text="Affidavit Overview" backClick={() => setView('list')} />
      <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, padding: '2rem' }}>
        <div style={{ margin: '0.5rem 0 1.5rem 0' }}>
          <LinearProgress variant="determinate" value={15} />
          <Typography component="p">
            15% Total Completed
          </Typography>
        </div>
        <Typography component="p">
          Please complete the following sets of questions to the best of your ability. Preview or email your affidavit at any time
        </Typography>

        <div style={{ margin: '2rem 0 0.5rem 0' }}>
          <Button variant="contained" onClick={() => setView('personal')}>
            Your Information (0%)
          </Button>
        </div>

        <div style={{ margin: '0.5rem 0 2rem' }}>
          <Button variant="contained" onClick={() => setView('occupants')}>
            Occupant Information (0%)
          </Button>
        </div>

        <div style={{ margin: '0.5rem 0' }}>
          <Button variant="contained" color="primary" onClick={sendEmail}>
            Email Affidavit
          </Button>
        </div>
      </div>
    </div>
  );
}


function Personal({ setView }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header text="Your Info" backClick={() => setView('list')} />
      <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, padding: '2rem' }}>
        <Typography component="p">
          Step 1/10
        </Typography>
      </div>
    </div>
  );
}


function Occupants({ setView }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header text="Occupant Info" backClick={() => setView('list')} />
      <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, padding: '2rem' }}>
        <Typography component="p">
          Step 1/10
        </Typography>
      </div>
    </div>
  );
}


const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  affidavits: state.affidavits,
  people: state.people,
});


const mapDispatchToProps = (dispatch, ownProps) => ({
  ...ownProps,
});


export default connect(mapStateToProps, mapDispatchToProps)(AffidavitsPage);