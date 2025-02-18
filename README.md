# Insomnia Wallet



## Technologies Used

- **Backend:** NestJS, TypeScript, Express
- **Database:** PostgreSQL
- **Blockchain Interaction:** ethers.js
- **Frontend:** Next.js
- **Authentication:** Sign-In With Ethereum (SIWE)
- **Network:** Polygon Mainnet

## Authentication Workflow

The authentication system follows the SIWE structure:

### signIn:
- Checks if the wallet exists in the database.
- If not, creates a new entry and returns a nonce with 
- If the wallet exists, returns a nonce 

### verifySignature:
- Confirms the signature against the nonce.
- If valid, issues a JWT token.

### registerUser:
- Ensures the wallet exists.
- Ensures the username is unique.
- Saves the username and returns a JWT.

Each route is protected by a guard that verifies the signed JWT.

## NestJS Modules Structure


