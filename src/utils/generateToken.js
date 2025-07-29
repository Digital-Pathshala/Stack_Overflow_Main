import jwt from 'jsonwebtoken';

const generateToken = (user) => {
    const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
    return jwt.sign({ userId: user._id }, JWT_SECRET, {
        expiresIn: '7d'
    });
};

export default generateToken;