import React, { Component } from 'react';
import { pick, mapValues } from 'lodash';
import * as emailjs from 'emailjs-com';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';
import Link from 'gatsby-link';

import { changePersonAttribute as changePersonAttributeAction } from '../redux/modules/people';
import { changePropertyAttribute as changePropertyAttributeAction } from '../redux/modules/properties';
import { changeLawyerAttribute as changeLawyerAttributeAction } from '../redux/modules/lawyers';
import { saveProgress as saveProgressAction } from '../redux/modules/user';

import convertAnswersIntoEmail from '../services/convertAnswersIntoEmail';
import buildSemanticAffidavitFunc from '../services/buildSemanticAffidavitFunc';
import withRoot from '../material-ui/withRoot';
import BasicPage from '../components/BasicPage';
import { decodeUrlParams } from '../services/helpers';
import CardSlider from '../components/CardSlider';
import QuestionWrapper from '../components/QuestionWrapper';
import DirectionButtons from '../components/DirectionButtons';


// const convertToInternationalNumber = (number) => {
//   return number.replace(/^0/, '27');
// };


class EditPage extends Component {
  constructor(...props) {
    super(...props);

    this.state = {
      affidavitId: null,
      error: false,
      notification: null,
    };

    this.events = {
      changeStep: this.changeStep.bind(this),
      createSemanticAffidavit: this.createSemanticAffidavit.bind(this),
      sendEmail: this.sendEmail.bind(this),
    };
  }


  componentDidMount() {
    const { id } = decodeUrlParams(document.location.search);
    const { currentProgressObject, saveProgress } = this.props;
    const step = currentProgressObject[id];

    if (id && !step) {
      saveProgress(id, 0);
      this.setState({ affidavitId: id });
      return null;
    }

    if (id) {
      return this.setState({ affidavitId: id });
    }

    return this.setState({ error: true });
  }


  createSemanticAffidavit() {
    const { affidavitId } = this.state;

    const propsExtract = [
      'affidavits',
      'people',
      'affidavits',
      'people',
      'properties',
      'lawyers',
      'userLanguage',
      'changePersonAttribute',
      'changePropertyAttribute',
      'changeLawyerAttribute',
    ];

    if (affidavitId) {
      return buildSemanticAffidavitFunc(pick(this.props, propsExtract));
    }

    return null;
  }

  sendEmail(id) {
    const { createSemanticAffidavit } = this.events;
    const { questions, meta } = createSemanticAffidavit()(id);
    const { completed, name } = meta;

    const success = {
      title: 'Affidavit sent',
      description: 'The affidavit was sent to Ndifuna Ukwazi. Someone will be in contact with you soon.',
      open: true,
      close: () => this.setState({ notification: null }),
      reject: {
        text: 'Close',
        click: () => setTimeout(() => {
          this.setState({ notification: null });
          window.location = '/affidavits';
        }, 500),
      },
    };

    const sendAffidavit = () => {
      const emailBody = convertAnswersIntoEmail(questions).replace(/\n/g, '<br />');
      const templateParams = {
        name: name,
        email: emailBody,
      };

      // TODO: replace userID
      emailjs.send('mailgun', 'affidavit_generator', templateParams, 'user_qJ0zuc2mjEVewkzJpCnW7')
        .then(() => {
          this.setState({ notification: success });
        });
    };

    // const sendMessage = (number) => {
    //   const emailBody = encodeURIComponent(convertAnswersIntoEmail(questions));
    //   const messageUrl = `https://api.whatsapp.com/send?phone=${convertToInternationalNumber(number)}&text=${emailBody}`;
    //   window.open(messageUrl, '_blank');
    //   return this.setState({ notification: null });
    // };

    // TODO: Change modal asking for phone number to accommodate entering email address of lawyer?
    // const enterPhoneNo = (number) => {
    //   const newAddition = number.charAt(number.length - 1);
    //
    //   const calcIfValid = () => (
    //     number.length <= 10
    //     && (
    //       number.length < 1
    //       || !Number.isNaN(parseInt(newAddition, 10))
    //     )
    //   );
    //
    //   return {
    //     title: 'Whatsapp Number',
    //     description: 'Please provide the Whatsapp number supplied by your lawyer. For example \'0748152311\'',
    //     open: true,
    //     markup: (
    //       <TextField
    //         onChange={event => calcIfValid() && this.setState({
    //           notification: enterPhoneNo(event.target.value),
    //         })}
    //         margin="normal"
    //         autoFocus
    //         fullWidth
    //         value={number || ''}
    //         type="number"
    //       />
    //     ),
    //     close: () => this.setState({ notification: null }),
    //     reject: {
    //       text: 'Cancel',
    //       click: () => this.setState({ notification: null }),
    //     },
    //     approve: {
    //       text: 'Send as Email',
    //       click: () => sendAffidavit(),
    //     },
    //   };
    // };

    const incomplete = {
      title: 'Missing content',
      description: 'The affidavit has not been completed, do you want to send in its current state?',
      open: true,
      close: () => this.setState({ notification: null }),
      reject: {
        text: 'Cancel',
        click: () => this.setState({ notification: null }),
      },
      approve: {
        text: 'Continue',
        click: () => sendAffidavit(),
      },
    };

    if (completed === 100) {
      return this.setState({ notification: sendAffidavit() });
    }

    return this.setState({ notification: incomplete });
  }

  changeStep(value) {
    const { saveProgress, currentProgressObject } = this.props;
    const { affidavitId } = this.state;
    const step = currentProgressObject[affidavitId];

    if (value === false) {
      return saveProgress(affidavitId, step - 1);
    }

    return saveProgress(affidavitId, step + 1);
  }

  render() {
    const propsExtract = ['currentProgressObject'];
    const stateExtract = ['error', 'affidavitId', 'notification'];
    const eventsExtract = ['changeStep', 'createSemanticAffidavit', 'sendEmail'];

    const passedProps = {
      ...pick(this.props, propsExtract),
      ...pick(this.state, stateExtract),
      ...pick(this.events, eventsExtract),
    };
    return <Markup {...passedProps} />;
  }
}


function Markup(props) {
  const { currentProgressObject } = props;
  const { error, affidavitId, notification } = props;
  const { changeStep, createSemanticAffidavit, sendEmail } = props;

  if (error) {
    return (
      <BasicPage
        back="/affidavits"
        selected="Create an affidavit"
      >
        <div>
          <span>An error occured please return to the </span>
          <Link to="/">homepage</Link>
          <span> or contact </span>
          <a href="mailto:schalk@openup.org.za">schalk@openup.org.za</a>
        </div>
      </BasicPage>
    );
  }

  if (!affidavitId) {
    return (
      <BasicPage
        back="/affidavits"
        selected="Create an affidavit"
      >
        <div>Loading...</div>
      </BasicPage>
    );
  }

  const step = currentProgressObject[affidavitId];
  const { questions, meta } = createSemanticAffidavit()(affidavitId);

  const {
    completed,
    validQuestions,
  } = meta;

  const questionsMarkup = mapValues(
    questions,
    (questionObject) => {
      const {
        referenceId,
        id: questionId,
      } = questionObject;

      const sendMessage = () => sendEmail(affidavitId);

      return (
        <QuestionWrapper
          name={`${referenceId}-${questionId}`}
          proceed={changeStep}
          {...{ ...questionObject, sendMessage }}
        />
      );
    },
  );

  return (
    <BasicPage
      back="/affidavits"
      selected="Create an affidavit"
      swipeRight={() => step > 0 && changeStep(false)}
      swipeLeft={() => step + 1 < validQuestions.length && changeStep()}
      modalProps={notification}
    >
      <Typography component="p" color="primary" style={{ marginBottom: '0.5rem' }}>
        {`${completed}% completed`}
      </Typography>
      <LinearProgress variant="determinate" value={completed} style={{ marginBottom: '2rem' }} />

      <CardSlider markupObject={questionsMarkup} selected={step} />
      <DirectionButtons
        current={step + 1}
        total={validQuestions}
        leftClickCb={() => changeStep(false)}
        RightClickCb={() => changeStep()}
      />
    </BasicPage>
  );
}


const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  affidavits: state.affidavits,
  people: state.people,
  properties: state.properties,
  lawyers: state.lawyers,
  userLanguage: state.user.language,
  currentProgressObject: state.user.currentProgressObject,
});


const mapDispatchToProps = (dispatch, ownProps) => ({
  ...ownProps,
  changePersonAttribute: (id, attribute, value) => {
    return dispatch(changePersonAttributeAction(id, attribute, value));
  },
  changePropertyAttribute: (id, attribute, value) => {
    return dispatch(changePropertyAttributeAction(id, attribute, value));
  },
  changeLawyerAttribute: (id, attribute, value) => {
    return dispatch(changeLawyerAttributeAction(id, attribute, value));
  },
  saveProgress: (id, step) => {
    return dispatch(saveProgressAction(id, step));
  },
});


export default connect(mapStateToProps, mapDispatchToProps)(withRoot(EditPage));
