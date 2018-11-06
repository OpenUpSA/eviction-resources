import React, { Component } from 'react';
import * as emailjs from 'emailjs-com';
import { connect } from 'react-redux';
import Link from 'gatsby-link';
import { pick } from 'lodash';
import TextField from '@material-ui/core/TextField';

import { addAffidavit as addAffidavitAction } from '../redux/actions';
import { destroyAffidavit } from '../redux/modules/affidavits';
import AffidavitsList from '../components/AffidavitsList';
import withRoot from '../material-ui/withRoot';
import AnimateButton from '../components/AnimateButton';
import BasicPage from '../components/BasicPage';
import buildSemanticAffidavitFunc from '../services/buildSemanticAffidavitFunc';
import convertAnswersIntoEmail from '../services/convertAnswersIntoEmail';


// const convertToInternationalNumber = (number) => {
//   return number.replace(/^0/, '27');
// };


class AffidavitsPage extends Component {
  constructor(...props) {
    super(...props);

    this.state = {
      notification: null,
      loading: true,
    };

    // this.values = {
    //   whatsappInputNode: null,
    // };

    this.events = {
      deletePrompt: this.deletePrompt.bind(this),
      sendEmail: this.sendEmail.bind(this),
      createSemanticObject: this.createSemanticObject.bind(this),
      // updateWhatsappNode: this.updateWhatsappNode.bind(this),
    };
  }


  componentDidMount() {
    return this.setState({ loading: false });
  }


  // updateWhatsappNode(node) {
  //   this.values.whatsappInputNode = node;
  // }

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
    const { createSemanticObject } = this.events;
    const { meta, questions } = createSemanticObject()(id);
    const { completed, name } = meta;

    const success = {
      title: 'Affidavit sent',
      description: 'The affidavit was sent to Ndifuna Ukwazi. Someone will be in contact with you soon.',
      open: true,
      close: () => this.setState({ notification: null }),
      reject: {
        text: 'Close',
        click: () => this.setState({ notification: null }),
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
        .then(() => { this.setState({ notification: success }); });
    };

    // const sendMessage = (number) => {
    //   const emailBody = encodeURIComponent(convertAnswersIntoEmail(questions));
    //   const messageUrl = `https://api.whatsapp.com/send?phone=${convertToInternationalNumber(number)}&text=${emailBody}`;
    //   window.open(messageUrl, '_blank');
    //   return this.setState({ notification: null });
    // };
    //
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
    //       click: () => sendMessage(),
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
  properties: state.properties,
  lawyers: state.lawyers,
  userLanguage: state.user.language,
});


const mapDispatchToProps = (dispatch, ownProps) => ({
  ...ownProps,
  addAffidavit: () => dispatch(addAffidavitAction()),
  deleteAffidavit: id => dispatch(destroyAffidavit(id)),
});


export default connect(mapStateToProps, mapDispatchToProps)(withRoot(AffidavitsPage));