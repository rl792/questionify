// GET /api/class-codes/:class-code returns 404 when no class session found

import { getServerSession } from "next-auth/next"
import {openDb} from '../../../../services/database.mjs';

export default async function handler(req, res) {
    const {classCodeTest} = req.query
    const db = await openDb()
    if (req.method === 'GET') {
        const classCodeCheck = db.classCodes.filter(classCode => classCode.id === classCodeTest)
        if (classCodeCheck.length === 0) {
            return res.status(404).json('Class code not found')
        }
    }
  }