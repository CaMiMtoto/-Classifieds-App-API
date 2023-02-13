"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = __importDefault(require("../models/User"));
const router = express_1.default.Router();
let secretOrPublicKey = 'secretkey';
// Register a new user
router.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Hash the password
    const salt = yield bcryptjs_1.default.genSalt(10);
    const hash = yield bcryptjs_1.default.hash(req.body.password, salt);
    let user = new User_1.default({
        name: req.body.name,
        email: req.body.email,
        password: hash
    });
    const result = yield user.save();
    // login the user
    const token = jsonwebtoken_1.default.sign({
        _id: result._id,
        name: result.name,
        email: result.email
    }, secretOrPublicKey);
    res.json({
        message: 'User registered successfully',
        token: token
    });
}));
// Login a user
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    // Check if the user exists in the database
    let user = yield User_1.default.findOne({ email });
    if (!user) {
        return res.status(400).json({
            message: 'Invalid email or password'
        });
    }
    // Check if the password is correct
    const isMatch = yield bcryptjs_1.default.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({
            message: 'Invalid email or password'
        });
    }
    // Create a JWT token and send it to the client as a response
    const token = jsonwebtoken_1.default.sign({
        _id: user._id,
        name: user.name,
        email: user.email
    }, secretOrPublicKey);
    res.json({
        message: 'User logged in successfully',
        token: token
    });
}));
// Verify the JWT
// Verify the JWT
function verifyToken(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const bearerHeader = req.headers['authorization'];
        if (typeof bearerHeader !== 'undefined') {
            const bearer = bearerHeader.split(' ');
            req.token = bearer[1];
            const decoded = jsonwebtoken_1.default.verify(req.token, secretOrPublicKey);
            if (!decoded) {
                return res.status(403).json({ message: 'Forbidden' });
            }
            const userId = decoded._id;
            const user = yield User_1.default.findById(userId);
            if (!user) {
                return res.status(403).json({ message: 'Forbidden, user not found' });
            }
            req.user = {
                _id: user._id,
                name: user.name,
                email: user.email
            };
            next();
        }
        else {
            return res.status(401).json({ message: 'Unauthorized' });
        }
    });
}
exports.verifyToken = verifyToken;
// Protected route
router.get('/users', verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req);
    let users = yield User_1.default.find();
    res.json(users)
        .status(200);
}));
exports.default = router;
