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
const express_1 = __importDefault(require("express"));
const Category_1 = __importDefault(require("../models/Category"));
const auth_1 = require("./auth");
const router = express_1.default.Router();
router.get("/", auth_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // populate the user field in the category with only _id and name
    let categories = yield Category_1.default.find({
        user: req.user['_id']
    }).populate("user", "_id name");
    res.json(categories)
        .status(200);
}));
router.post("/", auth_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    let category = new Category_1.default({
        name: req.body.name,
        description: req.body.description,
        user: req.user
    });
    let result = yield category.save();
    let savedCategory = yield result.populate("user", "_id name");
    res.json(savedCategory)
        .status(201);
}));
router.get("/:id", auth_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let category = yield Category_1.default.findById(req.params.id)
            .populate('user', '_id name');
        res.json(category)
            .status(200);
    }
    catch (e) {
        res.status(404)
            .json({ message: "Category not found" });
    }
}));
router.put("/:id", auth_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let category = yield Category_1.default.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        description: req.body.description,
    });
    res.json(category)
        .status(200);
}));
router.delete("/:id", auth_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let category = yield Category_1.default.findByIdAndDelete(req.params.id);
        res.json(category)
            .status(200);
    }
    catch (e) {
        res.status(404)
            .json({ message: "Category not found" });
    }
}));
exports.default = router;
