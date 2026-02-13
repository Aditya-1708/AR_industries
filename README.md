# AR Industries

AR Industries is a robust, full-stack web application designed for a leading industrial manufacturing and fabrication company. This platform serves as a digital showcase for the company's capabilities, products, and services, while also providing a powerful backend for content management and recruitment.

## 🚀 Features

### Frontend (Client)
-   **Modern UI/UX**: Built with **React** and **Vite**, styled using **TailwindCSS** for a responsive and sleek design.
-   **Interactive Animations**: Utilizes **Framer Motion** to deliver smooth and engaging user interactions.
-   **Comprehensive Pages**:
    -   **Home**: Overview of the company's core values and services.
    -   **Factory & Equipment**: Detailed showcase of manufacturing capabilities.
    -   **Products & Services**: Categorized display of industrial offerings.
    -   **Clients & Industries**: Highlighting key partnerships and sectors served.
    -   **Career Portal**: Dynamic job listings and online application forms.
    -   **Blogs**: informative articles and company updates.
-   **Admin Dashboard**: A protected area for administrators to manage website content dynamically.

### Backend (Server)
-   **Robust API**: Developed with **Node.js** and **Express**.
-   **Database Management**: Uses **Prisma ORM** with **PostgreSQL** for efficient data handling.
-   **Secure Authentication**: **JWT**-based authentication for secure admin access.
-   **Content Management**: APIs to manage products, job openings, blog posts, and staff profiles.
-   **File Handling**: **Multer** integration for handling image and document uploads (resumes, product images).
-   **Validation**: Input validation using **Zod** and **Joi** to ensure data integrity.

## 🛠️ Tech Stack

### Frontend
-   **Framework**: React (Vite)
-   **Styling**: TailwindCSS
-   **Routing**: React Router DOM
-   **Animations**: Framer Motion
-   **Icons**: Lucide React, React Icons
-   **HTTP Client**: Axios
-   **Rich Text Editor**: SunEditor

### Backend
-   **Runtime**: Node.js
-   **Framework**: Express.js
-   **Database**: PostgreSQL
-   **ORM**: Prisma
-   **Authentication**: JSON Web Tokens (JWT), Bcrypt
-   **File Uploads**: Multer
-   **Validation**: Zod, Joi

## 📦 Installation & Setup

### Prerequisites
-   Node.js (v18+ recommended)
-   PostgreSQL installed and running

### 1. Clone the Repository
```bash
git clone https://github.com/Aditya-1708/AR_industries.git
cd AR_industries
```

### 2. Setup Backend (Server)
```bash
cd server
npm install
```

-   Create a `.env` file in the `server` directory and configure your environment variables (Database URL, JWT Secret, Port, etc.).
-   Initialize the database:
```bash
npx prisma generate
npx prisma db push
```

### 3. Setup Frontend (Client)
```bash
cd ../client
npm install
```

### 4. Run the Application
You can run both client and server concurrently or in separate terminals.

**Server:**
```bash
cd server
npm run dev
```

**Client:**
```bash
cd client
npm run dev
```

The frontend will typically run on `http://localhost:5173` and the backend on `http://localhost:3000` (or your configured port).

## 📄 License
This project is licensed under the ISC License.