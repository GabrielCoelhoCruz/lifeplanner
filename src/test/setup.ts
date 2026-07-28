// Global test setup for Vitest unit/integration tests.
//
// Server-function and Drizzle code is exercised with in-memory or mocked
// databases per test file; nothing here touches the network. Keep this file
// side-effect free so it is safe to import for every suite.
