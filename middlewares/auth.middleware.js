import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env.js';
import User from '../models/user.model.js';

//Someone is making a request to a protected route -> verify token -> check if user exists -> if user exists, attach user to req object -> next()   

const authorize = async (req, res, next) => {
    
    try {

        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if(!token) return res.status(401).json({success: false, message: 'Not authorized to access this route'});

        const decoded = jwt.verify(token, JWT_SECRET);

        const user = await User.findById(decoded.id);

        if(!user) return res.status(401).json({success: false, message: 'Unauthorized to access this route'});

        req.user = user;

        next();
        
    } catch (error) {
        next(error);
        
    }
}

export default authorize;