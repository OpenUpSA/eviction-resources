import React, { Component } from 'react';
import Link from 'gatsby-link';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import { connect } from 'react-redux';
import InputAdornment from '@material-ui/core/InputAdornment';
import Chip from '@material-ui/core/Chip';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

import BasicPage from './../../components/BasicPage';
import withRoot from '../../material-ui/withRoot';
import AnimateButton from '../../components/AnimateButton';
import createSemanticObject from './../../utilities/createSemanticObject';
import { changePersonAttribute } from './../../redux/modules/people';


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
    }

    this.events = {
      sendEmail: this.sendEmail.bind(this),
    }
  }

  componentDidMount() {
    const { affidavits } = this.props;
    const { id } = getQueryParams(document.location.search)
    const personId = affidavits[id].representative;
    return this.setState({ personId })
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
    const { personId, notification } = this.state;
    const { changeAttribute, affidavits, people } = this.props;
    const { sendEmail } = this.events;
    return <Markup {...{ sendEmail, changeAttribute, affidavits, people, personId, notification }} />
  }
}


const actions = event => <AnimateButton onClick={event} variant="contained" color="primary" fullWidth size="large" text="Send" />;


const createBuildInput = (personId, changeAttribute, people) => {
  return (id, label, otherProps = {}) => (
    <Card style={{ margin: '2rem 0' }}>
      <CardContent>
        <FormControl fullWidth>
          <TextField
            value={people[personId][id]}
            onChange={event => changeAttribute(personId, id, event.target.value)}
            margin="normal"
            InputLabelProps={{ style: { fontSize: '14px' }}}
            {...{ id, label }}
            {...otherProps}
          />
        </FormControl>
      </CardContent>
    </Card>
  )
}


const createBuildSelect = (personId, changeAttribute, people) => {
  return (id, label, options) => (
    <Card style={{ margin: '2rem 0' }}>
      <CardContent>
        <FormControl fullWidth>
          <InputLabel htmlFor={id} style={{ fontSize: '14px' }}>{label}</InputLabel>
          <Select
            value={people[personId][id]}
            onChange={event => changeAttribute(personId, id, event.target.value)}
            input={<Input name={id} id={id} />}
          >
            {
              options.map(value => <MenuItem key={value} value={value}>{value}</MenuItem>)
            }
          </Select>
        </FormControl>
      </CardContent>
    </Card>
  )
}


const calcCompleted = object => {
  const amount = Object.keys(object).filter(key => object[key] !== '').length;
  const total = Object.keys(object).length;
  return Math.floor((amount / total) * 100);
}


/**
 * Presentational component for affidavit about page
 */
function Markup({ changeAttribute, people, personId, notification, sendEmail }) {
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

  const buildInput = createBuildInput(personId, changeAttribute, people);
  const buildSelect = createBuildSelect(personId, changeAttribute, people);
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
      <Card style={{ margin: '2rem 0' }}>
        <CardContent>
          <FormControl fullWidth>
            <TextField
              value={input}
              onChange={event => updateText(event.target.value)}
              margin="normal"
              label={label}
              id={id}
              style={{ marginBottom: '2rem' }}
              InputLabelProps={{ style: { fontSize: '14px' }}}
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
        </CardContent>
      </Card>
    )
  }

  return (
    <BasicPage 
      modalProps={notification}
      actions={actions(() => sendEmail(personId))}
      heading="Affidavit Overview"
      back="/affidavits"
      expanded="Affidavit"
      selected="Affidavit Overview"
    >
        <Typography component="p" color="primary" style={{ marginTop: '2rem' }}>
          {completed}% completed
        </Typography>
        <LinearProgress variant="determinate" value={completed} style={{ marginBottom: '2rem' }} />
        <form>
          {buildInput('firstName', 'First Name')}
          {buildInput('lastName', 'Last Name')}
          {buildSelect('gender', 'Gender', ['Male', 'Female', 'Other'])}
          {buildInput('age', 'Age', { type: 'number', min: 18, max: 120 })}
          {buildSelect('married', 'Are you married?', ['No', 'Yes'])}
          {buildSelect('speakingEnglish', 'How well do you speak English?', ['Excellent', 'Okay', 'Poor'])}
          {buildSelect('readingEnglish', 'How well do you read English?', ['Excellent', 'Okay', 'Poor'])}
          {buildSelect('writingEnglish', 'How well do you write English?', ['Excellent', 'Okay', 'Poor'])}
          {buildSelect('preferedLanguage', 'Prefered language', ["Afrikaans", "Southern Sotho", "Tsonga", "English", "Tswana", "Swati", "Zulu", "Northern Sotho", "Ndebele", "Xhosa", "Venda"])}
          {buildSelect('citizen', 'Are you South African citizen?', ["No", "Yes"])}
          {person.citizen === 'Yes' && buildInput('idNumber', 'South African Id Number', { type: 'number', max: 9999999999 })}
          {person.citizen === 'No' && buildInput('immigrationStatus', 'Your immigration status?', ["Refugee status", "Asylumn seeker permit", 'Undocumented/expired permit'])}
          {person.immigrationStatus === 'Refugee status' && buildInput('refugeeId', 'Refugee Id Number', { type: 'number', max: 9999999999 })}
          {buildSelect('employed', 'Are you currently employed?', ["No", "Yes"])}
          {person.employed === 'Yes' && buildInput('startEmployYear', 'Current job started year?', { type: 'number', min: 1900, max: 2018 })}
          {person.employed === 'Yes' && buildSelect('startEmployMonth', 'Current job started month?', ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"])}
          {buildInput('earnMonthly', 'How much earned a month?', { type: 'number', min: 0, max: 1000000, InputProps: { startAdornment: <InputAdornment position="start">R</InputAdornment> } })}
          {buildSelect('soleBreadwinner', 'Are you the sole breadwinner?', ["No", "Yes"])}
          {buildSelect('soleRentPayer', 'Do you pay rent alone?', ["No", "Yes"])}
          {buildSelect('healthProblems', 'Do you have health problems?', ["No", "Yes"])}
          {person.healthProblems === 'Yes' && <List id="healthProblemsList" label="Type a health problem here" />}
          {buildSelect('disability', 'Do you have disabilities?', ["No", "Yes"])}
          {person.disability === 'Yes' && <List id="disabilityList" label="Type a disability here" />}
          {buildInput('phone', 'What is your phone number?')}
        </form>
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