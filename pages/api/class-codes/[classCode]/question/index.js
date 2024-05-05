// GET /api/class-codes/:class-codes/question returns 200 with questions from class code
// POST /api/class-codes/:class-codes/question returns 404 when no class code found
// POST /api/class-codes/:class-codes/question returns 201 when a new question is created
// POST /api/class-codes/:class-codes/question returns 201 when a new question is created by an anonymous user
import { getServerSession } from "next-auth/next"
import * as db from '../../../../../services/database.mjs';

export default async function handler(req, res) {
  const session = await getServerSession(req, res)
  const classCode = req.query['classCode'];
  const dbObj = await db.openDb();
  const classCodeCheck = dbObj.classCodes.filter(c => c.id === classCode);

  if (classCodeCheck.length == 0){
    return res.status(404).json({ message: "Class code not found" });
  }

  if (req.method === 'GET') {
    const classCodeQuestions = await db.getQuestions(classCode);
    return res.status(200).json(classCodeQuestions);
  } else if (req.method === 'POST') {
    const { question, name } = req.body;
    
    const effectiveName = name && name.trim() !== '' ? name : 'anon';

    //console.log("in index.js... EFFECTIVE name is ", effectiveName, "question is ", question)
    const newQuestion = await db.createQuestionForClassCode(classCode, { question, name: effectiveName });
    //console.log("in index.js... response is ", newQuestion)
    return res.status(201).json(newQuestion);
  } else {
    return res.setHeader('Allow', ['GET', 'POST']).status(405).end(`Method ${req.method} Not Allowed`);
  }
}

  
