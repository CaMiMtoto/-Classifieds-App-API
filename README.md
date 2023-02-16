# Classified App - API

This is the API for the Classified App. It is built using Node.js, Express Using typescript, and MongoDB . It is a
RESTful API that
allows clients to create, read, update, and delete products and categories.
clients must be authenticated to access the API.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing
purposes.

### Prerequisites

You will need to have Node.js and MongoDB installed on your machine.

### Installing

Clone the repository to your local machine.

```
git clone https://github.com/CaMiMtoto/-Classifieds-App-API.git
```

Install the dependencies.

```
npm install
```

create a .env file in the root directory and add the following variables and change the values to your own.

```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/db_name
JWT_SECRET=your_secret
```

Start the server.

```
npm run build
```

```
npm start
```

## Endpoints

### Authentication

| Method | Endpoint           | Description         |
|--------|--------------------|---------------------|
| POST   | /api/auth/register | Register a new user |
| POST   | /api/auth/login    | Login a user        |

### Products

| Method | Endpoint          | Description          |
|--------|-------------------|----------------------|
| GET    | /api/products     | Get all products     |
| GET    | /api/products/:id | Get a single product |
| POST   | /api/products     | Create a product     |
| PUT    | /api/products/:id | Update a product     |
| DELETE | /api/products/:id | Delete a product     |

### Categories

| Method | Endpoint            | Description           |
|--------|---------------------|-----------------------|
| GET    | /api/categories     | Get all categories    |
| GET    | /api/categories/:id | Get a single category |
| POST   | /api/categories     | Create a category     |
| PUT    | /api/categories/:id | Update a category     |
| DELETE | /api/categories/:id | Delete a category     |

## Built With

* [Node.js](https://nodejs.org/en/) - JavaScript runtime
* [Express](https://expressjs.com/) - Web framework
* [MongoDB](https://www.mongodb.com/) - Database
* [Mongoose](http://mongoosejs.com/) - MongoDB object modeling
* [JWT](https://jwt.io/) - Authentication
* [Bcrypt](https://www.npmjs.com/package/bcrypt) - Password hashing
* [Multer](https://www.npmjs.com/package/multer) - File upload
* [Typescript](https://www.typescriptlang.org/) - JavaScript superset for type checking and static typing

## Deployment

This app is deployed on Heroku. You can access it [https://classified.cami.ink](https://classified.cami.ink).

