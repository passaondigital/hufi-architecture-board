# Project Bootstrap

Use for every new or resumed project.

## Outcome
Write one sentence describing the real user outcome.

Also define:
- target user
- primary device/context
- first-value target
- MVP boundary
- non-goals

## Inventory
Before architecture, inspect:
- repositories
- prototypes/previews
- database/domain model
- shared services
- providers/connectors
- design systems
- old deployments
- related products

## Project manifest
Record:
- project
- product role
- canonical repo
- production branch
- staging
- domain
- runtime/server
- database
- storage
- auth
- payments
- deployment
- rollback

Unknown = UNKNOWN.

## Main journey
Describe the user flow in verbs.

Example:

`SIGN UP → IMPORT → PLAN → WORK → DOCUMENT → BILL → RETURN`

Build around the journey, not around database tables.

## AI boundary
For every AI capability define:
- input
- context
- model responsibility
- deterministic authority
- tools
- confirmation
- persistence
- audit
- fallback
- tests

## Minimum tests
- happy path
- auth failure
- permission denial
- tenant negative test where relevant
- invalid input
- network failure
- retry/idempotency
- mobile/responsive
- direct deep link/refresh
- rollback

## Completion
A milestone is not complete until current state and next action are documented.
