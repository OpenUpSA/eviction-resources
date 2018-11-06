import { pick } from 'lodash';
import buildQuestions from './buildQuestions';


const buildSemanticAffidavitFunc = props => (id) => {
  const {
    affidavits,
    people,
    properties,
    lawyers,
    changePersonAttribute,
    changePropertyAttribute,
    changeLawyerAttribute,
    language = 'en',
  } = props;

  const affidavit = affidavits[id];
  const { representative, property: propertyId, lawyer: lawyerId } = affidavit;
  const otherOccupants = affidavit.people.filter(personId => personId !== representative);

  const questionParams = {
    affidavits,
    affidavitId: id,
    peopleIds: [representative, ...otherOccupants],
    people,
    propertyId,
    properties,
    lawyerId,
    lawyers,
  };

  const questionsArray = buildQuestions(questionParams);
  const validQuestions = questionsArray.filter(({ condition }) => condition !== false);

  const inferActionFromReference = (reference, questionId, attribute) => {
    switch (reference) {
      case 'people': return value => changePersonAttribute(questionId, attribute, value);
      case 'properties': return value => changePropertyAttribute(questionId, attribute, value);
      case 'lawyers': return value => changeLawyerAttribute(questionId, attribute, value);
      default: return null;
    }
  };

  const normalisedQuestions = validQuestions.reduce(
    (result, val) => {
      const changeAction = inferActionFromReference(val.reference, val.referenceId, val.id);
      const answer = val.reference ? props[val.reference][val.referenceId][val.id] : true;

      return {
        ...result,
        [`${val.referenceId}-${val.id}`]: {
          ...pick(val, ['id', 'type', 'condition', 'instances', 'reference', 'referenceId']),
          ...pick(val[language], ['label', 'example', 'options']),
          changeAction,
          answer,
          affidavitId: id,
        },
      };
    },
    {},
  );

  const answeredQuestions = Object.keys(normalisedQuestions)
    .filter(key => !!normalisedQuestions[key].answer);

  const completed = Math.floor(answeredQuestions.length / validQuestions.length * 100);
  const { firstName } = people[affidavits[id].representative];
  const { lastName } = people[affidavits[id].representative];
  const hasName = firstName && lastName;
  const name = hasName ? `${firstName} ${lastName}` : 'Unspecified Representative';

  return {
    questions: normalisedQuestions,
    meta: {
      completed,
      questionsArray: questionsArray.length,
      validQuestions: Object.keys(normalisedQuestions).length,
      answeredQuestions: answeredQuestions.length,
      occupants: affidavit.people.length,
      created: new Date(affidavit.created),
      name,
    },
  };
};


export default buildSemanticAffidavitFunc;
