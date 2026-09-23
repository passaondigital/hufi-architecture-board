# Universal Project Standard

## 1. Establish truth before mutation
Every project needs one current entry point and evidence for:
- canonical repository
- production branch
- production commit/tag
- runtime/server
- domain
- database
- staging/preview
- deployment method
- rollback point

Unknown values are `UNKNOWN`. Never guess.

## 2. Audit before change
Before substantial changes:
1. inspect local/project START HERE
2. inspect repo, branch and commit
3. inspect live/runtime state where relevant
4. inspect database/migrations
5. inspect auth/billing/external dependencies
6. only then mutate

## 3. Status language
Use:
- IDEA
- PLANNED
- FOUNDATION
- BUILT
- TESTED
- STAGING
- PRODUCTION
- PARTIAL
- BLOCKED
- UNKNOWN

NOT TESTED is not PASS.
BUILT is not PRODUCTION.

## 4. Evidence over claims
“Done” requires suitable evidence:
- real change
- automated tests
- negative/adversarial tests when relevant
- browser/device test when relevant
- runtime/endpoint proof
- production smoke after deployment
- exact commit/release

## 5. Reuse before rebuild
Apply:

**OPTIMIZE → REUSE → SIMPLIFY → MEASURE → THEN ADD**

Before adding a framework, model, service, database, server or parallel architecture, inspect what already exists.

## 6. Complexity belongs inside
The machinery may be complex. The user experience should be simple.

Every important screen should answer:
- Where am I?
- What matters now?
- What is the main action?
- What happens next?

## 7. Time-to-value
Prefer:
- migration
- import
- copy/paste
- extraction
- sensible defaults
- progressive setup

Do not ask users to re-enter data the system already has.

## 8. Shared domain truth
Prefer stable IDs, shared domain entities and explicit relationships over duplicate customer/user/resource/billing models.

## 9. Authorization is server-side
UI hiding is not security.

Authorization should derive from verifiable context such as:

`IDENTITY → WORKSPACE → ROLE → RELATIONSHIP → RESOURCE → PERMISSION → ACTION`

Tenant isolation must be tested negatively.

## 10. Models are not authorities
Models can assist with language, extraction, planning and suggestions.

Keep deterministic authority for:
- money
- permissions
- identity
- billing state
- critical transitions
- destructive actions

Preferred action path:

`UNDERSTAND → RESOLVE → POLICY → PREPARE → PREVIEW → CONFIRM IF REQUIRED → EXECUTE → VERIFY → AUDIT`

## 11. Memory and secrets
Persistent AI memory must be scoped, sourced and reviewable.

Secrets never belong in normal Git docs, Drive docs, prompts, memory or work evidence. Use secret references.

## 12. Preview/staging/production
Do not present mock or simulated state as production truth.
Do not blind-merge stale preview branches.
Port proven components selectively.

## 13. Release
Before production:
- source commit known
- tests classified
- security checked
- migration state known
- rollback available
- staging smoke complete
- deploy
- production smoke
- documentation/status update

## 14. Backups
Git is not a data backup.
Protect database, object storage and configuration separately.
A backup strategy is not proven until restore is tested.

## 15. Handover
After substantial work persist:
- what changed
- repo/branch/commit
- what was tested
- what is live
- PARTIAL/BLOCKED/UNKNOWN
- rollback/recovery
- next highest-value action

A future agent should not need the old chat to continue safely.
