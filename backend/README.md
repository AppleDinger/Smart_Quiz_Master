Smart Quiz — Backend (TypeScript)

Run (dev):
  npm install
  npm run dev

Build + run:
  npm run build
  npm start

API endpoints:
  POST /api/generate-quiz
  POST /api/submit-answer
  POST /api/request-practice
  GET  /api/user-skills/:userId

This project uses in-memory storage for quick demo. Replace the mocks in /src/services to connect real LLM, extractor, or a DB.
