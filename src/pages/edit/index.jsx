import { without } from 'lodash';
import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import { connect } from 'react-redux';
import Chip from '@material-ui/core/Chip';
import InputAdornment from '@material-ui/core/InputAdornment';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import Button from '@material-ui/core/Button';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';

import BasicPage from './../../components/BasicPage';
import withRoot from '../../material-ui/withRoot';
import createSemanticObject from './../../utilities/createSemanticObject';
import { changePersonAttribute } from './../../redux/modules/people';
import './styles.css';


const buildQuestion = (question, answer, index) => {
  return `\n${index}. ${question} ${answer}\n`
}


const convertStateIntoEmail = data => {
  return Object.keys(data).map((name, index) => buildQuestion(`${name}:`, data[name], `${index + 1}`))
}


const getQueryParams = url => {
  url = url.split('+').join(' ');

  var params = {},
      tokens,
      re = /[?&]?([^=]+)=([^&]*)/g;

  while (tokens = re.exec(url)) {
      params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
  }

  return params;
}


class EditPage extends Component {
  constructor(...props) {
    super(...props);
    
    this.state = {
      personId: null,
      notification: null,
      currentStep: 0,
      reverse: false,
    }

    this.events = {
      sendEmail: this.sendEmail.bind(this),
      changeStep: this.changeStep.bind(this),
    }
  }

  componentDidMount() {
    const { affidavits } = this.props;
    const { id } = getQueryParams(document.location.search)
    const personId = affidavits[id].representative;
    return this.setState({ personId })
  }

  changeStep(currentStep) {
    if (currentStep === false) {
      this.setState({ reverse: true })
      return this.setState({ currentStep: this.state.currentStep - 1 })
    }

    this.setState({ reverse: false })

    if (currentStep) {
      return this.setState({ currentStep })
    }

    return this.setState({ currentStep: this.state.currentStep + 1 })
  }

  sendEmail(id) {
    const { people } = this.props;
    const info = createSemanticObject(people[id]);
    const completed = calcCompleted(info);
    const emailUrl = `mailto:shaun@nu.org.za?subject=Eviction%20Affidavit%3A%20${info.firstName}%20${info.lastName}&body=${encodeURIComponent(convertStateIntoEmail(info).join(''))}`;

    if (completed === 100) {
      return window.open(emailUrl, '_blank');
    }

    return this.setState({ 
      notification: {
        title: 'Missing content',
        description: 'The affidavit has not been completed, do you want to send in it\s current state?',
        open: true,
        close: () => this.setState({ notification: null }),
        reject: {
          text: 'Cancel',
          click: () => this.setState({ notification: null })
        },
        approve: {
          text: 'Send',
          click: emailUrl,
        }
      }
    })
  }

  render() {
    const { personId, notification, currentStep, reverse } = this.state;
    const { changeAttribute, affidavits, people } = this.props;
    const { sendEmail, changeStep } = this.events;
    return <Markup {...{ sendEmail, changeAttribute, reverse, currentStep, changeStep, affidavits, people, personId, notification }} />
  }
}

const actions = (event, current, modifiedQuestions) => (
  <div style={{ display: 'flex' }}>
    <div style={{ width: '50%' }}>
      {current > 0 && <Button style={{ marginRight: '10px' }}onClick={() => event(false)} variant="contained"fullWidth size="large">Previous</Button>}
    </div>
    <div style={{ width: '50%' }}>
{current < modifiedQuestions.length && <Button style={{ marginLeft: '10px' }} onClick={() => event()} variant="contained" color="primary" fullWidth size="large">Next</Button>}
    </div>
  </div>
);


const createBuildInput = (personId, changeAttribute, people, proceed) => {
  return (id, label, otherProps = {}) => (
        <div>
        <FormControl fullWidth>
          <TextField
            value={people[personId][id]}
            onChange={event => changeAttribute(personId, id, event.target.value)}
            margin="normal"
            {...{ id }}
            {...otherProps}
          />
        </FormControl>
        <Button variant="contained" fullWidth color="primary" style={{ marginTop: '2rem' }} size="large" onClick={() => proceed()}>Save answer</Button>
        </div>
  )
}


const createBuildSelect = (personId, changeAttribute, people, proceed) => {
    return (id, label, options) => {
      const action = event => {
        changeAttribute(personId, id, event.target.value);
        proceed();
      }

      return (
        <FormControl fullWidth>
          <Select
            value={people[personId][id]}
            onChange={action}
            input={<Input name={id} id={id} />}
          >
            {
              options.map(value => <MenuItem key={value} value={value}>{value}</MenuItem>)
            }
          </Select>
        </FormControl>
      )
    }
}


const calcCompleted = object => {
  const amount = Object.keys(object).filter(key => object[key] !== '').length;
  const total = Object.keys(object).length;
  return Math.floor((amount / total) * 100);
}


/**
 * Presentational component for affidavit about page
 */
function Markup({ reverse, changeAttribute, people, personId, notification, changeStep, currentStep, sendEmail }) {
  if (!personId) {
    return (
      <BasicPage 
        heading="Affidavit Overview"
        back="/affidavits"
        selected="Create an affidavit"
      >
        Loading...
      </BasicPage>
    )
  }

  const buildInput = createBuildInput(personId, changeAttribute, people, changeStep);
  const buildSelect = createBuildSelect(personId, changeAttribute, people, changeStep);
  const person = people[personId];
  const completed = calcCompleted(createSemanticObject(person))


  class List extends Component {
    constructor(...props) {
      super(...props)

      this.state = {
        input: '',
      }

      this.events = {
        addItem: this.addItem.bind(this),
        updateText: this.updateText.bind(this),
        removeItem: this.removeItem.bind(this),
      }
    }

    addItem() {
      const { id } = this.props;
      const { input } = this.state;
      if (input === '') {
        return null;
      }

      const currentList = person[id] !== '' ? JSON.parse(person[id]) : [];
      changeAttribute(personId, id, JSON.stringify([ ...currentList, input ]));
      this.setState({ input: '' })
    }

    removeItem(name) {
      const { id } = this.props;
      const currentList = person[id] !== '' ? JSON.parse(person[id]) : [];
      changeAttribute(personId, id, JSON.stringify(currentList.filter(val => val !== name)));
    }

    updateText(input) {
      this.setState({ input })
    }

    render() {
      const { id, label } = this.props;
      const currentList = person[id] !== '' ? JSON.parse(person[id]) : [];
      const { input } = this.state;
      const { addItem, updateText, removeItem } = this.events;
      return <ListMarkup {...{ label, id, input, addItem, updateText, currentList, removeItem }} />
    }
  }


  const ListMarkup = props => {
    const { currentList, input, addItem, updateText, removeItem, label, id } = props;
    
    return (
      <div>
          <FormControl fullWidth>
            <TextField
              value={input}
              onChange={event => updateText(event.target.value)}
              margin="normal"
              id={id}
              style={{ marginBottom: '2rem' }}
            />
          </FormControl>
          <Button variant="contained" onClick={addItem} style={{ marginBottom: '2rem' }} fullWidth>
            Add above item
          </Button>
          {
            currentList.map((name, index) => (
              <Chip
                style={{ margin: '0.25rem' }}
                key={index}
                label={name}
                onDelete={() => removeItem(name)}
              />
            ))
          }
          <div>
            <Button variant="contained" color="primary" fullWidth size="large" onClick={() => changeStep()} style={{ marginTop: '2rem' }}>Save answer</Button>
          </div>
</div>
    )
  }


  const buildYearOptions = (endYear = 2018, amount = 80) => {
    let yearArray = [];
    let tempYear = endYear + 1;

    for (let i = 0; i < amount; i++) {
      tempYear = tempYear - 1;
      yearArray.push(tempYear)
    }

    return yearArray.map(text => <MenuItem key={text} value={text}>{text}</MenuItem>)
  }


  const buildEmployDate = (event) => {
    return (
      <div>
          <div style={{ display: 'flex', marginTop: '1.5rem' }}>
            <FormControl style={{ flexGrow: 2, marginRight: '1rem' }}>
              <InputLabel htmlFor="month" style={{ fontSize: '14px' }}>Month</InputLabel>
              <Select
                value={person.startEmployMonth}
                onChange={event => changeAttribute(personId, 'startEmployMonth', event.target.value)}
                input={<Input name="month" id="month" />}
              >
                {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map(text => <MenuItem key={text} value={text}>{text}</MenuItem>)}
              </Select>
            </FormControl>
            <FormControl style={{ flexGrow: 1, marginLeft: '1rem' }}>
              <InputLabel htmlFor="year" style={{ fontSize: '14px' }}>Year</InputLabel>
              <Select
                value={person.startEmployYear}
                onChange={event => changeAttribute(personId, 'startEmployYear', event.target.value)}
                input={<Input name="year" id="year" />}
              >
                {buildYearOptions()}
              </Select>
            </FormControl>
            </div>
            <div>
              <Button variant="contained" color="primary" fullWidth size="large" onClick={event} style={{ marginTop: '2rem' }}>Save answer</Button>
            </div>
          </div>
    )
  }


  const ageRange = () => {
    let result = [];
    for (let i = 18; i < 100; i++) {
      result.push(i);
    }
    return result;
  }
  
  const questions = [
    {
      id: 'firstName',
      title: 'What is your first name?',
      example: 'John',
      markup: buildInput('firstName', 'First Name'),
    },
    {
      id: 'lastName',
      title: `What is your last name ${person.firstName}?`,
      example: 'Smith',
      markup: buildInput('lastName', 'Last Name')
    },
    {
      id: 'gender',
      title: `And your gender?`,
      example: 'Female',
      markup: buildSelect('gender', 'Gender', ['Male', 'Female', 'Other']),
    },
    {
      id: 'age',
      title: `How old are you ${person.firstName}?`,
      example: '31',
      markup: buildSelect('age', 'Age', ageRange()),
    },
    {
      id: 'married',
      title: `Are you married ${person.firstName}?`,
      example: 'No',
      markup: buildSelect('married', 'Are you married?', ['No', 'Yes']),
    },
    {
      id: 'speakingEnglish',
      title: `How well do you speak English?`,
      example: 'Excellent',
      markup: buildSelect('speakingEnglish', 'How well do you speak English?', ['Excellent', 'Okay', 'Poor']),
    },
    {
      id: 'readingEnglish',
      title: `Right. How well do you read English?`,
      example: 'Excellent',
      markup: buildSelect('readingEnglish', 'How well do you read English?', ['Excellent', 'Okay', 'Poor']),
    },
    {
      id: 'writingEnglish',
      title: `And lastly, how well do you write in English?`,
      example: 'Excellent',
      markup: buildSelect('writingEnglish', 'How well do you write English?', ['Excellent', 'Okay', 'Poor']),
    },
    {
      id: 'citizen',
      title: `${person.firstName}, are you a South African citizen?`,
      example: 'Yes',
      markup: buildSelect('citizen', 'Are you South African citizen?', ["No", "Yes"]),
    },
    {
      id: 'idNumber',
      title: `Right, what is your ID number?`,
      example: '6311035188253',
      markup: buildInput('idNumber', 'South African Id Number', { type: 'number', max: 9999999999 }),
    },
    {
      id: 'immigrationStatus',
      title: `Your immigration status?`,
      example: 'Asylumn seeker permit',
      markup: buildSelect('immigrationStatus', 'Your immigration status?', ["Refugee status", "Asylumn seeker permit", 'Undocumented/expired permit']),
    },
    {
      id: 'refugeeId',
      title: `Refugee Id Number?`,
      markup: buildInput('refugeeId', 'Refugee Id Number', { type: 'number', max: 9999999999 }),
    },
    {
      id: 'employed',
      title: `Do you have a job at this moment?`,
      example: 'Yes',
      markup: buildSelect('employed', 'Are you currently employed?', ["No", "Yes"]),
    },
    {
      id: 'employedDate',
      title: `What date did you start your current job?`,
      example: 'January 2015',
      markup: buildEmployDate(() => changeStep()),
    },
    {
      id: 'employedType',
      title: `What do you do for work?`,
      example: 'Domestic Worker',
      markup: buildInput('employedType', ''),
    },
    {
      id: 'earnMonthly',
      title: `How much earned a month?`,
      example: 'R3500',
      markup: buildInput('earnMonthly', '', { type: 'number', min: 0, max: 1000000, InputProps: { startAdornment: <InputAdornment position="start">R</InputAdornment> } }),
    },
    {
      id: 'soleBreadwinner',
      title: `Are you the sole breadwinner?`,
      example: 'Yes',
      markup: buildSelect('soleBreadwinner', '', ["No", "Yes"]),
    },
    {
      id: 'soleRentPayer',
      title: `Do you pay rent alone?`,
      example: 'Yes',
      markup: buildSelect('soleRentPayer', '', ["No", "Yes"]),
    },   
    {
      id: 'healthProblems',
      title: `Do you have chronic or severe health problems?`,
      example: 'No',
      markup: buildSelect('healthProblems', 'Do you have health problems?', ["No", "Yes"]),
    },
    {
      id: 'healthProblemsList',
      title: `List all health problems:`,
      markup: <List id="healthProblemsList" label="Type a health problem here" />,
    },      
    {
      id: 'disability',
      title: `Do you have one or more disabilities?`,
      example: 'No',
      markup: buildSelect('disability', 'Do you have disabilities?', ["No", "Yes"]),
    },
    {
      id: 'disabilityList',
      title: `List all disabilities:`,
      markup: <List id="disabilityList" label="Type a disability here" />,
    },      
    {
      id: 'phone',
      title: `What is your phone number?`,
      example: '0847257112',
      markup: buildInput('phone', 'What is your phone number?'),
    },
  ];

  const modifyList = list => {
    let tempList = list;

    if (person.citizen !== 'No') {
      tempList = tempList.filter(({ id }) => id !== 'immigrationStatus');
    }

    if (person.citizen !== 'Yes') {
      tempList = tempList.filter(({ id }) => id !== 'idNumber');
    }

    if (person.citizen !== 'Yes' || person.immigrationStatus !== 'Refugee status') {
      tempList = tempList.filter(({ id }) => id !== 'refugeeId');
    }

    
    if (person.employed !== 'Yes') {
      tempList = tempList.filter(({ id }) => id !== 'employedDate');
      tempList = tempList.filter(({ id }) => id !== 'employedType');
    }

    if (person.healthProblems !== 'Yes') {
      tempList = tempList.filter(({ id }) => id !== 'healthProblemsList');
    }

    if (person.disabilities !== 'Yes') {
      tempList = tempList.filter(({ id }) => id !== 'disabilityList');
    }

    return tempList;
  }

  const modifiedQuestions = modifyList(questions);

  if (currentStep === modifiedQuestions.length) {
    return (
      <BasicPage 
        modalProps={notification}
        actions={actions(changeStep, currentStep, modifiedQuestions)}
        
        back="/affidavits"
        expanded="Affidavit"
        selected="Affidavit Overview"
        swipeRight={() => currentStep > 0 && changeStep(false)}
      >
        <Typography component="p" color="primary">
          {completed}% completed
        </Typography>
        <LinearProgress variant="determinate" value={completed} />

          <TransitionGroup style={{ position: 'relative' }} className={reverse ? 'reverse' : ''}>
            <CSSTransition
              key={currentStep}
              timeout={400}
              classNames="swipe"
              className="swipe"
              key={currentStep}
            >
            
              <Card style={{ margin: '2rem 0' }}>
                <CardContent>
                <Typography color="primary" style={{ fontSize: '1.6rem' }}>
                  You have reached the end of the questions?
                </Typography>
                <Typography component="p" style={{ color: "grey", marginTop: '30px' }} >
                  Do you want to send them to a lawyer?
                </Typography>
                <div>
                  <Button variant="contained" color="primary" fullWidth size="large" style={{ marginTop: '2rem' }} onClick={() => sendEmail(personId)}>Send answers</Button>
                </div>
              </CardContent>
            </Card>
          </CSSTransition>
        </TransitionGroup>

       <div style={{ display: 'flex', position: 'fixed', bottom: 0, left: 0, width: '100%' }}>
        <Button size="small" onClick={() => changeStep(false)} disabled={currentStep < 1}>
          <KeyboardArrowLeft />
        </Button>

        <Typography variant="caption" style={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          SWIPE SCREEN
        </Typography>

        <Button size="small" onClick={() => changeStep()}>
          <KeyboardArrowRight />
        </Button>
      </div>
      </BasicPage>
    )
  }

  return (
    <BasicPage 
      modalProps={notification}
      actions={actions(changeStep, currentStep, modifiedQuestions)}
      back="/affidavits"
      expanded="Affidavit"
      selected="Affidavit Overview"
      swipeRight={() => currentStep > 0 && changeStep(false)}
      swipeLeft={() => currentStep < modifiedQuestions.length && changeStep()}
    >
        <Typography component="p" color="primary">
          {completed}% completed
        </Typography>
        <LinearProgress variant="determinate" value={completed} />

        <TransitionGroup style={{ position: 'relative' }} className={reverse ? 'reverse' : ''}>
          <CSSTransition
            key={currentStep}
            timeout={400}
            classNames="swipe"
            className="swipe"
            key={currentStep}
          >
            <Card style={{ margin: '2rem 0' }}>
              <CardContent>
              <Typography color="primary" style={{ fontSize: '1.6rem' }}>
              {modifiedQuestions[currentStep].title}
              </Typography>
              {
                modifiedQuestions[currentStep].example &&
                  (
                    <Typography component="p" style={{ color: "grey", marginTop: '30px' }} >
                      For example: "{modifiedQuestions[currentStep].example}"
                    </Typography>
                  )
              }
              {modifiedQuestions[currentStep].markup}
            </CardContent>
          </Card>
        </CSSTransition>
      </TransitionGroup>

       <div style={{ display: 'flex', position: 'fixed', bottom: 0, left: 0, width: '100%' }}>
        <Button size="small" onClick={() => changeStep(false)} disabled={currentStep < 1}>
          <KeyboardArrowLeft />
        </Button>

        <Typography variant="caption" style={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          SWIPE SCREEN
        </Typography>

        <Button size="small" onClick={() => changeStep()}>
          <KeyboardArrowRight />
        </Button>
      </div>

    </BasicPage>
  )
}


const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  affidavits: state.affidavits,
  people: state.people,
});


const mapDispatchToProps = (dispatch, ownProps) => ({
  ...ownProps,
  changeAttribute: (id, attribute, value) => dispatch(changePersonAttribute(id, attribute, value)),
});


export default connect(mapStateToProps, mapDispatchToProps)(withRoot(EditPage));