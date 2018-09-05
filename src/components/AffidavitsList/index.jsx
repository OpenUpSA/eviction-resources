import React, { Component } from 'react';
import { connect } from 'react-redux';
import AffidavitPreview from './../AffidavitPreview';

function AffidavitsList() {
  return (
    <div>
      {
        [1,2].map((key) => {
          return (
            <div style={{ margin: '0.5rem' }} key={key}>
              <AffidavitPreview name="Schalk Venter" occupants={3} date={new Date()} />
            </div>
          )
        })
      }
    </div>
  )
}


const mapStateToProps = (state, ownProps) => ({
  ...ownProps,
  affidavits: state.affidavits,
  people: state.people,
});


const mapDispatchToProps = (dispatch, ownProps) => ({
  ...ownProps,
});


export default connect(mapStateToProps, mapDispatchToProps)(AffidavitsList);