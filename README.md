# Enigma-Logicistics-Backend

/src
  /config             // Env variables and TypeORM config
  /modules
    /auth             // JWT, Roles, SETR Token Generation
    /users            // User Management & Profiles
    /assets           // The "Digital Twin" of Rooms/Hardware
    /ledger           // The Immutable Audit Log (XAI)
  /common
    /decorators       // Custom @Roles() decorators
    /guards           // Security Gates (RBAC)
    /interceptors     // Logging & Response Formatting
  app.module.ts
  main.ts


CI/CD strategy The standard flow for high-integrity enterprise software is exactly as you described:

feature/xyz (Local work) → PR to development

development (The "Melting Pot") → Deploys to Dev Env (Sandbox DB).

testing (The "Gatekeeper") → Deploys to Test Env. Strict E2E tests run here.

master (The "Source of Truth") → Deploys to Production.

Note: For Demo, I recommend a specific tag or a separate branch (e.g., release/demo) so you don't accidentally push a live hotfix to your sales demo during a meeting.

I will provide the GitHub Actions Workflow file at the end of this response.