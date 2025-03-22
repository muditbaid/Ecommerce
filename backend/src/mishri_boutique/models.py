from . import db
from datetime import datetime

class Category(db.Model):
    __tablename__ = 'categories'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    products = db.relationship('Product', backref='category', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'created_at': self.created_at.isoformat()
        }

class Size(db.Model):
    __tablename__ = 'sizes'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(20), nullable=False)  # XS, S, M, L, XL, XXL, etc.
    measurements = db.Column(db.String(100))  # e.g., "Bust: 36", Length: 45""
    products = db.relationship('ProductSize', backref='size', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'measurements': self.measurements
        }

class ProductSize(db.Model):
    __tablename__ = 'product_sizes'
    
    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    size_id = db.Column(db.Integer, db.ForeignKey('sizes.id'), nullable=False)
    stock = db.Column(db.Integer, default=0)

class Product(db.Model):
    __tablename__ = 'products'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    price = db.Column(db.Float, nullable=False)
    sale_price = db.Column(db.Float)  # For discounted items
    fabric = db.Column(db.String(100))  # e.g., Cotton, Silk, Chiffon
    style = db.Column(db.String(100))  # e.g., A-line, Straight, Anarkali
    occasion = db.Column(db.String(100))  # e.g., Casual, Party, Festival
    sleeve_type = db.Column(db.String(100))  # e.g., Full, Three-quarter, Sleeveless
    neck_type = db.Column(db.String(100))  # e.g., V-neck, Round, Collar
    images = db.Column(db.JSON)  # Store multiple image URLs
    stock = db.Column(db.Integer, default=0)  # Total stock across all sizes
    is_featured = db.Column(db.Boolean, default=False)
    category_id = db.Column(db.Integer, db.ForeignKey('categories.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    sizes = db.relationship('Size', secondary='product_sizes', backref='products')

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'price': self.price,
            'sale_price': self.sale_price,
            'fabric': self.fabric,
            'style': self.style,
            'occasion': self.occasion,
            'sleeve_type': self.sleeve_type,
            'neck_type': self.neck_type,
            'images': self.images,
            'stock': self.stock,
            'is_featured': self.is_featured,
            'category_id': self.category_id,
            'sizes': [size.to_dict() for size in self.sizes],
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        } 