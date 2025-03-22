from flask import jsonify, request
from flask_jwt_extended import (
    create_access_token,
    get_jwt_identity,
    jwt_required,
    current_user
)
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
from . import db
from .models import Product, Category, Size, ProductSize
from .user import User, UserType

def init_routes(app):
    # Auth routes
    @app.route('/api/auth/register', methods=['POST'])
    def register():
        data = request.get_json()
        # Check if user already exists
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'Email already registered'}), 400
        if User.query.filter_by(username=data['username']).first():
            return jsonify({'error': 'Username already taken'}), 400
        
        # Create new user
        user = User(
            username=data['username'],
            email=data['email'],
            password_hash=generate_password_hash(data['password'])
        )
        
        db.session.add(user)
        db.session.commit()
        
        return jsonify({'message': 'User registered successfully'}), 201

    @app.route('/api/auth/login', methods=['POST'])
    def login():
        data = request.get_json()
        user = User.query.filter_by(email=data['email']).first()
        
        if user and check_password_hash(user.password_hash, data['password']):
            user.last_login = datetime.utcnow()
            db.session.commit()
            
            access_token = create_access_token(identity=user.id)
            return jsonify({
                'access_token': access_token,
                'user': user.to_dict()
            }), 200
        
        return jsonify({'error': 'Invalid credentials'}), 401

    # User Profile and Points Routes
    @app.route('/api/profile', methods=['GET'])
    @jwt_required()
    def get_profile():
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        return jsonify(user.to_dict()), 200

    @app.route('/api/points/add', methods=['POST'])
    @jwt_required()
    def add_points():
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        data = request.get_json()
        
        points = data.get('points', 0)
        user.add_points(points)
        db.session.commit()
        
        return jsonify({
            'message': 'Points added successfully',
            'user': user.to_dict()
        }), 200

    # User Type Check Endpoints
    @app.route('/api/check-price-access', methods=['GET'])
    @jwt_required()
    def check_price_access():
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        return jsonify({
            'can_view_prices': user.can_view_prices
        }), 200

    @app.route('/api/check-promotion-access', methods=['GET'])
    @jwt_required()
    def check_promotion_access():
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        return jsonify({
            'can_receive_promotions': user.can_receive_promotions
        }), 200

    # Category Routes
    @app.route('/api/categories', methods=['GET'])
    def get_categories():
        categories = Category.query.all()
        return jsonify([{
            'id': c.id,
            'name': c.name,
            'description': c.description
        } for c in categories]), 200

    @app.route('/api/categories', methods=['POST'])
    @jwt_required()
    def create_category():
        data = request.get_json()
        category = Category(
            name=data['name'],
            description=data.get('description', '')
        )
        db.session.add(category)
        db.session.commit()
        return jsonify({
            'id': category.id,
            'name': category.name,
            'description': category.description
        }), 201

    # Product Routes
    @app.route('/api/products', methods=['GET'])
    def get_products():
        # Implementation here
        return jsonify({"message": "Products endpoint"}), 200

    @app.route('/api/products/<int:product_id>', methods=['GET'])
    def get_product(product_id):
        user_id = get_jwt_identity() if request.headers.get('Authorization') else None
        user = User.query.get(user_id) if user_id else None
        
        product = Product.query.get_or_404(product_id)
        return jsonify({
            'id': product.id,
            'name': product.name,
            'description': product.description,
            'price': product.price if (user and user.can_view_prices) else None,
            'category_id': product.category_id,
            'image_url': product.image_url,
            'stock': product.stock,
            'is_featured': product.is_featured
        }), 200

    @app.route('/api/products', methods=['POST'])
    @jwt_required()
    def create_product():
        data = request.get_json()
        product = Product(
            name=data['name'],
            description=data['description'],
            price=data['price'],
            sale_price=data.get('sale_price'),
            fabric=data.get('fabric'),
            style=data.get('style'),
            occasion=data.get('occasion'),
            sleeve_type=data.get('sleeve_type'),
            neck_type=data.get('neck_type'),
            images=data.get('images', []),
            category_id=data['category_id'],
            is_featured=data.get('is_featured', False)
        )
        
        # Handle sizes and stock
        sizes_data = data.get('sizes', [])
        total_stock = 0
        for size_data in sizes_data:
            size = Size.query.get(size_data['size_id'])
            if size:
                product_size = ProductSize(
                    size_id=size.id,
                    stock=size_data.get('stock', 0)
                )
                total_stock += product_size.stock
                product.sizes.append(size)
        
        product.stock = total_stock
        db.session.add(product)
        db.session.commit()
        
        return jsonify(product.to_dict()), 201

    @app.route('/api/products/<int:product_id>', methods=['PUT'])
    @jwt_required()
    def update_product(product_id):
        product = Product.query.get_or_404(product_id)
        data = request.get_json()
        
        # Update basic product info
        product.name = data.get('name', product.name)
        product.description = data.get('description', product.description)
        product.price = data.get('price', product.price)
        product.sale_price = data.get('sale_price', product.sale_price)
        product.fabric = data.get('fabric', product.fabric)
        product.style = data.get('style', product.style)
        product.occasion = data.get('occasion', product.occasion)
        product.sleeve_type = data.get('sleeve_type', product.sleeve_type)
        product.neck_type = data.get('neck_type', product.neck_type)
        product.images = data.get('images', product.images)
        product.category_id = data.get('category_id', product.category_id)
        product.is_featured = data.get('is_featured', product.is_featured)
        
        # Update sizes and stock
        if 'sizes' in data:
            # Clear existing product sizes
            ProductSize.query.filter_by(product_id=product.id).delete()
            
            total_stock = 0
            for size_data in data['sizes']:
                size = Size.query.get(size_data['size_id'])
                if size:
                    product_size = ProductSize(
                        product_id=product.id,
                        size_id=size.id,
                        stock=size_data.get('stock', 0)
                    )
                    total_stock += product_size.stock
                    db.session.add(product_size)
            
            product.stock = total_stock
        
        db.session.commit()
        return jsonify(product.to_dict()), 200

    @app.route('/api/products/<int:product_id>', methods=['DELETE'])
    @jwt_required()
    def delete_product(product_id):
        product = Product.query.get_or_404(product_id)
        db.session.delete(product)
        db.session.commit()
        return jsonify({'message': 'Product deleted successfully'}), 200

    # Featured Products Route
    @app.route('/api/products/featured', methods=['GET'])
    def get_featured_products():
        user_id = get_jwt_identity() if request.headers.get('Authorization') else None
        user = User.query.get(user_id) if user_id else None
        
        featured_products = Product.query.filter_by(is_featured=True).all()
        return jsonify([{
            'id': p.id,
            'name': p.name,
            'description': p.description,
            'price': p.price if (user and user.can_view_prices) else None,
            'category_id': p.category_id,
            'image_url': p.image_url,
            'stock': p.stock,
            'is_featured': p.is_featured
        } for p in featured_products]), 200

    # Category Products Route
    @app.route('/api/categories/<int:category_id>/products', methods=['GET'])
    def get_category_products(category_id):
        user_id = get_jwt_identity() if request.headers.get('Authorization') else None
        user = User.query.get(user_id) if user_id else None
        
        products = Product.query.filter_by(category_id=category_id).all()
        return jsonify([{
            'id': p.id,
            'name': p.name,
            'description': p.description,
            'price': p.price if (user and user.can_view_prices) else None,
            'category_id': p.category_id,
            'image_url': p.image_url,
            'stock': p.stock,
            'is_featured': p.is_featured
        } for p in products]), 200

    # Size Management Routes
    @app.route('/api/sizes', methods=['GET'])
    def get_sizes():
        sizes = Size.query.all()
        return jsonify([size.to_dict() for size in sizes]), 200

    @app.route('/api/sizes', methods=['POST'])
    @jwt_required()
    def create_size():
        data = request.get_json()
        size = Size(
            name=data['name'],
            measurements=data.get('measurements', '')
        )
        db.session.add(size)
        db.session.commit()
        return jsonify(size.to_dict()), 201

    @app.route('/api/products/<int:product_id>/sizes', methods=['GET'])
    def get_product_sizes(product_id):
        product = Product.query.get_or_404(product_id)
        product_sizes = ProductSize.query.filter_by(product_id=product_id).all()
        
        sizes_with_stock = []
        for product_size in product_sizes:
            size_dict = product_size.size.to_dict()
            size_dict['stock'] = product_size.stock
            sizes_with_stock.append(size_dict)
        
        return jsonify(sizes_with_stock), 200

    # Filter Routes
    @app.route('/api/products/filter', methods=['GET'])
    def filter_products():
        # Get filter parameters
        fabric = request.args.get('fabric')
        style = request.args.get('style')
        occasion = request.args.get('occasion')
        min_price = request.args.get('min_price', type=float)
        max_price = request.args.get('max_price', type=float)
        size = request.args.get('size')
        
        # Start with base query
        query = Product.query
        
        # Apply filters
        if fabric:
            query = query.filter(Product.fabric == fabric)
        if style:
            query = query.filter(Product.style == style)
        if occasion:
            query = query.filter(Product.occasion == occasion)
        if min_price is not None:
            query = query.filter(Product.price >= min_price)
        if max_price is not None:
            query = query.filter(Product.price <= max_price)
        if size:
            query = query.join(ProductSize).join(Size).filter(Size.name == size)
        
        # Get user for price visibility
        user_id = get_jwt_identity() if request.headers.get('Authorization') else None
        user = User.query.get(user_id) if user_id else None
        
        products = query.all()
        return jsonify([{
            'id': p.id,
            'name': p.name,
            'description': p.description,
            'price': p.price if (user and user.can_view_prices) else None,
            'sale_price': p.sale_price if (user and user.can_view_prices) else None,
            'fabric': p.fabric,
            'style': p.style,
            'occasion': p.occasion,
            'sleeve_type': p.sleeve_type,
            'neck_type': p.neck_type,
            'images': p.images,
            'category_id': p.category_id,
            'sizes': [size.to_dict() for size in p.sizes],
            'stock': p.stock,
            'is_featured': p.is_featured
        } for p in products]), 200

    return app 