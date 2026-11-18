<<<<<<< HEAD
# Community Library Management System

A  library management coursework project. The frontend uses React, Vite, React Router and Fetch API. The backend uses Node.js, Express and MySQL.

## Features

- Dashboard with book totals, available copies, low-stock warnings (fewer than 2) and registered-user count.
- Book catalogue: create, read, update and delete books; unique ISBN; non-negative whole-number stock.
- Stock transactions: add stock, borrow copies and record returns. Borrowing cannot reduce stock below zero. Stock update and transaction insert run in one MySQL transaction.
- User accounts: first-run administrator setup, login, role-based administration, add/update/delete users.
- Passwords are stored as bcrypt hashes. API sessions use signed JWT tokens.
- Responsive existing Community Library interface, controlled forms and client-side validation.
- Express JSON middleware, CORS, Helmet security headers, login rate limiting and central error handling.

## Project structure\n\n```text\nCommunity-Library/\n├── frontend/        # React + Vite application\n├── backend/         # Express REST API\n├── database/        # MySQL schema\n├── .github/         # Frontend build workflow\n└── README.md\n```\n\n## Requirements

- Node.js 20 or newer
- MySQL 8 or compatible MariaDB
- npm

## 1. Create the database

Start MySQL, then run the SQL file:

```bash
mysql -u root -p < database/schema.sql
```

Alternatively, open `database/schema.sql` in MySQL Workbench and execute it. The script creates the `community_library` database and its three tables: `books`, `users`, and `transactions`.

## 2. Configure and start the backend

Open a terminal in the project root:

```bash
cd backend
```

Copy `.env.example` to `.env` and edit the MySQL username/password. Set a long random `JWT_SECRET` (at least 32 characters). Example local values:

```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=community_library
JWT_SECRET=replace_with_a_long_random_secret_at_least_32_characters
JWT_EXPIRES_IN=8h
```

Install and run:

```bash
npm install
npm run dev
```

The API runs at `http://localhost:5000`. Check `http://localhost:5000/api/health`; it should return `{"status":"ok","database":"connected"}`.

## 3. Configure and start the React frontend

Open a second terminal:

```bash
cd frontend
```

Copy `.env.example` to `.env` (the default API URL is already suitable for local development):

```env
VITE_API_URL=http://localhost:5000/api
```

Install and run:

```bash
npm install
npm run dev
```

Open the Vite URL shown in the terminal, normally `http://localhost:5173`.

## 4. First administrator setup

1. Open the app and select **Users**.
2. Create the first administrator with a name, membership ID and password of at least 8 characters.
3. The first account is automatically assigned the `Admin` role.
4. Go to **Login** and sign in using that membership ID and password.
5. The administrator can add Librarian and Member accounts.

There is intentionally no default admin password in the repository. Create your own account during first-run setup.

## Roles

- **Admin**: manage users, books, and stock additions; view and record transactions.
- **Librarian**: manage books and add stock; view and record transactions.
- **Member**: view the catalogue and record borrowing/return transactions after signing in.

## API endpoints

All API routes are prefixed with `/api`.

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| GET | `/api/health` | Public | API/database health |
| POST | `/auth/login` | Public | Sign in |
| GET | `/auth/me` | Signed in | Current session |
| GET | `/books` | Public | List books |
| POST | `/books` | Admin/Librarian | Create book |
| PUT | `/books/:id` | Admin/Librarian | Update book |
| DELETE | `/books/:id` | Admin/Librarian | Delete book |
| GET | `/transactions` | Signed in | Transaction history |
| POST | `/transactions` | Signed in | Add/borrow/return stock |
| GET | `/users` | Admin (or empty first setup) | List users / setup status |
| POST | `/users` | First setup or Admin | Create user |
| PUT | `/users/:id` | Admin | Update user |
| DELETE | `/users/:id` | Admin | Delete user |
| GET | `/dashboard/summary` | Public | User and transaction totals |

Protected requests send `Authorization: Bearer <token>`. The frontend API helper adds this automatically after login.

## Important behaviour

- ISBN and membership ID values are unique.
- Stock must be a whole number of zero or more.
- Borrowing checks stock while holding a database row lock; the transaction is rejected if insufficient copies remain.
- `add`, `borrow`, and `return` are stored in the transaction history.
- Deleting a book preserves its historical transaction record and title snapshot.
- Deleting a user preserves their transactions; the historical user name may display as `System` after account deletion.
- Login tokens are stored in browser local storage for this coursework demo. For a production system, use secure, HTTP-only cookies, HTTPS, stronger session controls and additional audit/authorization review.

## Build check

```bash
cd frontend
npm install
npm run build
```

## GitHub submission

Commit and push the complete repository, including both `frontend/` and `backend/`, `database/schema.sql`, and this README. Do **not** commit `.env`, passwords, JWT secrets, `node_modules/`, or build output.

A GitHub Pages deployment can host only the static frontend; the Express API and MySQL database must also be deployed to a server/database host. Set `VITE_API_URL` to the deployed API URL when building the frontend, and configure the backend `FRONTEND_URL` to the deployed frontend origin.
=======
# COMMUNITY-LIBRARY-
Community Library Management System using React, Express and MySQL.
>>>>>>> e1ff56925d085cd6971c3133c04b849283413707
