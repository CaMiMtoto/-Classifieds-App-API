import express, {Request, Response} from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User";

const router = express.Router();
let secretOrPublicKey = 'secretkey';
// Register a new user
router.post('/register', async (req: Request, res: Response) => {
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(req.body.password, salt);

    let user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hash
    });
    const result = await user.save();
    // login the user
    const token = jwt.sign({
        _id: result._id,
        name: result.name,
        email: result.email
    }, secretOrPublicKey);
    res.json({
        message: 'User registered successfully',
        token: token
    });
});

// Login a user
router.post('/login', async (req: Request, res: Response) => {
    const {email, password} = req.body;

    // Check if the user exists in the database
    let user = await User.findOne({email});
    if (!user) {
        return res.status(400).json({
            message: 'Invalid email or password'
        });
    }

    // Check if the password is correct
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        return res.status(400).json({
            message: 'Invalid email or password'
        });
    }
    // Create a JWT token and send it to the client as a response
    const token = jwt.sign({
        _id: user._id,
        name: user.name,
        email: user.email
    }, secretOrPublicKey);
    res.json({
        message: 'User logged in successfully',
        token: token
    });
});

// Verify the JWT
// Verify the JWT
export async function verifyToken(req: any, res: Response, next: Function) {
    const bearerHeader = req.headers['authorization'];

    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        req.token = bearer[1];

        const decoded = jwt.verify(req.token, secretOrPublicKey) as any;
        if (!decoded) {
            return res.status(403).json({message: 'Forbidden'});
        }
        const userId = decoded._id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(403).json({message: 'Forbidden, user not found'});
        }
        req.user = {
            _id: user._id,
            name: user.name,
            email: user.email
        };
        next();
    } else {
        return res.status(401).json({message: 'Unauthorized'});
    }
}


// Protected route
router.get('/users', verifyToken, async (req: Request, res: Response) => {
    console.log(req);
    let users = await User.find();
    res.json(users)
        .status(200);
});


export default router;