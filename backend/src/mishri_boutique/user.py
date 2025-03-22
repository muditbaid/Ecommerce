from . import db
from datetime import datetime
from enum import Enum

class UserType(Enum):
    BASIC = "basic"  # Cannot see prices
    PLUS = "plus"    # Can see prices
    PREMIUM = "premium"  # Can see prices and promotions

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128))
    user_type = db.Column(db.Enum(UserType), default=UserType.BASIC)
    points = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_login = db.Column(db.DateTime)

    # Points thresholds for user types
    PLUS_THRESHOLD = 100
    PREMIUM_THRESHOLD = 500

    def update_user_type(self):
        """Update user type based on points"""
        if self.points >= self.PREMIUM_THRESHOLD:
            self.user_type = UserType.PREMIUM
        elif self.points >= self.PLUS_THRESHOLD:
            self.user_type = UserType.PLUS
        else:
            self.user_type = UserType.BASIC

    @property
    def can_view_prices(self):
        """Check if user can view prices"""
        return self.user_type in [UserType.PLUS, UserType.PREMIUM]

    @property
    def can_receive_promotions(self):
        """Check if user can receive promotional updates"""
        return self.user_type == UserType.PREMIUM

    def add_points(self, points):
        """Add points and update user type"""
        self.points += points
        # Check if user can be upgraded based on points
        if self.points >= 1000 and self.user_type == UserType.BASIC:
            self.user_type = UserType.PLUS
        elif self.points >= 2000 and self.user_type == UserType.PLUS:
            self.user_type = UserType.PREMIUM

    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'user_type': self.user_type.value,
            'points': self.points,
            'can_view_prices': self.can_view_prices,
            'can_receive_promotions': self.can_receive_promotions,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'last_login': self.last_login.isoformat() if self.last_login else None
        }