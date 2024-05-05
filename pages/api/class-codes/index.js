import { getServerSession } from "next-auth/next";
import * as db from "../../../services/database.mjs";

export default async function handler(req, res) {
    const session = await getServerSession(req, res);

    if (req.method === "GET") {
        console.log("session contains", session);
        if (!session) {
            return res.status(401).json("Unauthorized");
        }
        const classCodes = await db.getClassCodes(session.user.email);
        res.status(200).json(classCodes);
    }
    else if (req.method === "POST"){
        if (!session) {
            return res.status(401).json("Unauthorized");
        }

        const data = req.body
        if (!data.id){
            return res.status(400).json({message: "id field is missing"});
        }

        //console.log("POST session", session)
        const classCode = await db.createClassCode({id: data.id, owner: session.user.email});
        
        return res.status(201).json(classCode);
    }

    


}

