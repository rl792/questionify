const Question = ({ question, onQuestionDeleted, isUserInstructor, classCode }) => {
  //console.log("Is user instructor:", isUserInstructor); 
  const formattedDate = question.id ? new Date(Number(question.id)).toLocaleString() : 'No date';

  return (
    <table className="table is-bordered" style={{width: 'auto' }}>
       <thead>
          <tr>
            <th>Question</th>
            <th>Asked by</th>
            <th>Date/Time</th>
            {isUserInstructor && <th>Actions</th>}
          </tr>
        </thead>
      <tbody>
        <tr>
          <td className="title is-6" style={{ verticalAlign: 'middle' }}>{question.question}</td>
          <td className="subtitle is-6" style={{ verticalAlign: 'middle' }}>{question.name || 'Anonymous'}</td>
          <td style={{ verticalAlign: 'middle' }}>
            <time dateTime={formattedDate}>{formattedDate}</time>
          </td>
          {isUserInstructor && (
            <td style={{ verticalAlign: 'middle' }}>
              <button className="button is-danger"
                onClick={() => onQuestionDeleted(question.id)}>Delete</button>
            </td>
          )}
        </tr>
      </tbody>
    </table>
  );
};

export default Question;
