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