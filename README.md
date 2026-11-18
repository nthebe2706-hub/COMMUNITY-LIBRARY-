# Community Library Management System

A  web application for managing a community library's books, members, and borrowing transactions.

## Technologies Used

### Frontend
- React
- JavaScript
- CSS
- React Router
- Fetch API

### Backend
- Node.js
- Express.js
- MySQL
- REST API
- JWT authentication
- bcrypt password hashing

## Main Features

### Dashboard
- View library statistics.
- Monitor available book quantities.
- Identify books with low stock (less than 2 copies).

### Book Management
- Add new books.
- View all books.
- Update book details.
- Delete books.
- Manage book quantities.

### Transactions
- Record new stock.
- Record borrowed books.
- Record returned books.
- View transaction history.
- Automatically update book quantities.

### User Management
- User login and authentication.
- Create and manage user accounts.
- Assign user roles.
- Admin-controlled user management.

## Database Setup

1. Install MySQL Server and MySQL Workbench.
2. Open MySQL Workbench.
3. Open the `database/schema.sql` file.
4. Execute the SQL script to create the database and tables.
5. Configure the backend `.env` file with your local MySQL credentials.

## Running the Application Locally

### 1. Start the Backend

Open a terminal:

bash
cd backend
npm install


Create a `.env` file inside the backend folder and configure:

   env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=community_library
JWT_SECRET=replace_with_a_long_random_secret


Start the backend:

  bash
npm run dev


### 2. Start the Frontend

Open another terminal:

 bash
cd frontend
npm install


Create a `.env` file inside the frontend folder:

 env
VITE_API_URL=http://localhost:5000/api


Start the frontend:

bash
npm run dev


Open the local address displayed in the terminal, normally:

'http://localhost:5173`

## Security

- Passwords are hashed before storage.
- JWT authentication is used for protected operations.
- Role-based access controls administrative functions.
- Backend input validation helps protect database operations.
- Environment variables are used for sensitive configuration.

## Project Purpose

This project demonstrates the development of a  library management system using React, Express, and MySQL. It applies CRUD operations, database integration, authentication, stock management, and REST API communication.
