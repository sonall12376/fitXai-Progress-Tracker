# FitAI-X: Progress Tracker — AI Integration Directory Structure
## Senior Backend Architect Design Document

This document defines the physical directory structure, file-level responsibilities, and structural dependencies for the **AI Integration Module** in the FitAI-X backend. The architecture enforces clean separation of concerns, ensuring modularity, testability, and future scalability.

---

### 1. Module Directory Tree

The AI Integration Module is designed as a standalone component inside the backend's modular structure.

```text
src/
└── modules/
    └── ai-integration/
        ├── config/
        │   └── gemini.config.ts           # Upstream API configurations
        ├── constants/
        │   └── prompt.constants.ts        # Immutable parameters, thresholds & enums
        ├── errors/
        │   └── errorHandler.ts            # Exception maps & system fallback templates
        ├── interfaces/
        │   └── ai.interfaces.ts           # Decoupled TypeScript service contracts
        ├── prompts/
        │   └── promptBuilder.ts           # Dynamic prompt string formatting engine
        ├── services/
        │   ├── analysisEngine.ts          # Central orchestrator (Facade Pattern)
        │   └── geminiClient.ts            # Google Gemini SDK API wrapper
        ├── types/
        │   └── dto.types.ts               # Input/Output DTO and Type declarations
        ├── utils/
        │   ├── logger.ts                  # Dedicated logger interface (Winston wrapper)
        │   └── responseParser.ts          # String sanitization & JSON extraction utility
        └── validators/
            └── schema.validator.ts        # Structural verification engine (Zod/Joi rules)
```

---

### 2. File-by-File Responsibilities

#### Config Layer
*   [`gemini.config.ts`](file:///c:/Users/hp/Desktop/Projects/fitXai-Progress-Tracker/docs/AI_DIRECTORY_STRUCTURE.md#config/gemini.config.ts)
    *   *Why it exists*: Centralizes model environments, API keys, and parameter values.
    *   *Responsibility*: Reads configuration files and environmental variables (`process.env.GEMINI_API_KEY`, `process.env.GEMINI_MODEL_NAME`). It exports config parameters (e.g. `temperature: 0.2`, `maxOutputTokens: 2048`, `timeout: 6000ms`).

#### Constants Layer
*   [`prompt.constants.ts`](file:///c:/Users/hp/Desktop/Projects/fitXai-Progress-Tracker/docs/AI_DIRECTORY_STRUCTURE.md#constants/prompt.constants.ts)
    *   *Why it exists*: Keeps system configurations clean by removing static variables from execution logic.
    *   *Responsibility*: Stores immutable arrays and strings, such as default baseline values, lists of accepted workout types, pain scale levels, and the master system prompt template.

#### Errors Layer
*   [`errorHandler.ts`](file:///c:/Users/hp/Desktop/Projects/fitXai-Progress-Tracker/docs/AI_DIRECTORY_STRUCTURE.md#errors/errorHandler.ts)
    *   *Why it exists*: Intercepts exceptions to prevent application crashes and ensure graceful degradation.
    *   *Responsibility*: Evaluates failed requests (timeouts, parsing syntax errors). If an error occurs, it records logging telemetry and compiles a safe local default analysis object so user dashboards render without errors.

#### Interfaces Layer
*   [`ai.interfaces.ts`](file:///c:/Users/hp/Desktop/Projects/fitXai-Progress-Tracker/docs/AI_DIRECTORY_STRUCTURE.md#interfaces/ai.interfaces.ts)
    *   *Why it exists*: Enforces dependency inversion, allowing modules to be mocked during unit testing.
    *   *Responsibility*: Declares contract signatures for all classes in the module (e.g. `IPromptBuilder`, `IGeminiClient`, `ISchemaValidator`).

#### Prompts Layer
*   [`promptBuilder.ts`](file:///c:/Users/hp/Desktop/Projects/fitXai-Progress-Tracker/docs/AI_DIRECTORY_STRUCTURE.md#prompts/promptBuilder.ts)
    *   *Why it exists*: Converts raw dynamic values into the system prompt template.
    *   *Responsibility*: Validates that user parameters are present and formats demographic strings, daily logs, and history logs into structured sections using XML-like tags (e.g. `<userProfile>`).

#### Services Layer
*   [`analysisEngine.ts`](file:///c:/Users/hp/Desktop/Projects/fitXai-Progress-Tracker/docs/AI_DIRECTORY_STRUCTURE.md#services/analysisEngine.ts)
    *   *Why it exists*: Serves as the entry controller for the AI module.
    *   *Responsibility*: Executes the main coordinator lifecycle. It receives log models from backend controllers, triggers prompt building, calls the Gemini client, sanitizes and validates the output, and returns the final report payload.
*   [`geminiClient.ts`](file:///c:/Users/hp/Desktop/Projects/fitXai-Progress-Tracker/docs/AI_DIRECTORY_STRUCTURE.md#services/geminiClient.ts)
    *   *Why it exists*: Isolates upstream network connections.
    *   *Responsibility*: Initializes the Google Gen AI client library using configuration properties, sends prompts, enforces response timeouts, and returns raw text responses.

#### Types Layer
*   [`dto.types.ts`](file:///c:/Users/hp/Desktop/Projects/fitXai-Progress-Tracker/docs/AI_DIRECTORY_STRUCTURE.md#types/dto.types.ts)
    *   *Why it exists*: Defines strict data typing.
    *   *Responsibility*: Exports TypeScript type declarations for input payloads and response packages.

#### Utils Layer
*   [`logger.ts`](file:///c:/Users/hp/Desktop/Projects/fitXai-Progress-Tracker/docs/AI_DIRECTORY_STRUCTURE.md#utils/logger.ts)
    *   *Why it exists*: Provides structured logging across the application.
    *   *Responsibility*: Logs telemetry, request latencies, and debug alerts.
*   [`responseParser.ts`](file:///c:/Users/hp/Desktop/Projects/fitXai-Progress-Tracker/docs/AI_DIRECTORY_STRUCTURE.md#utils/responseParser.ts)
    *   *Why it exists*: Cleans raw responses from Gemini before validation.
    *   *Responsibility*: Removes markdown syntax blocks (such as ` ```json `), extracts clean bracket strings, and handles character encoding.

#### Validators Layer
*   [`schema.validator.ts`](file:///c:/Users/hp/Desktop/Projects/fitXai-Progress-Tracker/docs/AI_DIRECTORY_STRUCTURE.md#validators/schema.validator.ts)
    *   *Why it exists*: Guarantees type safety.
    *   *Responsibility*: Validates JSON structures using libraries like Zod or Joi to ensure no required properties are missing before writing data to PostgreSQL.

---

### 3. File Communication Flow

The runtime communication sequence follows a strict sequential lifecycle:

1.  **Entry Request**: The backend controller invokes `analysisEngine.analyzeProgress(payload)`.
2.  **Prompt Assembly**: `analysisEngine` calls `promptBuilder.generate(payload)`.
3.  **Inference call**: `analysisEngine` sends the prompt string to `geminiClient.request(prompt)`.
4.  **Raw Extraction**: `geminiClient` returns a raw text response, which `analysisEngine` passes to `responseParser.extractJson(text)`.
5.  **Schema Check**: The parsed object is sent to `schemaValidator.validate(json)`.
6.  **Report Return**: If validation succeeds, `analysisEngine` returns the report payload to the controller.
7.  **Error Recovery**: If any step fails, `analysisEngine` intercepts the error and calls `errorHandler.handle(error)`, returning a safe local fallback payload.

---

### 4. Dependency Flow

The module enforces a **Dependency Inversion** architecture to keep core components decoupled:

*   **Config, Constants, Types, and Interfaces** are leaf-nodes with **no outward dependencies**.
*   **PromptBuilder, GeminiClient, responseParser, and SchemaValidator** depend only on local configs, types, constants, and interfaces. They have no knowledge of each other.
*   **analysisEngine** sits at the top of the local tree. It depends on all interfaces and coordinates sub-service executions.
*   **External Controllers** (e.g. `progress.controller.ts`) depend only on `analysisEngine` interface signatures, preventing internal module details from leaking into the rest of the application.
