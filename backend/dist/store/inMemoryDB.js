"use strict";
// inMemoryDB.ts
// Simple in-memory storage for quizzes, questions, attempts and user skills.
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveQuiz = saveQuiz;
exports.getAllQuestions = getAllQuestions;
exports.getQuestionById = getQuestionById;
exports.saveAttempt = saveAttempt;
exports.getUserSkills = getUserSkills;
exports.getUserSkillRecord = getUserSkillRecord;
exports.setUserSkillRecord = setUserSkillRecord;
exports.getQuestionStoreSize = getQuestionStoreSize;
const quizzes = {};
const questions = {};
const userSkills = {};
const attempts = [];
// quiz helpers
function saveQuiz(userId, category, difficulty, qArr) {
    const quizId = `quiz_${Date.now()}`;
    const quiz = {
        id: quizId,
        userId,
        category,
        difficulty,
        questions: qArr.map(q => q.id),
        createdAt: new Date().toISOString(),
    };
    quizzes[quizId] = quiz;
    // store/overwrite questions by id
    qArr.forEach(q => {
        questions[q.id] = q;
    });
    return quiz;
}
function getAllQuestions() {
    return Object.values(questions);
}
function getQuestionById(id) {
    return questions[id];
}
function saveAttempt(attempt) {
    attempts.push(attempt);
    return attempt;
}
// user skills
function getUserSkills(userId) {
    return userSkills[userId] || {};
}
function getUserSkillRecord(userId, skillKey) {
    if (!userSkills[userId])
        return undefined;
    return userSkills[userId][skillKey];
}
function setUserSkillRecord(userId, skillKey, record) {
    if (!userSkills[userId])
        userSkills[userId] = {};
    userSkills[userId][skillKey] = record;
    return record;
}
function getQuestionStoreSize() {
    return Object.keys(questions).length;
}
