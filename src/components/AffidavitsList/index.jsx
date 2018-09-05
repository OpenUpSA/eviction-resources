import React, { Component } from 'react';
import { connect } from 'react-redux';
import AffidavitPreview from './../AffidavitPreview';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import Typography from '@material-ui/core/Typography';


function AffidavitsList({ affidavits, people, itemClickCallback }) {
  const affidavitsKeys = Object.keys(affidavits);

  if (affidavitsKeys.length < 1) {
    return (
      <div style={{ textAlign: 'center' }}>       
        <ErrorOutlineIcon /> 
        <Typography component="p">
          You have not created any affidavits yet.
        </Typography>
      </div>
    )
  }

  return (
    <div>
      {
        affidavitsKeys.map((key) => {
          const { firstName, lastName } = people[affidavits[key].representative];
          const hasFirstAndLastNames = firstName && lastName;
          const displayName = hasFirstAndLastNames ? `${firstName} ${lastName}` : 'Unknown Person'
          const occupants = Object.keys(affidavits[key].people).length;
          const date = new Date(affidavits[key].created);

          return (
            <div style={{ margin: '0.5rem' }} key={key} onClick={() => itemClickCallback && itemClickCallback(key)}>
              <AffidavitPreview name={displayName} occupants={occupants} date={date} />
            </div>
          )
        })
      }
    </div>
  )
}

export default AffidavitsList;