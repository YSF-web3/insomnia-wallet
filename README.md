# Insomnia Wallet


Overview
--------
### Wallet NFTs with pagination and infinite scroll
<img width="1440" alt="image" src="https://github.com/user-attachments/assets/4695ccfb-e1ad-44f8-a12b-8540b96f86e2" />

### Ability to send NFTs by searching by name with autocompletion
![image](https://github.com/user-attachments/assets/4dbba817-6048-468c-bf6a-40ca8e392247)

### Token balances with infinite scroll
<img width="1440" alt="image" src="https://github.com/user-attachments/assets/e04df946-8fbb-450b-8e8a-3a4a86eff71e" />



Technologies Used
-----------------

-   **Backend:** NestJS, TypeScript, Express
-   **Database:** PostgreSQL
-   **Blockchain Interaction:** ethers.js
-   **Frontend:** Next.js
-   **Authentication:** Sign-In With Ethereum (SIWE)
-   **Network:** Polygon Mainnet

Authentication Workflow
-----------------------

The authentication system follows the SIWE structure:

1.  **signIn**:
    -   Checks if the wallet exists in the database.
    -   If not, creates a new entry and returns a nonce with `exists: false`.
    -   If the wallet exists, returns a nonce with `exists: true`.
2.  **verifySignature**:
    -   Confirms the signature against the nonce.
    -   If valid, issues a JWT token.
3.  **registerUser**:
    -   Ensures the wallet exists.
    -   Ensures the username is unique.
    -   Saves the username and returns a JWT.

Each route is protected by a guard that verifies the signed JWT.

When user logs in for the first time is prompted to add username:
<img width="1440" alt="image" src="https://github.com/user-attachments/assets/17d6a36a-0cdb-4bc5-95eb-4c32fed1455f" />


Environment Variables
---------------------

Ensure you have a `.env` file with the following variables:

```
MORALIS_API_KEY=your_api_key
JWT_SECRET=your_secret
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_db_username
DB_PASSWORD=your_db_password
DB_NAME=insomnia-wallet
NODE_ENV=development

```

Running the Project
-------------------

```
git clone <repo-url>
cd insomnia-wallet
cd apps/frontend 
pnpm install
cd ..
cd backend
pnpm install
cd ..
npm run dev  # Runs backend and frontend concurrently

```

Security Measures
-----------------

-   Proper error handling and logging.
-   JWT-based authentication for route protection.
-   Validation of input data to prevent security vulnerabilities.




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


## Data Storage

To improve performance and avoid excessive blockchain queries, NFT and token metadata are stored in a PostgreSQL database.

## NestJS Modules Structure


The project is organized into multiple modules to handle specific functionalities:

### auth/                    # Wallet authentication (SIWE)
- `auth.module.ts`  
- `auth.controller.ts`  
- `auth.service.ts`  
- `auth.dto.ts`  
- `auth.guard.ts`  

### users/                   # User database management 
- `users.module.ts`  
- `users.controller.ts`  
- `users.service.ts`  
- `users.entity.ts`  
- `users.repository.ts`  

### tokens/                  # ERC20 token balances and storage
- `tokens.module.ts`  
- `tokens.controller.ts`  
- `tokens.service.ts`  
- `tokens.entity.ts`  

### nfts/                    # ERC721 & ERC1155 balances and storage
- `nfts.module.ts`  
- `nfts.controller.ts`  
- `nfts.service.ts`  
- `nfts.entity.ts`  

### transactions/            # Sending tokens & NFTs
- `transactions.module.ts`  
- `transactions.controller.ts`  
- `transactions.service.ts`  
- `transactions.entity.ts`






