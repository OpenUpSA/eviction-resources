import { flatten } from 'lodash';

import { createArrayOfNumbers } from '../helpers';


const calcPossesive = (name, language = 'en') => {
  if (language === 'en') {
    const endsInS = /s$/i.test(name);

    if (endsInS) {
      return `${name}'`;
    }

    return `${name}'s`;
  }

  return null;
};


const calcPronoun = (gender, language = 'en') => {
  if (language === 'en') {
    switch (gender) {
      case 'Male': return 'his';
      case 'Female': return 'her';
      default: return 'their';
    }
  }

  return null;
};


const buildPersonQuestions = (personId, people) => {
  const person = people[personId];
  const pronoun = calcPronoun(person.gender);
  const { firstName } = person;
  const possesiveName = calcPossesive(firstName);


  const questionsList = [
    {
      id: 'lastName',
      type: 'string',
      en: {
        example: 'Smith',
        label: `What is ${possesiveName} last name?`,
      },
    },
    {
      id: 'relationToRep',
      type: 'dropdown',
      en: {
        label: `What is ${possesiveName} relationship to you?`,
        options: [
          'Husband / Wife',
          'Child',
          'Parent',
          'Brother / Sister',
          'Girlfriend / Boyfriend',
          'Grandparents',
          'Grandchild',
          'Cousin',
          'Uncle / Aunt',
          'Nephew / Niece',
          'No relation',
        ],
      },
    },
    {
      id: 'gender',
      type: 'buttons',
      en: {
        label: `What is ${possesiveName} gender?`,
        options: [
          'Male',
          'Female',
          'Other',
        ],
      },
    },
    {
      id: 'age',
      type: 'dropdown',
      en: {
        label: `How old is ${firstName}?`,
        options: createArrayOfNumbers({ start: 0, times: 100 }),
      },
    },
    {
      id: 'married',
      type: 'buttons',
      condition: person.relationToRep !== 'Husband / Wife',
      en: {
        label: `Is ${firstName} married?`,
        options: [
          'No',
          'Yes',
        ],
      },
    },
    {
      id: 'married',
      type: 'buttons',
      condition: person.married === 'Yes',
      en: {
        label: `Does ${firstName} support ${pronoun} spouse?`,
        options: [
          'No',
          'Yes',
        ],
      },
    },
    {
      id: 'children',
      type: 'buttons',
      en: {
        label: `Does ${firstName} have children?`,
        options: [
          'No',
          'Yes',
        ],
      },
    },
    {
      id: 'childrenLiving',
      type: 'dropdown',
      condition: person.children === 'Yes',
      en: {
        label: `How many of ${pronoun} children live on the property?`,
        options: createArrayOfNumbers({ start: 0, times: 15 }),
      },
    },
    {
      id: 'citizenship',
      type: 'buttons',
      en: {
        label: `Is ${firstName} a citizen of South Africa?`,
        options: [
          'No',
          'Yes',
        ],
      },
    },
    {
      id: 'idNumber',
      condition: person.citizenship === 'Yes',
      type: 'number',
      en: {
        example: '7209118011355',
        label: `What is ${pronoun} ID number?`,
      },
    },
    {
      id: 'residenceStatus',
      type: 'buttons',
      condition: person.citizenship === 'No',
      en: {
        label: `What is ${pronoun} residence status?`,
        options: [
          'Refugee status',
          'Asylumn seeker permit',
          'Undocumented or expired permit',
        ],
      },
    },
    {
      id: 'refugeeId',
      type: 'number',
      condition: (
        person.residenceStatus === 'Refugee status'
        || person.residenceStatus === 'Asylum seeker permit'
      ),
      en: {
        example: '7209118011355',
        label: `What is ${pronoun} permit number?`,
      },
    },
    {
      id: 'healthProblems',
      type: 'buttons',
      en: {
        label: `Does ${firstName} have any long term health problems or disabilities?`,
        options: [
          'No',
          'Yes',
        ],
      },
    },
    {
      id: 'healthProblemsList',
      condition: person.healthProblems === 'Yes',
      type: 'string',
      en: {
        label: `Can you specify ${pronoun} health problem or disability?`,
      },
    },
    // {
    //   id: 'healthProblemsList',
    //   condition: person.healthProblems === 'Yes',
    //   type: 'dropdown-multiple',
    //   en: {
    //     label: 'Please specify a health problem or disability',
    //     options: [
    //       'Alzheimer\'s Disease / Dementia',
    //       'Arthritis',
    //       'Asthma',
    //       'Bipolar Depression',
    //       'Blindness',
    //       'Back Pain',
    //       'Cancer',
    //       'Diabetes',
    //       'Deafness',
    //       'Impaired Movement',
    //       'Epilepsy',
    //       'Haemophilia',
    //       'Heart Disease',
    //       'HIV',
    //       'Parkinson\'s disease',
    //       'Lung Disease',
    //       'Kidney Disease',
    //       'Schizophrenia',
    //     ],
    //   },
    // },
    // TODO: WHY IS THIS BREAKING?
    // {
    //   id: 'employment',
    //   type: 'buttons',
    //   en: {
    //     label: `Is ${firstName} currently employed?`,
    //     options: [
    //       'No',
    //       'Yes, full-time',
    //       'Yes, but only part-time',
    //     ],
    //   },
    // },
    // {
    //   id: 'workType',
    //   condition: person.employment === 'Yes',
    //   type: 'dropdown',
    //   en: {
    //     label: `What does ${pronoun} do for work?`,
    //     options: ['Domestic Worker', 'Care Taker', 'Technician', 'Other'],
    //   },
    // },
    {
      id: 'workType',
      condition: person.employment === 'Yes',
      type: 'string',
      en: {
        label: `Please specify what ${firstName} does for work?`,
      },
    },
    {
      id: 'alternativeIncome',
      condition: person.employment === 'No',
      type: 'buttons',
      en: {
        label: `Does ${pronoun} have other sources of income?`,
        options: [
          'No',
          'Yes',
        ],
      },
    },
    {
      id: 'monthlyEarn',
      condition: (
        person.employment === 'Yes'
        || (
          person.employment === 'No'
          && person.alternativeIncome === 'Yes'
        )
      ),
      type: 'dropdown',
      en: {
        label: `What is ${possesiveName} total income per month?`,
        options: [
          ...createArrayOfNumbers({
            start: 500,
            times: 25,
            increment: 500,
            prefix: 'R',
          }),
          'Other',
        ],
      },
    },
    {
      id: 'school',
      type: 'buttons',
      en: {
        label: `Does ${firstName} go to School?`,
        options: [
          'No',
          'Yes',
        ],
      },
    },
    {
      id: 'schoolDistance',
      condition: person.school === 'Yes',
      type: 'dropdown',
      en: {
        label: `How far away is ${pronoun} school?`,
        options: [
          'Less than 1 kilometer',
          'Between 1 and 5 kilometers',
          'More than 10 kilometers',
        ],
      },
    },
    {
      id: 'specialNeedsSchool',
      condition: person.school === 'Yes',
      type: 'buttons',
      en: {
        label: `Is ${possesiveName} school a special needs school?`,
        options: [
          'No',
          'Yes',
        ],
      },
    },
    {
      id: 'cellphone',
      type: 'buttons',
      en: {
        label: `Does ${firstName} have a cellphone?`,
        options: [
          'No',
          'Yes',
        ],
      },
    },
    {
      id: 'phoneNumber',
      condition: person.cellphone === 'Yes',
      type: 'number',
      en: {
        example: '0748114782',
        label: `What is ${pronoun} phone number?`,
      },
    },
    {
      id: 'socialInstitutions',
      type: 'buttons',
      en: {
        label: `Are there any social institutions in the neighbourhood which ${firstName} uses regularly?`,
        options: [
          'No',
          'Yes',
        ],
      },
    },
    // {
    //   id: 'healthProblemsList',
    //   condition: person.healthProblems === 'Yes',
    //   type: 'dropdown-multiple',
    //   en: {
    //     label: 'Please specify a social institution',
    //     options: [
    //       'Youth Club',
    //       'Sports Club',
    //       'Soup Kitchen',
    //       'Daycare',
    //       'Hospital / Clinic',
    //       'Bank',
    //       'Church',
    //       'Other,
    //     ],
    //   },
    // },
  ];

  return questionsList.map(question => ({
    ...question,
    reference: 'people',
    referenceId: personId,
  }));
};


const representativeQuestions = (representativeId, people) => {
  const representative = people[representativeId];

  const questionsList = [
    {
      id: 'firstName',
      type: 'string',
      en: {
        example: 'John',
        label: 'What is your first name?',
      },
    },
    {
      id: 'lastName',
      type: 'string',
      en: {
        example: 'Smith',
        label: 'What is your last name?',
      },
    },
    {
      id: 'gender',
      type: 'buttons',
      en: {
        label: 'What is your gender?',
        options: [
          'Male',
          'Female',
          'Other',
        ],
      },
    },
    {
      id: 'age',
      type: 'dropdown',
      en: {
        label: 'What is your age?',
        options: createArrayOfNumbers({ start: 18, times: 82 }),
      },
    },
    {
      id: 'married',
      type: 'buttons',
      en: {
        label: 'Are you married',
        options: [
          'No',
          'Yes',
        ],
      },
    },
    {
      id: 'englishSpeaking',
      type: 'buttons',
      en: {
        label: 'How comfortable are you speaking English?',
        options: [
          'Excellent',
          'Okay',
          'Poor',
        ],
      },
    },
    {
      id: 'englishReading',
      type: 'buttons',
      en: {
        label: 'How comfortable are you reading English?',
        options: [
          'Excellent',
          'Okay',
          'Poor',
        ],
      },
    },
    {
      id: 'englishWriting',
      type: 'buttons',
      en: {
        label: 'How comfortable are you writing in English?',
        options: [
          'Excellent',
          'Okay',
          'Poor',
        ],
      },
    },
    {
      id: 'preferedLanguage',
      type: 'buttons',
      en: {
        label: 'Do you have a prefered language other than English?',
        options: [
          'No',
          'Yes',
        ],
      },
    },
    {
      id: 'preferedLanguageSelection',
      condition: representative.preferedLanguage === 'Yes',
      type: 'dropdown',
      en: {
        label: 'What language do you prefer?',
        options: [
          'Afrikaans',
          'Xhosa',
          'Zulu',
          'Northern Sotho',
          'Tswana',
          'SeSotho',
          'Tsonga',
          'Swati',
          'Venda',
          'Ndebele',
          'Swahili',
          'Shona',
          'French',
          'Portuguese',
        ],
      },
    },
    {
      id: 'citizenship',
      type: 'buttons',
      en: {
        label: 'Are you a South African citizen?',
        options: [
          'No',
          'Yes',
        ],
      },
    },
    {
      id: 'idNumber',
      condition: representative.citizenship === 'Yes',
      type: 'number',
      en: {
        example: '7209118011355',
        label: 'What is your ID number?',
      },
    },
    {
      id: 'residenceStatus',
      type: 'buttons',
      condition: representative.citizenship === 'No',
      en: {
        label: 'What is your residence status?',
        options: [
          'Refugee status',
          'Asylumn seeker permit',
          'Undocumented or expired permit',
        ],
      },
    },
    {
      id: 'refugeeId',
      type: 'number',
      condition: (
        representative.residenceStatus === 'Refugee status'
        || representative.residenceStatus === 'Asylum seeker permit'
      ),
      en: {
        example: '7209118011355',
        label: 'What is your permit number?',
      },
    },
    {
      id: 'employment',
      type: 'buttons',
      en: {
        label: 'Are you currently employed?',
        options: [
          'No',
          'Yes, full-time',
          'Yes, but only part-time',
        ],
      },
    },
    {
      id: 'employmentStart',
      condition: representative.employment.includes('Yes'),
      type: 'month-year',
      en: {
        label: 'Since when have you been employed at your current place of work?',
      },
    },
    // {
    //   id: 'workType',
    //   condition: representative.employment === 'Yes',
    //   type: 'dropdown',
    //   en: {
    //     label: 'What do you do for work?',
    //     options: [
    //       'Domestic Worker',
    //       'Care Taker',
    //       'Technician',
    //       'Other',
    //     ],
    //   },
    // },
    {
      id: 'workType',
      condition: representative.employment === 'Yes',
      type: 'string',
      en: {
        label: 'Please specify what you do for work?',
      },
    },
    {
      id: 'alternativeIncome',
      condition: representative.employment === 'No',
      type: 'buttons',
      en: {
        label: 'Do you have other sources of income?',
        options: [
          'No',
          'Yes',
        ],
      },
    },
    {
      id: 'monthlyEarn',
      condition: (
        representative.employment === 'Yes'
        || (
          representative.employment === 'No'
          && representative.alternativeIncome === 'Yes'
        )
      ),
      type: 'dropdown',
      en: {
        label: 'What is your total income per month?',
        options: [
          ...createArrayOfNumbers({
            start: 500,
            times: 25,
            increment: 500,
            prefix: 'R',
          }),
          'Other',
        ],
      },
    },
    {
      id: 'monthlyEarnOther',
      condition: representative.monthlyEarn === 'Other',
      type: 'string',
      en: {
        label: 'Please specify your total income per month?',
      },
    },

    {
      id: 'breadwinner',
      type: 'buttons',
      en: {
        label: 'Do you support your family alone?',
        options: [
          'No',
          'Yes',
        ],
      },
    },
    {
      id: 'rentPayer',
      type: 'buttons',
      en: {
        label: 'Do you pay the rent alone?',
        options: [
          'No',
          'Yes',
        ],
      },
    },
    {
      id: 'healthProblems',
      type: 'buttons',
      en: {
        label: 'Do you have any long term health problems or disabilities?',
        options: [
          'No',
          'Yes',
        ],
      },
    },
    {
      id: 'healthProblemsList',
      condition: representative.healthProblems === 'Yes',
      type: 'string',
      en: {
        label: 'Can you specify your health problem or disability?',
      },
    },
    // {
    //   id: 'healthProblemsList',
    //   condition: representative.healthProblems === 'Yes',
    //   type: 'dropdown-multiple',
    //   en: {
    //     label: 'Please specify a health problem or disability',
    //     options: [
    //       'Alzheimer\'s Disease / Dementia',
    //       'Arthritis',
    //       'Asthma',
    //       'Bipolar Depression',
    //       'Blindness',
    //       'Back Pain',
    //       'Cancer',
    //       'Diabetes',
    //       'Deafness',
    //       'Impaired Movement',
    //       'Epilepsy',
    //       'Haemophilia',
    //       'Heart Disease',
    //       'HIV',
    //       'Parkinson\'s disease',
    //       'Lung Disease',
    //       'Kidney Disease',
    //       'Schizophrenia',
    //       'Other,
    //     ],
    //   },
    // },
    {
      id: 'phoneNumber',
      type: 'number',
      en: {
        example: '0748114782',
        label: 'What is your phone number?',
      },
    },
  ];

  return questionsList.map(question => ({
    ...question,
    reference: 'people',
    referenceId: representativeId,
  }));
};


const affidavitQuestions = (affidavits, affidavitId) => {
  const affidavit = affidavits[affidavitId];

  const questionsList = [
    {
      id: 'occupants',
      type: 'occupants',
      en: {
        label: 'How many people, excluding yourself, permanently reside (live) in the place with you?',
        options: createArrayOfNumbers({ start: 0, times: 20 }),
      },
    },
    {
      id: 'occupants-list',
      condition: affidavit.people.length > 1,
      type: 'occupants-list',
      instances: affidavit.people.length,
      en: {
        label: 'Please list the first names off all occupants:',
      },
    },
  ];

  return questionsList.map(question => ({
    ...question,
    referenceId: affidavitId,
  }));
}


const propertyQuestions = (propertyId, properties) => {
  const property = properties[propertyId];

  const questionsList = [
    {
      id: 'suburb',
      type: 'string',
      en: {
        example: 'Sea Point',
        label: 'What suburb is the property in?',
      },
    },
    {
      id: 'street',
      type: 'string',
      en: {
        example: 'Main Avenue or Church Street',
        label: 'What is the name of the street the property is in?',
      },
    },
    {
      id: 'number',
      type: 'number',
      en: {
        example: '11',
        label: 'What number is the property in question?',
      },
    },
    {
      id: 'type',
      type: 'dropdown',
      en: {
        label: 'What type of property is the place in question?',
        options: [
          'Informal structure like a shack or wendy house',
          'Entire house',
          'Entire apartment/flat',
          'Room in a house',
          'Room in an apartment',
        ],
      },
    },
    {
      id: 'number',
      type: 'number',
      condition: (
        property.type === 'entire apartment/flat'
        || property.type === 'room in an apartment'
      ),
      en: {
        example: '41',
        label: 'What unit number do you occupy? ',
      },
    },
    {
      id: 'startLiving',
      type: 'month-year',
      en: {
        label: 'When did you start living in the place in question?',
      },
    },
    {
      id: 'fixedLease',
      type: 'buttons',
      en: {
        label: 'Have you ever had a fixed-period lease for the current property?',
        options: [
          'No',
          'Yes',
        ],
      },
    },
    {
      id: 'leaseType',
      condition: property.fixedLease === 'Yes',
      type: 'buttons',
      en: {
        label: 'How was the lease agreement made?',
        options: [
          'Verbal',
          'Written',
        ],
      },
    },
    {
      id: 'leasePeriod',
      condition: property.fixedLease === 'Yes',
      type: 'dropdown',
      en: {
        label: 'How long was the fixed-period lease for?',
        options: createArrayOfNumbers({
          start: 1,
          times: 24,
          affix: ' Months',
        }),
      },
    },
    {
      id: 'monthToMonthLease',
      type: 'buttons',
      condition: property.fixedLease === 'No',
      en: {
        label: 'Do you lease month-to-month?',
        options: [
          'No',
          'Yes',
        ],
      },
    },
    {
      id: 'leasePeriod',
      condition: (
        property.monthToMonthLease === 'No'
        || property.monthToMonthLease === 'Yes'
      ),
      type: 'month-year',
      en: {
        label: 'When did you start leasing month-to-month?',
      },
    },
    {
      id: 'arrears',
      type: 'buttons',
      en: {
        label: 'Are you in arrears with rental?',
        options: [
          'No',
          'Yes',
        ],
      },
    },
    {
      id: 'arrearsReason',
      condition: property.arrears === 'Yes',
      type: 'dropdown',
      en: {
        label: 'Why did you stop paying',
        options: [
          'Lost my job',
          'Illness',
          'Death of the breadwinner',
          'Accident',
          'Landlord breached the lease agreement',
        ],
      },
    },
    {
      id: 'arrearsAmount',
      condition: property.arrears === 'Yes',
      type: 'dropdown',
      reference: property,
      en: {
        label: 'Roughly how much do you currently owe in arrears?',
        options: createArrayOfNumbers({
          start: 1,
          times: 50,
          increment:
          1000,
          prefix: 'R',
        }),
      },
    },
    {
      id: 'arrearsPay',
      condition: property.arrears === 'Yes',
      type: 'buttons',
      reference: property,
      en: {
        label: 'Have you tried to settle these payments with your landlord?',
        options: [
          'No',
          'Yes',
        ],
      },
    },
    {
      id: 'arrearsResponse',
      condition: (
        property.arrears === 'Yes'
        && property.arrearsPay === 'Yes'
      ),
      type: 'buttons',
      en: {
        label: 'Was your landlord helpful when you tried to come to an agreement to pay off your arrears?',
        options: [
          'No',
          'Yes',
        ],
      },
    },
    {
      id: 'condition',
      type: 'buttons',
      en: {
        label: 'What is the condition of the property?',
        options: [
          'Perfect',
          'Some things broken',
          'Many things broken',
          'It is unlivable',
        ],
      },
    },
    {
      id: 'landlordProblems',
      type: 'buttons',
      en: {
        label: 'Have you had any problems with your agency/landlord while living there?',
        options: [
          'No',
          'Yes',
        ],
      },
    },
    // {
    //   id: 'landlordProblemsList',
    //   condition: property.landlordProblems === 'Yes',
    //   type: 'dropdown-multiple',
    //   en: {
    //     label: 'Please specify a problem with your agency/landlord',
    //     options: [
    //       'Did not refund deposit',
    //       'I got an unlawful notice to vacate',
    //       'Exorbitant increase in rental',
    //       'Did not accept cancellation of my lease',
    //       'Failure to provide water, electricity, etc.',
    //       'Failure to pay rental or municipal services',
    //       'Failure to do maintenance',
    //       'Unlawful lockout or eviction',
    //       'Secretly changing terms of agreement',
    //       'Unlawful entry onto property',
    //       'Unlawful seizure of possessions',
    //       'Failure to furnish receipts for payment',
    //       'Failure to reduce lease to writing',
    //       'Other',
    //     ],
    //   },
    // },
    {
      id: 'housingTribunal',
      type: 'buttons',
      en: {
        label: 'Did you ever take any of these complaints to the Rental Housing Tribunal?',
        options: [
          'No',
          'Yes',
        ],
      },
    },
    {
      id: 'housingTribunalOutcome',
      condition: property.housingTribunal === 'Yes',
      type: 'string',
      en: {
        label: 'What was the outcome?',
      },
    },
    {
      id: 'leaseCancel',
      type: 'dropdown',
      en: {
        label: 'How did you find out your lease was cancelled (the landlord wanted you to leave)?',
        options: [
          'They told you in person',
          'They sent you a letter',
          'Their lawyer sent you a letter',
          'They sent you an email',
          'Their lawyer sent you a email',
          'They sent you a text or whatsapp',
          'You received court papers from the Sheriff',
          'Other',
        ],
      },
    },
    {
      id: 'leaseCancelDate',
      type: 'day-month-year',
      en: {
        label: 'When did you find out your lease was cancelled?',
      },
    },
    {
      id: 'vacateDate',
      type: 'day-month-year',
      en: {
        label: 'What date were you told to vacate (leave) the property by?',
      },
    },
    {
      id: 'leaseCancelReason',
      type: 'string',
      en: {
        label: 'What reason did your landlord give for the cancellation of your lease?',
      },
    },
    {
      id: 'leaseCancelDispute',
      type: 'buttons',
      en: {
        label: 'Do you dispute any or all of the reasons given for the cancellation of your lease?',
        options: [
          'No',
          'Yes',
        ],
      },
    },
    {
      id: 'leaseCancelDisputeReason',
      type: 'string',
      en: {
        label: 'What reason did your landlord give for the cancellation of your lease?',
      },
    },
    {
      id: 'sheriffExplainPapers',
      type: 'buttons',
      en: {
        label: 'If you received court papers, did the Sheriff explain them to?',
        options: [
          'No',
          'Yes',
        ],
      },
    },
  ];

  return questionsList.map(question => ({
    ...question,
    reference: 'properties',
    referenceId: propertyId,
  }));
};


const legalQuestions = (lawyerId, lawyers) => {
  const lawyer = lawyers[lawyerId];

  const questionsList = [
    {
      id: 'representing',
      type: 'buttons',
      en: {
        label: 'Do you have a lawyer that is representing you in your eviction matter?',
        options: [
          'No',
          'Yes',
        ],
      },
    },
    {
      id: 'name',
      condition: lawyer.representing === 'Yes',
      type: 'string',
      en: {
        label: 'What is the lawyer\'s name?',
      },
    },
    {
      id: 'number',
      condition: lawyer.representing === 'Yes',
      type: 'number',
      en: {
        example: '0748114782',
        label: 'What is their phone number?',
      },
    },
    {
      id: 'approachedLawyer',
      type: 'dropdown',
      en: {
        label: 'Where have you gone to look for a lawyer?',
        options: [
          'I have not looked for a lawyer',
          'Legal Aid SA',
          'The Cape Law Society',
          'Legal resources Centre',
          'UCT Law Clinic',
          'UCT Refugee Law Clinic',
          'A Private Lawyer',
          'Other',
        ],
      },
    },
    {
      id: 'rememberSpeakDate',
      condition: lawyer.representing === 'Yes',
      type: 'buttons',
      en: {
        label: 'Do you remember on what day you spoke to them?',
        options: [
          'No',
          'Yes',
        ],
      },
    },
    {
      id: 'speakDate',
      type: 'day-month-year',
      en: {
        label: 'What date did you speak to them?',
      },
    },
    {
      id: 'approachedProof',
      condition: lawyer.representing === 'Yes',
      type: 'dropdown',
      en: {
        label: 'Do you have proof that you approached them?',
        options: [
          'No',
          'Yes, I have a letter',
          'Other',
        ],
      },
    },
    {
      id: 'approachedResponse',
      condition: lawyer.representing === 'Yes',
      type: 'buttons',
      en: {
        label: 'Did they respond to your request for legal representation?',
        options: [
          'No',
          'Yes',
        ],
      },
    },
    {
      id: 'approachedResponseDetails',
      condition: lawyer.approachedResponse === 'Yes',
      type: 'buttons',
      en: {
        label: 'Was your application accepted or rejected?',
        options: [
          'Rejected',
          'Accepted',
          'I am not sure',
        ],
      },
    },
    {
      id: 'name',
      condition: lawyer.approachedResponse === 'Rejected',
      type: 'string',
      en: {
        label: 'What reasons were given?',
      },
    },
  ];

  return questionsList.map(question => ({
    ...question,
    reference: 'lawyers',
    referenceId: lawyerId,
  }));
};


function buildQuestions(params) {
  const {
    peopleIds,
    people,
    propertyId,
    properties,
    lawyerId,
    lawyers,
    affidavits,
    affidavitId,
  } = params;

  const [representative, ...otherOccupants] = peopleIds;

  return [
    ...representativeQuestions(representative, people),
    ...affidavitQuestions(affidavits, affidavitId),
    ...flatten(otherOccupants.map(id => buildPersonQuestions(id, people))),
    ...propertyQuestions(propertyId, properties),
    ...legalQuestions(lawyerId, lawyers),
    {
      id: 'send',
      type: 'send',
      en: {
        label: 'Do you want to send your answers to a lawyer?',
      },
    },
  ];
}


export default buildQuestions;
