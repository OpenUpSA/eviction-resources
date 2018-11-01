import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import PageTransition from 'gatsby-plugin-page-transitions';
import Swipeable from 'react-swipeable';

import Header from '../Header';
import Menu from '../Menu';
import Modal from '../Modal';

/**
 * Control state of landing page/splash screen. Add loading animation to 'Get started' button if
 * next page has not been prefetched by Gatsby yet.
 */
class BasicPage extends Component {
  constructor(...props) {
    super(...props);

    this.state = {
      menu: false,
    };

    this.events = {
      setMenu: this.setMenu.bind(this),
    };
  }

  setMenu(value) {
    if (value === false) {
      return this.setState({ menu: false });
    }

    return this.setState({ menu: true });
  }

  render() {
    const { loading, menu } = this.state;
    const { setMenu } = this.events;
    const {
      modalProps,
      title,
      back,
      actions,
      heading,
      progress,
      expanded,
      selected,
      children,
      swipeLeft,
      swipeRight,
    } = this.props;

    return (
      <Markup
        {...{
          loading,
          title,
          back,
          children,
          actions,
          heading,
          progress,
          menu,
          setMenu,
          expanded,
          selected,
          modalProps,
          swipeLeft,
          swipeRight,
        }}
      />
    );
  }
}


/**
 *
 * @param props - React props object.
 * @param props.title - The page title to be rendered in header and as browser page title.
 * @param props.heading - The page heading, to be rendered as the h1.
 * @param props.children - React components that should be placed in the 'main' tag, usually
 * contains text and input fields.
 */
function Markup(props) {
  const {
    title,
    back,
    children,
    heading,
    progress,
    menu,
    setMenu,
    expanded,
    selected,
    swipeLeft,
    swipeRight,
    modalProps = { open: false },
  } = props;


  const headingMarkup = (
    <div style={{ marginBottom: '2rem' }}>
      <Typography variant="display1" component="h1" style={{ textAlign: 'center' }}>
        {heading}
      </Typography>
    </div>
  );

  const buildProgressMarkup = (progress) => (
    <div>
      <Typography component="p">
        Step {progress.current}/{progress.total}
      </Typography>
      <MobileStepper
        variant="dots"
        steps={progress.total}
        position="static"
        activeStep={progress.current - 1}
      />
    </div>
  )

  const rootStyle = {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  };

  const mainStyle = {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    padding: '2rem',
    position: 'relative',
    width: '100%',
    maxWidth: '600px',
    margin: '0 auto',
  };

  return (
    <Swipeable onSwipedLeft={swipeLeft} onSwipedRight={swipeRight} style={rootStyle}>
      <Modal {...modalProps} />
      <Menu
        {...{ expanded, selected }}
        open={menu}
        onClose={() => setMenu(false)}
        onOpen={() => setMenu(true)}
      />
      <Header {...{ title, back, setMenu }} />
      <main style={mainStyle}>
        {progress && buildProgressMarkup(progress)}
        <PageTransition>
          <div>
            {heading && headingMarkup}
            {children}
          </div>
        </PageTransition>
      </main>
    </Swipeable>
  );
}


export default BasicPage;
