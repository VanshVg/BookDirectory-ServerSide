
# Book Birectory

This repository contains the serverside code for MERN Stack website of Book Directory which has APIs made using Node and Express.

## Installation

To install dependencies/packages 

```bash
  npm install
``` 

## Deployment

To deploy this project

```bash
  nodemon index.js
```

## API Routes

### GET
```bash
/api/displayUsers
/api/profile
/api/verifypassword
/api/showBooks
/api/showbook/:id
/api/search
/api/books/:value
/api/cartbooks
```

### POST
```bash
/api/register
/api/login
/api/logout
/api/addBook
/api/processpayment
/api/addtocart/:id
```

### PUT
```bash
/api/changepassword
/api/updatebook/:id
/api/addquantity/:id
/api/removequantity/:id
```

### DELETE
```bash
/api/removebook/:id
/api/removecart/:id
```
