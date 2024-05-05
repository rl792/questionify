import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession, signIn} from 'next-auth/react';
import Link from 'next/link';
import Question from '../../components/Question';

/* CS5356 TODO 1a. Navigation

Create a new page at /app/[classCode] - this will be a Dynamic Page, 
where the content of the page will be different based on the
class code. This will be the page where users can ask questions
for a given class code.

This page should include 2 things
1. A short form at the top of the page with 2 text inputs,
one for the question itself, and another for an optional
name, with a button to submit the question. Make a 
POST /api/class-codes/[classCode]/question request with the data,
and re-fetch the data on the page to display the latest data.
2. A list that displays all the questions that have been 
asked for that class code. When the page first loads, make a 
GET /api/class-codes/[classCode]/question to get all the 
questions for the given class code.*/

export default function ClassCodeQuestionsPage(){
    const router = useRouter();
    const classCode = router.query.classCode;
    const {data: session, status} = useSession()
    const [question, setQuestion] = useState([]);
    const [classCodeExists, setClassCodeExists] = useState(null);

    const fetchQuestion = async (c) => {

      const response = await fetch(`/api/class-codes/${c}/question`);
      if (response.ok) {
        //console.log("response is ", response);
        const text = await response.text(); // Get the response as a text
        if (text) {
          const data = JSON.parse(text);
          // Only parse as JSON if there is a response body
          //console.log("printing out text is ", text, "and data is ,,,,", data);
          setQuestion(data);
          setClassCodeExists(true);
        } else {
          setQuestion([]); // Assuming an empty list is appropriate in this case
          setClassCodeExists(true); // The class code exists but has no questions
        }
      } else {
        setClassCodeExists(false);
      }
    }
    
    useEffect(() => {
        if(classCode) { // Ensure classCode is not undefined
            fetchQuestion(classCode);
        }
    }, [classCode])

    if (classCodeExists === false) {
      return <div>
                <section className='section'>
                    No Class code found
                    <Link href='/'> Search for a new class code </Link>
                </section>
              </div>;
    }

    const onQuestionSubmitted = async (event) => {
        event.preventDefault()
        const Question = event.target.QuestionInput.value
        const name = event.target.NameInput.value
        //console.log("name is ", name, "question is ", Question)

        if (!name) {
          name = 'anon';
      }

      const response = await fetch(`/api/class-codes/${classCode}/question`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ question: Question, name: name})
          
      })
      //console.log("response is ", response)
      if (response.ok){
          await fetchQuestion(classCode);
      }
    }

    const isUserInstructor = session?.user?.role === 'instructor';

    const onQuestionDeleted = async (question) => {
      //console.log("deletting in [cc]", question);
      const response = await fetch(`/api/class-codes/${classCode}/question/${question}`, {
        method: 'DELETE'
      });
      //console.log("Response status:", response.status);
      const data = await response.json();
      //console.log("Server response:", data);
    
      if (response.ok) {
        await fetchQuestion(classCode);

      } else {
        console.error('Failed to delete the question:', data.message);
      }
    };
    

    return (
        <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '80vh',
            backgroundColor: '#f5f5f5'
          }}>
            
          <h6 style={{fontSize: '30px', paddingBottom: '20px'}}> 
            This is the {classCode} questions page
          </h6>
          <br/>
          <section style={{paddingBottom: '30px'}}>

            <form onSubmit={(event) => onQuestionSubmitted(event)}>
              <div className="field">
                <label className="label">What is your name? It is optional</label>
                <div className="control">
                  <input className="input" style={{ width: '300px' }} type="text" name="NameInput" placeholder="Name"/>
                </div>
              </div>
      
              <div className="field">
                <label className="label">What is your question?</label>
                <div className="control">
                  <input className="input" style={{ width: '300px' }} type="text" name="QuestionInput" placeholder="Question"/>
                </div>
              </div>
      
              <div className="field">
                <div className="control">
                  <button className="button is-primary">Submit</button>
                </div>
              </div>
            </form>
          </section>

          <section className='section'  style={{
            backgroundColor: '#bac4f1',
            paddingLeft:'100px',
            paddingRight:'100px',
            paddingBottom:'20px',
            maxHeight: '500px',
            overflowY: 'auto',
            paddingTop:'20px'}}>
            <div className='title is-5'>View Questions</div>
              <div style={{width: '100%'}}>
                {question.length > 0 && question.map((q, index) => (
                  <Question
                    key={index}
                    question={q}
                    onQuestionDeleted={onQuestionDeleted} // Pass the delete handler
                    isUserInstructor={isUserInstructor}
                    classCode={classCode}
                  />
                ))}
              </div>
            </section>          
        </div>
    );
}
