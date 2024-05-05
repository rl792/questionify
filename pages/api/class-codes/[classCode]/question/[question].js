// DELETE /api/class-codes/:class-codes/question/:question-id returns 200 when a question is deleted

import { getServerSession } from "next-auth/next"; 
import {nextAuthOptions} from '../../../../../pages/api/auth/[...nextauth].js';
import * as db from '../../../../../services/database.mjs';

export default async function handler(req, res) {
  console.log("in delete question")
  if (req.method === 'DELETE') {
    const session = await getServerSession(req, res, nextAuthOptions);

    // Check if the user is an instructor
    if (!session || session.user.role !== 'instructor') {
      return res.status(403).json({ message: "Not authorized" });
    }
    // console.log("helppppp", req.query)
    const questionId = req.query['question'];
    // console.log("inside [q] question id is ", questionId)
    const questionDeleted = await db.deleteQuestion(questionId);
    return res.status(200).json({ message: "Question deleted" });
  } else {
      return res.setHeader('Allow', ['DELETE']).status(405).end(`Method ${req.method} Not Allowed`);
  }
}
