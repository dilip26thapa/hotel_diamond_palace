# hotel-diamond-palace-be

This repository contains a Nestjs application. This application contains api for hotel-diamond-palace-be website.

## Prerequisites

Before you begin, ensure you have the following software installed:

- Node.js (v14 or higher)
- npm (Node Package Manager)

## Getting Started

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/hotel-diamond-palace-be.git
   cd hotel-diamond-palace-be

2. **Install Dependencies**
     ```bash
     npm install
    
3. **Configuration**
   Create three files `.env.development`, `.env.production` and `.env.staging`. Copy and paste the environment variables included in `.env.sample` and configure them if necessary.

4. **Run**
   ```bash

   npm run start:dev   # run in development environment
   npm run start:stage # run in staging environment
   npm run start:prod  # run in production environment

   The server should now be running at http://localhost:3000. You can access the API using a tool like Postman.


5. **Linting and Formatting**
   ```bash
    To lint typescript files:
    npm run lint

    To format code:
    npm run format

6. **Directory Structure** 
   ```bash
   src/: Source code directory.  

   dist/: Compiled JavaScript files (generated during build). 

   test/: Test files.  
  ```