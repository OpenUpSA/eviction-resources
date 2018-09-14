const calcCitizenValues = (citizen, idNumber, immigrationStatus, refugeeId) => {
  if (citizen === 'Yes') {
    return {
      citizen,
      idNumber,
    }
  }

  if (citizen === 'No' && immigrationStatus === 'Refugee status') {
    return {
      citizen,
      immigrationStatus,
      refugeeId,
    }
  }

  return {
    citizen,
    immigrationStatus,
  }
}


const calcEmploymentValues = (employed, startEmployYear, startEmployMonth) => {
  if (employed === 'Yes') {
    return {
      employed,
      startEmployYear,
      startEmployMonth,
    }
  }

  return {
    employed,
  }
}


const calcHealthValues = (healthProblems, healthProblemsList) => {
  if (healthProblems) {
    return {
      healthProblems,
      healthProblemsList,
    }
  }

  return {
    healthProblems,
  }
}

function createSemanticObject(person) {
  const {
    citizen,
    idNumber,
    immigrationStatus,
    refugeeId,
    employed,
    startEmployYear,
    startEmployMonth,
    healthProblems, 
    healthProblemsList,
    relationship,
    ...basicValues,
  } = person;

  return {
    ...basicValues,
    ...calcCitizenValues(citizen, idNumber, immigrationStatus, refugeeId),
    ...calcEmploymentValues(employed, startEmployYear, startEmployMonth),
    ...calcHealthValues(healthProblems, healthProblemsList),
  }
}


export default createSemanticObject;