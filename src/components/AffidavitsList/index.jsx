import React, { Component } from 'react';
import AffidavitPreview from './../AffidavitPreview';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import Typography from '@material-ui/core/Typography';
import { mean } from 'lodash';


function determinePercentageCompleted(object) {
  const completed = Object.keys(object).reduce(
    (result, key) => {
      if (
        (
          typeof object[key] === 'string' &&
          object[key] === ''
        ) ||
        (
          Array.isArray(object[key]) &&
          object[key].length < 1
        )
      ) {
        return result;
      }
      
      return result + 1;
    },
    0
  )

  const length = Object.keys(object).length;
  return Math.floor((completed / length) * 100);
}

function calcEntireAverageCompleted(affidavitId, affidavits, people) {
  const affidavit = affidavits[affidavitId]
  const array = affidavit.people.map(id => determinePercentageCompleted(people[id]))
  const meanResult = mean(array);
  return affidavit.people.length === 1 ? Math.floor(meanResult / 3) : meanResult;
}


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
          const completed = calcEntireAverageCompleted(key, affidavits, people);

          return (
            <div style={{ margin: '0.5rem' }} key={key} onClick={() => itemClickCallback && itemClickCallback(key)}>
              <AffidavitPreview name={displayName} occupants={occupants} date={date} completed={completed} />
            </div>
          )
        })
      }
    </div>
  )
}

export default AffidavitsList;