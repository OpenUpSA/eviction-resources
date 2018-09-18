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
import { setActiveAffidavit, setActivePerson } from './../../../redux/modules/active';
import { destroyAffidavit } from './../../../redux/modules/affidavits';
import AffidavitPreview from './../../../components/AffidavitPreview';
import { mean } from 'lodash';
import TextField from '@material-ui/core/TextField';
import MobileStepper from '@material-ui/core/MobileStepper';
import { changePersonAttribute } from './../../../redux/modules/people';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Card from '@material-ui/core/Card';
import questions from './questions.json';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Chip from '@material-ui/core/Chip';

function determinePercentageCompleted(object) {
  const completed = Object.keys(object).reduce(
    (result, key) => {
      if (
        (
          typeof object[key] === 'string' &&
          object[key] === ''
        ) ||
        (
          Array.isArray(object[key]) &&
          object[key].length < 1
        )
      ) {
        return result;
      }
      
      return result + 1;
    },
    0
  )

  const length = Object.keys(object).length;
  return Math.floor((completed / length) * 100);
}

function calcEntireAverageCompleted(affidavitId, affidavits, people) {
  const affidavit = affidavits[affidavitId]
  const array = affidavit.people.map(id => determinePercentageCompleted(people[id]))
  const meanResult = mean(array);
  return affidavit.people.length === 1 ? Math.floor(meanResult / 3) : meanResult;
}



class AffidavitsPage extends Component {
  constructor(...props) {
    super(...props);

    this.state = {
      view: 'list',
      step: 0,
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

    const completedAverage = calcEntireAverageCompleted(id, this.props.affidavits, this.props.people)
    const aff = this.props.affidavits[id];
    const date = new Date(aff.created);
    const occupants = Object.keys(aff.people).length;
    const { firstName, lastName } = this.props.people[aff.representative];
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
    if (id === false) {
      return this.setState({ step: this.state.step - 1 })
    }

    return this.setState({ step: this.state.step + 1 })
  }

  render() {
    const { step, view, notification } = this.state;
    const { proceedStep, setView, sendEmail, deleteAffidavit } = this.events;
    const { changeAttribute, addAffidavit, setAffidavit, affidavits, active, people, setPerson } = this.props;
    
    return <DetermineStep {...{ changeAttribute, deleteAffidavit, setPerson, people, step, active, affidavits, proceedStep, view, setView, notification, sendEmail, addAffidavit, setAffidavit }} />
  }
}


function DetermineStep({ changeAttribute, active, deleteAffidavit, people, step, affidavits, setAffidavit, proceedStep, setPerson, view, setView, addAffidavit, notification = { open: false }, sendEmail }) {
  const determineView = () => {
    switch (view) {
      case 'list': return <List {...{ affidavits, people, setView, addAffidavit, setAffidavit }} /> 
      case 'overview': return <Overview {...{ deleteAffidavit, setView, sendEmail, affidavits, active, people, setPerson }} /> 
      case 'personal': return <Personal {...{ changeAttribute, setView, people, active, step, proceedStep }} /> 
      case 'occupants': return <Occupants {...{ changeAttribute, setView, step, proceedStep, people, active, affidavits }} /> 
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
    setView('overview');
  }

  const addAffidavitWrapper = () => {
    const id = addAffidavit();
    goToOverview(id);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header text="Your Affidavits" backLink="/" />
      <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, padding: '2rem 2rem 0' }}>
        <div style={{ margin: '0.5rem 0', flexGrow: 1 }}>
          <AffidavitsList affidavits={affidavits} people={people} itemClickCallback={goToOverview} />
        </div>
      </div>
      <div style={{ maxWidth: '400px', padding: '2rem 2rem 6rem' }}>
        <Button variant="contained" color="primary" onClick={addAffidavitWrapper}>
          Create a new Affidavit
        </Button>
      </div>
    </div>
  );
}


function Overview({ setView, sendEmail, affidavits, active, people, deleteAffidavit, proceedStep, setPerson }) {
  const completedAverage = calcEntireAverageCompleted(active.affidavit, affidavits, people)
  const personalClickWrapper = () => {
    setPerson(affidavits[active.affidavit].representative);
    setView('personal');
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header text="Affidavit Overview" backClick={() => setView('list')} />
      <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, padding: '2rem 2rem 0' }}>
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
          <Button variant="raised" onClick={personalClickWrapper}>
            Your Information (0%)
          </Button>
        </div>

        <div style={{ margin: '0.5rem 0' }}>
          <Button variant="raised" onClick={() => setView('occupants')}>
            Occupants Information (0%)
          </Button>
        </div>
      </div>
      <div style={{ padding: '2rem 2rem 6rem' }}>
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

function Personal({ setView, people, active, step, proceedStep, changeAttribute }) {
  const { basic, language, citizenship, health, employment } = questions;

  const fullSteps = [
    basic,
    language,
    citizenship,
    health,
    employment,
  ]

  const minSteps = [
    basic,
    citizenship,
    health,
  ]

  const steps = fullSteps;

  const buildView = (array) => {
    return array.questions.map(({ options, label, value, condition, type }) => {
      const personAttributes = people[active.person];

      const shouldShow = (key, innerValue, callback) => {
        if (personAttributes[key] === innerValue) {
          return callback;
        }

        if (personAttributes[value] === '') {
          changeAttribute(active.person, value, 'N/A')
        }

        return null;
      }

      const buildItem = () => {
        if (type === 'list') {
          const output = (
            <div key={value} style={{ marginTop: '1.2rem' }}>
              <div>asdasd</div>
            </div>
          )

          if (condition) {
            return shouldShow(condition.key, condition.value, output);
          }

          return output;

        }

        if (options) {
          const output = (
            <div key={value} style={{ marginTop: '1.2rem' }}>
              <FormControl fullWidth>
                <InputLabel htmlFor={value}>{label}</InputLabel>
                <Select
                  value={personAttributes[value]}
                  onChange={event => changeAttribute(active.person, value, event.target.value)}
                  input={<Input name={value} id={value} />}
                >
                  {
                    options.map(value => <MenuItem key={value} value={value}>{value}</MenuItem>)
                  }
                </Select>
              </FormControl>
            </div>
          )

          if (condition) {
            return shouldShow(condition.key, condition.value, output);
          }

          return output;
        }
  
        
        const output = (
          <FormControl fullWidth key={value}>
            <TextField
              type={type || 'string'}
              id={value}
              label={label}
              value={personAttributes[value]}
              onChange={event => changeAttribute(active.person, value, event.target.value)}
              margin="normal"
            />
          </FormControl>
        )

        if (condition) {
          return shouldShow(condition.key, condition.value, output);
        }

        return output;
      }

      return buildItem();
    })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header text="Your Info" backClick={() => setView('overview')} />
      <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, padding: '2rem' }}>
        <Typography component="p">
          Step {step + 1}/{steps.length}
        </Typography>
        <MobileStepper
          variant="dots"
          steps={steps.length}
          position="static"
          activeStep={step}
        />

        <Typography variant="display1">
          {steps[step].title}
        </Typography>

        <form noValidate autoComplete="off">
          {buildView(steps[step])}
        </form>
      </div>
      <div style={{ padding: '2rem 2rem 6rem' }}>
        {
          step > 0 && (
            <Button variant="flat" color="primary" onClick={() => proceedStep(false)}>
              Previous Step
            </Button>
          )
        }

        {
          step < steps.length - 1 && (
            <Button variant="contained" color="primary" onClick={() => proceedStep()}>
              Next Step
            </Button>
          )
        }

        {
          step === steps.length - 1 && (
            <Button variant="contained" color="primary" onClick={() => setView('overview')}>
              Return
            </Button>
          )
        }
      </div>
    </div>
  );
}


function RawPersonPreview({ classes, name, representative }) {
  if (representative) {
    return (
      <Card>
        <CardContent>
          <FormControl disabled fullWidth >
            <InputLabel htmlFor="firstName">First Name</InputLabel>
            <Input id="firstName" value="Schalk" />
          </FormControl>
        </CardContent>
        <CardContent>
          <FormControl disabled fullWidth >
            <InputLabel htmlFor="lastName">Last Name</InputLabel>
            <Input id="lastName" value="Venter" />
          </FormControl>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent>
        <FormControl fullWidth >
          <InputLabel htmlFor="firstName-1">First Name</InputLabel>
          <Input id="firstName-1" value="" />
        </FormControl>
      </CardContent>
      <CardContent>
        <FormControl fullWidth >
          <InputLabel htmlFor="lastName-1">Last Name</InputLabel>
          <Input id="lastName-1" value="" />
        </FormControl>
      </CardContent>
      <CardContent>
      <FormControl fullWidth>
        <InputLabel htmlFor="relationship-1">Relationship to you</InputLabel>
        <Select
          value=""
          input={<Input name="relationship-1" id="relationship-1" />}
        >
          {
            ['Spouse', 'Friend/Housemate', 'Child', 'Parent', 'Grandparent', 'Grandchild'].map(value => <MenuItem key={value} value={value}>{value}</MenuItem>)
          }
        </Select>
      </FormControl>
      </CardContent>
    </Card>
  )
}

const PersonPreview = RawPersonPreview;

function Occupants({ setView, people, active, affidavits }) {
  const peopleList = affidavits[active.affidavit].people;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header text="Occupant Info" backClick={() => setView('overview')} />
      <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, padding: '2rem' }}>
        <Typography component="p">
          Step 1/{((peopleList.length - 1) * 3) + 1}
        </Typography>
        <MobileStepper
          variant="dots"
          steps={((peopleList.length - 1) * 3) + 1}
          position="static"
          activeStep={0}
        />

        <Typography variant="display1">
          Tell us about the other occupants of the household?
        </Typography>

        <PersonPreview representative />
        <div style={{ marginTop: '1rem' }}>
          <PersonPreview />
        </div>

        <br />

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
  setPerson: id => dispatch(setActivePerson(id)),
  changeAttribute: (id, attribute, value) => dispatch(changePersonAttribute(id, attribute, value)),
});


export default connect(mapStateToProps, mapDispatchToProps)(AffidavitsPage);