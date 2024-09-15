# Express Template Taken From Schematics 2024 Backend
### Installing dependencies
```
npm init -y
npm install --save-dev typescript
npm install --save express
npm install -save-dev @types/express
npm install --save-dev eslint
npm install prisma typescript ts-node @types/node --save-dev
npx prisma
npm install @prisma/client
npm install dotenv --save
npm install -g nodemon --save
```
## Quick Start
Install the dependencies:
```bash
npm install
```
Set the environment variables:
```bash
cp .env.example .env
# open .env and modify the environment variables
```

## Commands
Running the application:
```bash
# running locally
npm run dev
# running in prodution
npm run start
```
```bash
# generate prisma client
prisma generate
# migrate and seed database
prisma migrate dev
prisma db seed
# if it's doesn't work, try run the syntax using npx
```
The program is served at `localhost:8000`

## Program flow  
`request` > router > controller > service > repository > service > controller > router > `response`  

## Git Commit Message

It is forced to commit [Conventional Commit](https://www.conventionalcommits.org/en/v1.0.0/) to this repository. For commiting in this style you can use this [VSCode Extension](https://marketplace.visualstudio.com/items?itemName=vivaxy.vscode-conventional-commits).

## Project Structure
```
prisma\
 |--migration\      # Migration history
 |--schema.prisma   # Database schema
src\
 |--config\         # Environment variables and configuration related things
 |--controller\     # Route controllers (controller layer)
 |--middleware\     # Custom express middlewares
 |--model\          # Interface models (data layer)
 |--repository\     # Database queries 
 |--router\         # Routes
 |--seed\           # Database seeding
 |--service\        # Business logic (service layer)
 |--utils\          # Utility classes and functions
 |--index.ts        # App entry point
```

## Response Format (Error handling)
Response api functions are arranged in API-Response file containing:  
1. responseSuccess
2. responseError
3. responsePagination 

Success
```
{
    success: true
    message: string, (optional)
    data: [] or {}
}

```

Error
```
{
    success: false
    message: string,
    errors: {
        field1: "error message",
        field2: "error message",
        ...
    }
}

```

Pagination
```
{
  code: number,
  success: string,
  data: PaginationData<DataType>
}
```

PaginationData
```
{
 data_per_page: Data,
  meta: {
    page: number,
    max_page: number
  }
}
```

## API Documentation
Please refer to this [postman](https://documenter.getpostman.com/view/32470266/2s9YymFitx)

## References
1. [setting up ts and node](https://www.digitalocean.com/community/tutorials/setting-up-a-node-project-with-typescript)  
2. [migration](https://www.prisma.io/docs/guides/migrate/developing-with-prisma-migrate)  
3. [seeding](https://www.prisma.io/docs/guides/migrate/seed-database)  
4. [unknown type checking](https://marketsplash.com/tutorials/typescript/typescript-unknown-vs-any/)  
5. [envalid](https://www.npmjs.com/package/envalid)  
6. [prisma cli commands](https://www.prisma.io/docs/reference/api-reference/command-reference)  
7. [postgres docker](https://medium.com/nerd-for-tech/how-to-set-up-prisma-with-a-local-docker-postgres-container-9e0958d08544)  
8. [boilerplate #1](https://github.com/pshaddel/ts-express-prisma#readme)  
9. [boilerplate #2](https://github.com/antonio-lazaro/prisma-express-typescript-boilerplate/tree/main)  
10. [prisma error reference](https://www.prisma.io/docs/reference/api-reference/error-reference#prismaclientknownrequesterror)  
11. [prisma handling exception](https://www.prisma.io/docs/concepts/components/prisma-client/handling-exceptions-and-errors)  
12. [typescript ellipsis](https://www.tutorialsteacher.com/typescript/rest-parameters)
