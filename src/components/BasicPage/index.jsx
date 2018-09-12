import React, { Component } from 'react';
import Typography from '@material-ui/core/Typography';
import PageTransition from 'gatsby-plugin-page-transitions';

import styles from './styles.module.css';
import Header from './../Header';
import Menu from './../Menu';

/**
 * Control state of landing page/splash screen. Add loading animation to 'Get started' button if
 * next page has not been prefetched by Gatsby yet.
 */
class BasicPage extends Component {
  constructor(...props) {
    super(...props);

    this.state = {
      loading: false,
      menu: false,
    }

    this.events = {
      setLoading: this.setLoading.bind(this),
      setMenu: this.setMenu.bind(this),
    }
  }

  setLoading() {
    this.setState({ loading: true })
  }

  setMenu(value) {
    if (value === false) {
      return this.setState({ menu: false })    
    }

    return this.setState({ menu: true })
  }

  render() {
    const { loading, menu } = this.state
    const { setLoading, setMenu } = this.events;
    const { title, back, children, actions, heading, progress, expanded, selected } = this.props;
    return (
      <Markup 
        {...{ 
          loading, 
          setLoading,
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
        }} 
      />
    )
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
  const { title, back, children, actions, heading, progress, menu, setMenu, expanded, selected } = props;

  const headingMarkup = (
    <div className={styles.heading}>
      <Typography variant="display1" component="h1">
        {heading}
      </Typography>
    </div>
  )

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

  const actionsMarkup = (
    <aside className={styles.actions}>
      {actions}
    </aside>
  )

  return (
    <div className={styles.root}>
      <Menu {...{ expanded, selected }} open={menu} onClose={() => setMenu(false)}/>
      <Header {...{ title, back, setMenu }} />
      <main className={styles.content}>      
        <PageTransition>
          {progress && buildProgressMarkup(progress)}
          {heading && headingMarkup}
          {children}
        </PageTransition>
      </main>
      {actions && actionsMarkup}
    </div>
  )
}


export default BasicPage;
