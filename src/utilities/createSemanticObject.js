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


const calcHealthValues = (healthProblems, healthProblemsList, disability, disabilityList) => {
  if (healthProblems === 'Yes' && disability === 'Yes') {
    return {
      'Health Problems': healthProblems,
      'Health Problems List': JSON.parse(healthProblemsList).join(', '),    
      'Disabilities': disability,
      'Disabilities List:': JSON.parse(disabilityList).join(', '),   
    }
  }

  if (healthProblems === 'Yes') {
    return {
      'Health Problems': healthProblems,
      'Health Problems List': JSON.parse(healthProblemsList).join(', '),      
      'Disabilities': disability,
    }
  }

  if (disability === 'Yes') {
    return {
      'Health Problems': healthProblems,
      'Disabilities': disability,
      'Disabilities List:': JSON.parse(disabilityList).join(', '),  
    }
  }

  return {
    healthProblems,
    disability,
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
    disability,
    disabilityList,
    relationship,
    ...basicValues,
  } = person;

  return {
    ...basicValues,
    ...calcCitizenValues(citizen, idNumber, immigrationStatus, refugeeId),
    ...calcEmploymentValues(employed, startEmployYear, startEmployMonth),
    ...calcHealthValues(healthProblems, healthProblemsList, disability, disabilityList,),
  }
}


export default createSemanticObject;