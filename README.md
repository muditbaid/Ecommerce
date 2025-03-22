# 🛍️ Mishri Boutique – E-commerce Website

A modern and elegant e-commerce platform for sarees and kurtis, built using **Flask** (backend) and **React** (frontend).

---

## 📁 Project Structure

```
Ecommerce/
├── backend/
│   ├── app.py
│   ├── models.py
│   ├── routes.py
│   └── requirements.txt
└── frontend/
    ├── package.json
    └── src/
```

---

## ⚙️ Backend Setup

1. **Create and activate virtual environment**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up environment variables**

   Create a `.env` file in the `backend` directory and add:
   ```
   DATABASE_URL=sqlite:///boutique.db
   JWT_SECRET_KEY=your-secret-key
   ```

4. **Initialize the database**
   ```bash
   flask db init
   flask db migrate
   flask db upgrade
   ```

5. **Run the backend server**
   ```bash
   python app.py
   ```

---

## 💻 Frontend Setup

1. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Start the development server**
   ```bash
   npm start
   ```

---

## 🌟 Features

- 📦 Product catalog with categories  
- 👩‍💼 User authentication  
- 🛒 Shopping cart functionality  
- 📱 Fully responsive design  
- 📷 Image upload and management  
- 🛠️ Admin dashboard for store management  

---

## 🧰 Tech Stack

### 🔙 Backend
- Flask  
- SQLAlchemy  
- Flask-JWT-Extended  
- Flask-CORS  
- Flask-Migrate  

### 🔜 Frontend
- React  
- Material-UI  
- Redux Toolkit  
- React Router  
- Axios
