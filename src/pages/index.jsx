import React, { Component } from 'react'
import Link from 'gatsby-link';
import Typography from '@material-ui/core/Typography';

import BasicPage from '../components/BasicPage';
import AnimateButton from '../components/AnimateButton';
import withRoot from '../material-ui/withRoot';


class IndexPage extends Component {
  constructor(...props) {
    super(...props);

    this.state = {
      notification: null,
    };

    this.events = {
      setNotification: this.setNotification.bind(this),
    };
  }

  setNotification(notification) {
    if (!notification) {
      return this.setState({ notification: null });
    }

    return this.setState({ notification });
  }

  render() {
    const { setNotification } = this.events;
    const { notification } = this.state;
    return <Markup {...{ notification, setNotification }} />;
  }
}


function Markup({ notification, setNotification }) {
  const evictionGlossary = {
    title: 'Eviction',
    description: 'An order, passed down by a judge or magistrate in a court, that states that you must leave the property you are living in or face physical removal.',
    open: true,
    close: () => setNotification(),
    reject: {
      text: 'Close',
      click: () => setNotification(),
    },
  };

  const lawyerGlossary = {
    title: 'Lawyer',
    description: 'A person who practices law and can help you to effectively fight your case in court in front of a judge or magistrate.',
    open: true,
    close: () => setNotification(),
    reject: {
      text: 'Close',
      click: () => setNotification(),
    },
  };

  const consultationGlossary = {
    title: 'Glossary',
    description: 'A meeting with an expert (in this case a lawyer) in which the details of your case are discussed, in order to seek good advice.',
    open: true,
    close: () => setNotification(),
    reject: {
      text: 'Close',
      click: () => setNotification(),
    },
  };

  return (
    <BasicPage 
      modalProps={notification}
      heading="Introduction"
      expanded="Overview"
      selected="Introduction"
    >
      <div>
        <Typography component="p" style={{ marginBottom: '1.5rem' }}>
          This tool was designed to help you if you are at risk of <span onClick={() => setNotification(evictionGlossary)} style={{ textDecoration: 'underline', color: 'blue', cursor: 'pointer' }}>eviction</span>. It will help you gather important information about your case so that you can present it to the lawyer or NGO who is helping you.
        </Typography>
        <Typography component="p" style={{ marginBottom: '1.5rem' }}>
          Answering the questions will help the <span onClick={() => setNotification(lawyerGlossary)} style={{ textDecoration: 'underline', color: 'blue', cursor: 'pointer' }}>lawyer</span> to quickly understand all the relevant details of your case so that they can advise you as best they can.
        </Typography>
        <Typography component="p" style={{ marginBottom: '2.5rem' }}>
          Gathering the correct information in advance is important because <span onClick={() => setNotification(consultationGlossary)} style={{ textDecoration: 'underline', color: 'blue', cursor: 'pointer' }}>consultation</span> time with a lawyer can be very expensive. This tool will help you speed up the process, so that you can take action in your case as soon as possible. 
        </Typography>
        <Link to="/affidavits" style={{ textDecoration: 'none' }}>
          <AnimateButton variant="contained" color="primary" fullWidth size="large" text="Get Started" />
        </Link>

      </div>
    </BasicPage>
  )
}


export default withRoot(IndexPage);