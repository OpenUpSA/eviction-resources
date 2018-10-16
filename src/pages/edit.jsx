import React, { Component } from 'react';
import { pick, mapValues } from 'lodash';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';
import Link from 'gatsby-link';

import { changePersonAttribute as changePersonAttributeAction } from '../redux/modules/people';
import { changePropertyAttribute as changePropertyAttributeAction } from '../redux/modules/properties';
import { changeLawyerAttribute as changeLawyerAttributeAction } from '../redux/modules/lawyers';
import { saveProgress as saveProgressAction } from '../redux/modules/user';

import buildSemanticAffidavitFunc from '../services/buildSemanticAffidavitFunc';
import withRoot from '../material-ui/withRoot';
import BasicPage from '../components/BasicPage';
import { decodeUrlParams } from '../services/helpers/helpers';
import CardSlider from '../components/CardSlider';
import QuestionWrapper from '../components/QuestionWrapper';
import DirectionButtons from '../components/DirectionButtons';


class EditPage extends Component {
  constructor(...props) {
    super(...props);

    this.state = {
      affidavitId: null,
      error: false,
    };

    this.events = {
      changeStep: this.changeStep.bind(this),
      createSemanticObject: this.createSemanticObject.bind(this),
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


  createSemanticObject() {
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
    const stateExtract = ['error', 'affidavitId'];
    const eventsExtract = ['changeStep', 'createSemanticObject'];

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
  const { error, affidavitId } = props;
  const { changeStep, createSemanticObject } = props;

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
  const { questions, meta } = createSemanticObject()(affidavitId);

  const {
    completed,
    validQuestions,
  } = meta;

  const questionsMarkup = mapValues(
    questions,
    (questionObject) => {
      const {
        reference,
        referenceId,
        id: questionId,
        ...otherProps
      } = questionObject;

      return (
        <QuestionWrapper
          name={`${referenceId}-${questionId}`}
          proceed={changeStep}
          {...otherProps}
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
    >
      <Typography component="p" color="primary" style={{ marginBottom: '0.5rem' }}>
        {`${completed}% completed`}
      </Typography>
      <LinearProgress variant="determinate" value={completed} style={{ marginBottom: '2rem' }} />

      <CardSlider markupObject={questionsMarkup} selected={step} />
      <DirectionButtons
        current={step + 1}
        total={validQuestions.length}
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
  property: state.property,
  laywers: state.lawyers,
  userLanguage: state.user.language,
  currentProgressObject: state.user.currentProgressObject,
});


const mapDispatchToProps = (dispatch, ownProps) => ({
  ...ownProps,
  changePersonAttribute: (id, attribute, value) => {
    return dispatch(changePersonAttributeAction(id, attribute, value))
  },
  changePropertyAttribute: (id, attribute, value) => {
    return dispatch(changePropertyAttributeAction(id, attribute, value))
  },
  changeLawyerAttribute: (id, attribute, value) => {
    return dispatch(changeLawyerAttributeAction(id, attribute, value))
  },
  saveProgress: (id, step) => {
    return dispatch(saveProgressAction(id, step));
  },
});


export default connect(mapStateToProps, mapDispatchToProps)(withRoot(EditPage));
