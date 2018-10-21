const convertAnswersIntoEmail = (semanticObject) => {
  const questionsArray = Object.keys(semanticObject).map(key => semanticObject[key]);
  const answeredQuestions = questionsArray.filter(({ answer }) => !!answer);
  const answersAsStrings = answeredQuestions.reduce(
    (result, val) => {
      const { label, answer, type } = val;

      if (type === 'send') {
        return result;
      }

      if (type === 'month-year') {
        const date = JSON.parse(answer);
        return `${result}${label}\n${date[1]} ${date[2]}\n\n`;
      }

      if (type === 'day-month-year') {
        const [day, month, year] = JSON.parse(answer);
        return `${result}${label}\n${day} ${month} ${year}\n\n`;
      }

      return `${result}${label}\n${answer}\n\n`;
    },
    '',
  );


  return answersAsStrings;
};


export default convertAnswersIntoEmail;
