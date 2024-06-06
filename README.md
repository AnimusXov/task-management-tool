# Task Management Tool

This is a task management tool application built with Node.js, Express, and MongoDB.

## Features

- User authentication (registration and login)
- CRUD operations for tasks
- User authorization and authentication with JWT tokens
- Error handling and validation
- MongoDB database integration

## Installation

1. Clone the repository:
2. Install dependencies:
3. Set up environment variables:

    Create a `.env` file in the root directory and add the following variables:  
    PORT=3000  
    MONGO_URI=<your_mongodb_uri>  
    JWT_SECRET=<your_jwt_secret>
4. Run the application:


## Usage

- Register a new user: `/api/auth/register` (POST)
- Login with existing user credentials: `/api/auth/login` (POST)
- Create a new task: `/api/tasks` (POST)
- Get all tasks: `/api/tasks` (GET)
- Update a task: `/api/tasks/:id` (PUT)
- Delete a task: `/api/tasks/:id` (DELETE)

## Contributors

- [Animus](https://github.com/animusXov)

## License

This project is licensed under the [MIT License](LICENSE).


