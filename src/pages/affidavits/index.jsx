import React, { Component } from 'react';
import { connect } from 'react-redux';
import Link from 'gatsby-link';


import { addAffidavit as addAffidavitAction } from './../../redux/actions';
import { destroyAffidavit } from './../../redux/modules/affidavits';
import AffidavitsList from './../../components/AffidavitsList';
import withRoot from '../../material-ui/withRoot';
import AnimateButton from '../../components/AnimateButton';
import BasicPage from './../../components/BasicPage';
import createSemanticObject from './../../utilities/createSemanticObject';


const calcCompleted = object => {
  const amount = Object.keys(object).filter(key => object[key] !== '').length;
  const total = Object.keys(object).length;
  return Math.floor((amount / total) * 100);
}


const buildQuestion = (question, answer, index) => {
  return `\n${index}. ${question} ${answer}\n`
}


const convertStateIntoEmail = data => {
  return Object.keys(data).map((name, index) => buildQuestion(`${name}:`, data[name], `${index + 1}`))
}


class AffidavitsPage extends Component {
  constructor(...props) {
    super(...props);

    this.state = {
      notification: null,
      loading: true,
    }

    this.events = {
      deletePrompt: this.deletePrompt.bind(this),
      sendEmail: this.sendEmail.bind(this),
    }
  }

  componentDidMount() {
    return this.setState({ loading: false })
  }

  sendEmail(id) {
    const { people, affidavits } = this.props;
    const info = createSemanticObject(people[affidavits[id].representative]);
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


  deletePrompt(id) {
    const { deleteAffidavit } = this.props;

    this.setState({
      notification: {
        open: true, 
        title: 'Confirm deletion',
        description: 'Note that once an affidavit is delete it can not be recovered again.', 
        reject: {
          text: 'Cancel',
          click: () => this.setState({ notification: null })
        },
        approve: {
          text: 'Delete',
          click: () => {
            deleteAffidavit(id);
            this.setState({ notification: null })
          },
        },
      }
    })
  }

  render() {
    const { affidavits, people, addAffidavit } = this.props;
    const { notification, loading } = this.state;
    const { deletePrompt, sendEmail } = this.events;
    return <Markup {...{ loading, affidavits, people, deletePrompt, notification, sendEmail, addAffidavit }} />
  }
}



/**
 * Presentational component for affidavit about page
 */
function Markup({ affidavits, people, addAffidavit, deletePrompt, notification, sendEmail, loading }) {
  if (loading) {
    return (
      <BasicPage 
        back="/"
        title="Saved Affidavits"
        selected="View all affidavits"
      >
        Loading...
      </BasicPage>
    )
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
          {...{ affidavits, people }}
          deleteCb={deletePrompt}
          sendCb={sendEmail}
        />
      </div>
      <Link to="/disclaimer" style={{ textDecoration: 'none' }}>
        <AnimateButton style={{ marginTop: '3rem' }} variant="contained" color="primary" fullWidth size="large" text="Create Affidavit" />
      </Link>
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
  addAffidavit: () => dispatch(addAffidavitAction()),
  deleteAffidavit: id => dispatch(destroyAffidavit(id)),
});


export default connect(mapStateToProps, mapDispatchToProps)(withRoot(AffidavitsPage));