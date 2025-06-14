# 💸 Etracker Frontend — React Client for Expense Tracker

This is the **React frontend** for the [Etracker](https://github.com/vishnudas-max/sharesphere.git) app — a full-stack expense tracker powered by Django REST Framework and React. This client enables users to securely log, view, and analyze expenses with a beautiful UI.

---

## 🚀 Features

- User Registration & Login using **Session Authentication**
- Secure **CSRF-protected** requests
- Filter expenses by **category** and **date range**
- View expense summaries via **Bar Chart (Chart.js)**
- Role-based access for admins and users
- Clean and responsive design using **Tailwind CSS**
- smoothe experience with framer motion
---

## 🛠️ Setup Instructions

### ✅ Prerequisites

- Node.js (v16 or later)
- npm or yarn
- Access to the backend API (`http://localhost:8000` by default)

---

### ⚙️ Installation & Running Locally

```bash
# 1. Clone the repo
git clone https://github.com/vishnudas-max/Etracker_frontend.git
cd Etracker-Frontend

# 2. Install dependencies
npm install  # or yarn install

# 3. Create a .env file
```env
# .env.example
  REACT_APP_API_BASE_URL=http://localhost:8000/

# 4. run the appliation using
npm start 
