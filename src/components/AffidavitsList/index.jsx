import React, { Component } from 'react';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import Typography from '@material-ui/core/Typography';
import { mean } from 'lodash';

import AffidavitPreview from './../AffidavitPreview';
import createSemanticObject from './../../utilities/createSemanticObject';


const calcCompleted = object => {
  const amount = Object.keys(object).filter(key => object[key] !== '').length;
  const total = Object.keys(object).length;
  return Math.floor((amount / total) * 100);
}


const calcPreviewProps = (id, affidavits, people) => {
  const { firstName, lastName } = people[affidavits[id].representative];
  const hasFirstAndLastNames = firstName && lastName;
  const name = hasFirstAndLastNames ? `${firstName} ${lastName}` : 'Unknown Person'
  const occupants = Object.keys(affidavits[id].people).length;
  const date = new Date(affidavits[id].created);
  const completed = calcCompleted(createSemanticObject(people[affidavits[id].representative]))

  return {
    completed,
    name,
    occupants,
    date,
  }
}


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


function AffidavitsList(props) {
  const {
    affidavits,
    people,
    itemClickCallback,
    deleteCb: deleteCbRaw,
    sendCb: sendCbRaw,
  } = props

  const affidavitsKeys = Object.keys(affidavits);

  if (affidavitsKeys.length < 1) {
    return (
      <div style={{ textAlign: 'center' }}>       
        <ErrorOutlineIcon style={{ fontSize: '3rem' }} /> 
        <Typography component="p">
          You have not created any affidavits yet.
        </Typography>
      </div>
    )
  }

  return (
    <div>
      {
        affidavitsKeys.map((key, index) => {
          const styling = index !== affidavitsKeys.length - 1 ? { marginBottom: '2rem' } : {};
          const deleteCb = deleteCbRaw ? () => deleteCbRaw(key) : null;
          const id = key;
          const sendCb = sendCbRaw ? () => sendCbRaw(key) : null;
          const props = { ...calcPreviewProps(key, affidavits, people), deleteCb, sendCb, id }

          return (
            <div style={styling} key={key} onClick={() => itemClickCallback && itemClickCallback(key)}>
              <AffidavitPreview {...props} />
            </div>
          )
        })
      }
    </div>
  )
}

export default AffidavitsList;