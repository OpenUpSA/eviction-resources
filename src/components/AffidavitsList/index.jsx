import React from 'react';
import { connect } from 'react-redux';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import Typography from '@material-ui/core/Typography';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import AffidavitPreview from '../AffidavitPreview';
import './styles.css';


function AffidavitsList(props) {
  const {
    affidavits,
    deleteCb: deleteCbRaw,
    sendCb: sendCbRaw,
    createObj,
  } = props;

  const affidavitsKeys = Object.keys(affidavits);

  if (affidavitsKeys.length < 1) {
    return (
      <div style={{ textAlign: 'center' }}>
        <ErrorOutlineIcon style={{ fontSize: '3rem' }} />
        <Typography component="p">
          You have not created any affidavits yet.
        </Typography>
      </div>
    );
  }

  return (
    <TransitionGroup>
      {
        affidavitsKeys.map((key, index) => {
          const { meta } = createObj(key);
          const {
            name,
            occupants,
            completed,
            date,
            created,
          } = meta;

          const styling = index !== affidavitsKeys.length - 1 ? { marginBottom: '2rem' } : {};
          const deleteCb = deleteCbRaw ? () => deleteCbRaw(key) : null;
          const sendCb = sendCbRaw ? () => sendCbRaw(key) : null;
          const editUrl = `/edit?id=${key}`;

          const passedProps = {
            name,
            occupants,
            completed,
            date,
            deleteCb,
            sendCb,
            editUrl,
            created,
          };

          return (
            <CSSTransition
              key={key}
              timeout={400}
              classNames="delete"
              className="delete"
            >
              <div style={styling}>
                <AffidavitPreview {...passedProps} />
              </div>
            </CSSTransition>
          );
        })
      }
    </TransitionGroup>
  );
}


const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  affidavits: state.affidavits,
  people: state.people,
});


export default connect(mapStateToProps)(AffidavitsList);
