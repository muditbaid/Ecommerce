from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Initialize extensions
db = SQLAlchemy()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)
    
    # Configure the Flask application
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key')
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///mishri_boutique.db')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'jwt-secret-key')
    
    # Initialize CORS
    CORS(app, resources={
        r"/api/*": {
            "origins": [os.getenv('FRONTEND_URL', 'http://localhost:3000')],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"]
        }
    })
    
    # Initialize extensions with app
    db.init_app(app)
    jwt.init_app(app)

    # Add a test route
    @app.route('/')
    def hello_world():
        return jsonify({
            'message': 'Welcome to Mishri Boutique API',
            'status': 'running'
        })
    
    with app.app_context():
        # Import routes after db initialization to avoid circular imports
        from .routes import init_routes
        init_routes(app)
        
        # Create database tables
        db.create_all()
        
        return app

# Import models after db initialization
from .models import Category, Product
from .user import User, UserType

__all__ = ['create_app', 'db', 'jwt', 'User', 'UserType', 'Category', 'Product'] 