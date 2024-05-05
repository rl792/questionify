import fsPromises from 'fs/promises'

/*
CS5356 TODO 2a. Data Model

Fill in the methods below that will create,
read, update, and delete data.

All the data will be stored in ./db.json so you can view
what your data looks like locally.
*/

export const openDb = async () => {
  // CS5356 TODO 2a Set the initial structure of your database here
  // @type {dbObject}
  let dbObject = {
    classCodes: [],
  }

  // Don't edit below this line.
  try {
    const text = await fsPromises.readFile('./db.json')
    return JSON.parse(text)
  } catch (err) {
    await saveData(dbObject)
    return dbObject
  }
}

export const getQuestions = async (classCode) => {
  const dbObject = await openDb()

  const classCodeObj = dbObject.classCodes.find(c => c.id === classCode);
  if (classCodeObj && classCodeObj.questions) {
    return classCodeObj.questions;
  }
  return [];
};

export const getClassCodes = async (username) => {
  const dbObject = await openDb()

  return dbObject.classCodes
    .filter(classCode => classCode.owner === username)
}

export const createQuestionForClassCode = async (classCode, question) => {
  const dbObject = await openDb()

  const classObj = dbObject.classCodes.find(c => c.id === classCode);

  if (!classObj) {
    //console.log('Class code not found');
    return null;
  }
  const qnContent = question.question
  //console.log("in database.mjs, name is ", question.name);

  const qnName = question.name
  const qnId = Date.now().toString();
  classObj.questions = classObj.questions || [];
  const newQuestion = {
    question: qnContent,
    name: qnName,
    id: qnId
    //upvotes: 0
  };
  classObj.questions.push(newQuestion);
  await saveData(dbObject);
  return newQuestion;
};

export const createClassCode = async ({id, owner}) => {
  const dbObject = await openDb()

  const newClassCode = { 
    id: id,
    owner: owner,
    createdAt: Date.now()
  }
  dbObject.classCodes.push(newClassCode)

  await saveData(dbObject)
  return newClassCode
};

export const deleteQuestion = async (questionId) => {
  const dbObject = await openDb();
  //console.log("in database mjs 1.0", questionId);

  dbObject.classCodes.forEach(classCode => {
    //console.log("in database mjs", questionId);
    if (classCode.questions) {
      const questionIndex = classCode.questions.findIndex(question => question.id === questionId);
      if (questionIndex > -1) {
        // Remove the question
        console.log("removing...", questionId);
        classCode.questions.splice(questionIndex, 1);
      }
    }
  });

  await saveData(dbObject);
}

// -------------------------------
// Do not edit the functions below
const saveData = async (dbObject) => {
  await fsPromises.writeFile('./db.json', JSON.stringify(dbObject))
}

export const clear = async () => {
  try {
    await fsPromises.rm('./db.json')
  } catch(err) {} // ignore error if file doesnt exist
};