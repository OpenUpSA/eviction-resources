import React, { Component } from 'react';
import { connect } from 'react-redux';
import Link from 'gatsby-link';
import { pick } from 'lodash';

import { addAffidavit as addAffidavitAction } from '../redux/actions';
import { destroyAffidavit } from '../redux/modules/affidavits';
import AffidavitsList from '../components/AffidavitsList';
import withRoot from '../material-ui/withRoot';
import AnimateButton from '../components/AnimateButton';
import BasicPage from '../components/BasicPage';
import buildSemanticAffidavitFunc from '../services/buildSemanticAffidavitFunc';

class AffidavitsPage extends Component {
  constructor(...props) {
    super(...props);

    this.state = {
      notification: null,
      loading: true,
    };

    this.events = {
      deletePrompt: this.deletePrompt.bind(this),
      sendEmail: this.sendEmail.bind(this),
      createSemanticAffidavit: buildSemanticAffidavitFunc(this.props),
      createSemanticObject: this.createSemanticObject.bind(this),
    };
  }

  componentDidMount() {
    return this.setState({ loading: false });
  }


  createSemanticObject() {
    const { loading } = this.state;

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

    if (!loading) {
      return buildSemanticAffidavitFunc(pick(this.props, propsExtract));
    }

    return null;
  }


  sendEmail(id) {
    const { createSemanticAffidavit } = this.events;
    const { meta } = createSemanticAffidavit(id);
    const { name, completed } = meta;
    // const emailBody = encodeURIComponent(convertAnswersIntoEmail(questions))
    const emailBody = 'asdasd';

    const emailUrl = `mailto:shaun@nu.org.za?subject=Eviction%20Affidavit%3A%20${name}&body=${emailBody}`;

    if (completed === 100) {
      return window.open(emailUrl, '_blank');
    }

    return this.setState({
      notification: {
        title: 'Missing content',
        description: 'The affidavit has not been completed, do you want to send in its current state?',
        open: true,
        close: () => this.setState({ notification: null }),
        reject: {
          text: 'Cancel',
          click: () => this.setState({ notification: null }),
        },
        approve: {
          text: 'Send',
          click: emailUrl,
        },
      },
    });
  }


  deletePrompt(id) {
    const { deleteAffidavit } = this.props;

    const click = () => {
      deleteAffidavit(id);
      return this.setState({ notification: null });
    };

    const notification = {
      open: true,
      title: 'Confirm deletion',
      description: 'Note that once an affidavit is delete it can not be recovered again.', 
      reject: {
        text: 'Cancel',
        click: () => this.setState({ notification: null }),
      },
      approve: {
        text: 'Delete',
        click,
      },
    };

    this.setState({ notification });
  }

  render() {
    const { addAffidavit } = this.props;
    const { notification, loading } = this.state;
    const { deletePrompt, sendEmail, createSemanticObject } = this.events;

    return (
      <Markup
        {...{
          loading,
          deletePrompt,
          notification,
          sendEmail,
          addAffidavit,
          createSemanticObject,
        }}
      />
    );
  }
}


function Markup(props) {
  const {
    deletePrompt,
    notification,
    sendEmail,
    loading,
    createSemanticObject,
  } = props;


  if (loading) {
    return (
      <BasicPage
        back="/"
        title="Saved Affidavits"
        selected="View all affidavits"
      >
        Loading...
      </BasicPage>
    );
  }

  return (
    <BasicPage
      modalProps={notification}
      back="/"
      title="Saved Affidavits"
      expanded="Affidavits"
      selected="View all affidavits"
    >
      <div>
        <AffidavitsList
          deleteCb={deletePrompt}
          sendCb={sendEmail}
          createObj={createSemanticObject()}
        />
      </div>
      <Link to="/disclaimer" style={{ textDecoration: 'none' }}>
        <AnimateButton style={{ marginTop: '3rem' }} variant="contained" color="primary" fullWidth size="large" text="Create Affidavit" />
      </Link>
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
});


const mapDispatchToProps = (dispatch, ownProps) => ({
  ...ownProps,
  addAffidavit: () => dispatch(addAffidavitAction()),
  deleteAffidavit: id => dispatch(destroyAffidavit(id)),
});


export default connect(mapStateToProps, mapDispatchToProps)(withRoot(AffidavitsPage));