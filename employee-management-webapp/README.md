# PeopleDesk — Employee Management Web App

A beginner-friendly React + Vite employee management dashboard for a local DevOps/CI-CD learning project.

## Features
- View employee records in a dashboard
- Search by employee name, role, or department
- Add, edit, and delete employees
- Data is saved in the browser using localStorage
- Responsive layout
- Dockerfile for containerized deployment

> This is a learning/demo app. It uses browser localStorage, not a secure production database or authentication system.

## Run locally
Install Node.js 20 or newer, then run:

```bash
npm install
npm run dev
```

Open the URL printed by Vite (usually http://localhost:5173).

## Create a production build

```bash
npm run build
npm run preview
```

## Run with Docker

```bash
docker build -t employeedesk:v1 .
docker run -d --name employeedesk -p 8083:80 employeedesk:v1
```

Open http://localhost:8083.

## Project structure

```text
employee-management-webapp/
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   └── styles.css
├── Dockerfile
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## Suggested next DevOps steps
1. Create a GitHub repository and push this source code.
2. Add a GitHub Actions workflow to install dependencies and run the production build.
3. Configure Jenkins to check out the repository and run the build.
4. Build and run the Docker image.
5. Automate deployment after a successful build.
