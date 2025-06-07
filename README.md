# resilient-email-service
## Features
- Retry with exponential backoff
- Fallback provider mechanism
- Idempotency to avoid duplicates
- Rate limiting (5 per minute)
- Circuit breaker per provider
- Simple logging
- Optional queue system

## Setup
1. Clone this repo.
2. Run `node tests/EmailService.test.js` to test.

## Assumptions
- No external email services used.
- Providers simulate failures randomly.

## Requirements
- Node.js >= v14
