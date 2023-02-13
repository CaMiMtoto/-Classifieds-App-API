# Classified App - API

This is the API for the Classified App. It is built using Node.js, Express, and MongoDB.

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

## Built With

* [Node.js](https://nodejs.org/en/) - JavaScript runtime
* [Express](https://expressjs.com/) - Web framework
* [MongoDB](https://www.mongodb.com/) - Database
* [Mongoose](http://mongoosejs.com/) - MongoDB object modeling
* [JWT](https://jwt.io/) - Authentication
* [Bcrypt](https://www.npmjs.com/package/bcrypt) - Password hashing
* [Multer](https://www.npmjs.com/package/multer) - File upload
* [Nodemailer](https://nodemailer.com/about/) - Email sending
* [Passport](http://www.passportjs.org/) - Authentication

