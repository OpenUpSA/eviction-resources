import React, { Component } from 'react'
import { connect } from 'react-redux';
import AffidavitsList from './../../../components/AffidavitsList';
import Header from './../../../components/Header';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';
import Modal from './../../../components/Modal';
import DialogContentText from '@material-ui/core/DialogContentText';
import { addAffidavit as addAffidavitAction } from './../../../redux/actions';
import { setActiveAffidavit } from './../../../redux/modules/active';
import { destroyAffidavit } from './../../../redux/modules/affidavits';
import AffidavitPreview from './../../../components/AffidavitPreview';
import { mean } from 'lodash';


function determinePercentageCompleted(object) {
  const completed = Object.keys(object).reduce(
    (result, key) => {
      if (object[key] === '' || object[key] === null) {
        return result;
      }
      
      return result + 1;
    },
    0
  )

  const length = Object.keys(object).length;
  return Math.floor((completed / length) * 100);
}



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
      deleteAffidavit: this.deleteAffidavit.bind(this),
    }
  }

  sendEmail() {
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

  deleteAffidavit(id) {
    const goToOverview = () => {
      this.props.setAffidavit(id);
      this.setState({ view: 'overview' });
      this.setState({ notification: null })
    }

    const affidavit = this.props.affidavits[id]
    const array = affidavit.people.map(id => determinePercentageCompleted(this.props.people[id]))
    const completedAverage = mean(array);
    const date = new Date(affidavit.created);
    const occupants = Object.keys(affidavit.people).length;
    const { firstName, lastName } = this.props.people[affidavit.representative];
    const hasFirstAndLastNames = firstName && lastName;
    const displayName = hasFirstAndLastNames ? `${firstName} ${lastName}` : 'Unknown Person'

    const deleteItem = () => {
      this.props.deleteAffidavit(id);
      this.setState({ 
        view: 'list',
        notification: null,
      })
    }

    return this.setState({ 
      notification: {
        title: 'Confirm deletion',
        content: (
          <div>
            <DialogContentText>
              You are about to delete the following affidavit. Please confirm that this is what you want to do. Once delete it can not be recovered.
            </DialogContentText>
            <div style={{ marginTop: '20px' }} onClick={goToOverview}>
              <AffidavitPreview completed={completedAverage} name={displayName} occupants={occupants} date={date} />
            </div>
          </div>
        ),
        open: true,
        close: () => this.setState({ notification: null }),
        reject: {
          text: 'Cancel',
          click: () => this.setState({ notification: null })
        },
        approve: {
          text: 'Delete',
          click: deleteItem,
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
    const { proceedStep, setView, sendEmail, deleteAffidavit } = this.events;
    const { addAffidavit, setAffidavit, affidavits, active, people } = this.props;
    return <DetermineStep {...{ deleteAffidavit, people, step, active, affidavits, proceedStep, view, setView, notification, sendEmail, addAffidavit, setAffidavit }} />
  }
}


function DetermineStep({ active, deleteAffidavit, people, step, affidavits, setAffidavit, proceedStep, view, setView, addAffidavit, notification = { open: false }, sendEmail }) {
  const determineView = () => {
    switch (view) {
      case 'list': return <List {...{ affidavits, people, setView, addAffidavit, setAffidavit }} /> 
      case 'overview': return <Overview {...{ deleteAffidavit, setView, sendEmail, affidavits, active, people }} /> 
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


function List({ setView, affidavits, people, addAffidavit, setAffidavit }) {
  const goToOverview = (id) => {
    setAffidavit(id);
    setView('overview')
  }

  const addAffidavitWrapper = () => {
    const id = addAffidavit();
    goToOverview(id);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header text="Your Affidavits" backLink="/" />
      <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, padding: '2rem' }}>
        <div style={{ margin: '0.5rem 0', flexGrow: 1 }}>
          <AffidavitsList affidavits={affidavits} people={people} itemClickCallback={goToOverview} />
        </div>
        <div style={{ maxWidth: '400px' }}>
          <Button variant="contained" color="primary" onClick={addAffidavitWrapper}>
            Create a new Affidavit
          </Button>
        </div>
      </div>
    </div>
  );
}


function Overview({ setView, sendEmail, affidavits, active, people, deleteAffidavit }) {
  const array = affidavits[active.affidavit].people.map(id => determinePercentageCompleted(people[id]))
  const completedAverage = mean(array);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header text="Affidavit Overview" backClick={() => setView('list')} />
      <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, padding: '2rem' }}>
        <div style={{ margin: '0.5rem 0 1.5rem 0' }}>
          <LinearProgress variant="determinate" value={completedAverage} />
          <Typography component="p">
            {completedAverage}% Total Completed
          </Typography>
        </div>
        <Typography component="p">
          Please complete the following sets of questions to the best of your ability. Preview or email your affidavit at any time
        </Typography>

        <div style={{ margin: '2rem 0 0.5rem 0' }}>
          <Button variant="raised" onClick={() => setView('personal')}>
            Your Information (0%)
          </Button>
        </div>

        <div style={{ margin: '0.5rem 0 2rem' }}>
          <Button variant="raised" onClick={() => setView('occupants')}>
            Occupant Information (0%)
          </Button>
        </div>

        <div style={{ margin: '0.5rem 0' }}>
          <Button variant="flat" color="secondary" onClick={() => deleteAffidavit(active.affidavit)}>
            Delete Affidavit
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
  active: state.active,
});


const mapDispatchToProps = (dispatch, ownProps) => ({
  ...ownProps,
  addAffidavit: () => dispatch(addAffidavitAction()),
  setAffidavit: id => dispatch(setActiveAffidavit(id)),
  deleteAffidavit: id => dispatch(destroyAffidavit(id)),
});


export default connect(mapStateToProps, mapDispatchToProps)(AffidavitsPage);