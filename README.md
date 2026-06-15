# SmartDoc UI

SmartDoc UI is the Angular 17 frontend for the SmartDoc AI backend. It is designed to provide a browser interface for logging in, uploading PDF documents, and asking document-grounded questions through a Retrieval-Augmented Generation workflow.

The backend lives in the sibling `SmartDoc` project and exposes secured REST endpoints under `/api`. During local development, this frontend uses `proxy.conf.json` so Angular can call `/api` while the Spring Boot server runs at `http://localhost:8080`.

## What SmartDoc Does

SmartDoc is a Spring Boot application that:

- Accepts PDF uploads through `POST /api/upload`.
- Extracts text from PDFs with Apache PDFBox.
- Splits text into overlapping chunks.
- Generates OpenAI embeddings for document chunks.
- Stores embedded chunks in Elasticsearch.
- Performs semantic KNN search for user questions.
- Sends retrieved context and conversation history to an OpenAI chat model.
- Maintains in-memory conversation sessions.
- Protects API routes with JWT authentication.

The default backend demo login is:

```text
username: admin
password: password123
```

## Frontend Description

`smartdoc-ui` is structured as a feature-based Angular application with NgRx state management.

Implemented frontend foundation:

- Angular workspace config in `angular.json`.
- Strict TypeScript config with path aliases in `tsconfig.json`.
- Local API proxy in `proxy.conf.json`.
- Environment configs for development and production.
- Global dark theme base in `src/styles.scss`.
- Root state interface in `src/app/store/app.state.ts`.
- Auth state, actions, reducer, selectors, effects, and service.
- Upload state, actions, reducer, selectors, effects, and service.
- Chat models, state, actions, reducer, selectors, effects, and service.

Planned frontend pieces still to be added:

- `AppModule`, `AppRoutingModule`, and root component.
- Login component UI.
- Upload panel component UI.
- Chat window, message bubble, and question input components.
- JWT auth interceptor.
- Auth route guard.
- Shared spinner, toast, and markdown pipe.
- Feature modules for auth, upload, and chat.

## Project Structure

```text
smartdoc-ui/
  src/
    app/
      core/
        guards/
        interceptors/
      features/
        auth/
          services/
          store/
        chat/
          models/
          services/
          store/
        upload/
          services/
          store/
      shared/
        components/
        pipes/
      store/
    environments/
    index.html
    main.ts
    styles.scss
  angular.json
  package.json
  proxy.conf.json
  tsconfig.json
```

## API Contract Used By The UI

### Auth

```http
POST /api/auth/login
```

Request:

```json
{
  "username": "admin",
  "password": "password123"
}
```

Response:

```json
{
  "token": "<jwt>"
}
```

### Upload PDF

```http
POST /api/upload?chunkSize=500&overlap=50
Authorization: Bearer <jwt>
Content-Type: multipart/form-data
```

Response:

```json
{
  "status": "SUCCESS",
  "fileName": "document.pdf",
  "totalChunks": 10,
  "savedChunks": 10
}
```

### Ask Question

```http
POST /api/ask
Authorization: Bearer <jwt>
```

Request:

```json
{
  "question": "What is this document about?",
  "topK": 3,
  "sessionId": "new"
}
```

Response:

```json
{
  "answer": "The answer grounded in uploaded document context.",
  "sourcesUsed": 3,
  "sourceFile": "document.pdf",
  "timeTakenMs": 1200,
  "sessionId": "<session-id>"
}
```

### Clear Conversation

```http
DELETE /api/conversation/{sessionId}
Authorization: Bearer <jwt>
```

Response:

```json
{
  "status": "CLEARED",
  "sessionId": "<session-id>"
}
```

## Local Development

Start the backend first:

```bash
cd ../SmartDoc
./gradlew bootRun
```

On Windows PowerShell:

```powershell
cd ../SmartDoc
.\gradlew.bat bootRun
```

Then start the Angular frontend:

```bash
npm install
npm start
```

The Angular dev server will use `proxy.conf.json` to forward `/api` requests to:

```text
http://localhost:8080
```

## Environment Files

Development:

```ts
export const environment = {
  production: false,
  apiUrl: '/api'
};
```

Production:

```ts
export const environment = {
  production: true,
  apiUrl: 'http://your-backend-host:8080/api'
};
```

Replace the production URL before deployment.

## Current Build Notes

This frontend is still a scaffold. Before a full Angular build will succeed, add the missing Angular modules/components listed above and make sure all imported packages exist in `package.json`.

One current example: `chat.effects.ts` imports `uuid`, so the UI should either add `uuid` as a dependency or replace that ID generation with another approach.

## Scripts

```bash
npm start
npm run build
npm run build:prod
npm test
npm run lint
```

## Backend Requirements

The backend currently expects:

- Java 21.
- Spring Boot 3.2.5.
- Elasticsearch available for the `document_chunks` index.
- A valid OpenAI API key in `Application.properties`.
- Port `8080` available for local development.

The backend allows unauthenticated access to:

- `POST /api/auth/login`
- `GET /api/health`

All other `/api/**` endpoints require a JWT bearer token.
