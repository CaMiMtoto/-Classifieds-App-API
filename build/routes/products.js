"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const Product_1 = __importDefault(require("../models/Product"));
const auth_1 = require("./auth");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs = __importStar(require("fs"));
const router = express_1.default.Router();
router.get("/", auth_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // get categoryId from query string and take on 10 products
    let categoryId = req.query.categoryId;
    let products;
    if (categoryId) {
        products = yield Product_1.default
            .find({ category: categoryId, user: req.user['_id'] })
            .populate("category")
            .sort({ name: 1 })
            .limit(10);
    }
    else {
        products = yield Product_1.default
            .find({ user: req.user['_id'] })
            .sort({ name: 1 })
            .populate("category");
    }
    res.json(products)
        .status(200);
}));
router.get("/:id", auth_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let product = yield Product_1.default
        .findById(req.params.id)
        .populate("category", "_id name");
    res.json(product)
        .status(200);
}));
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/images");
    },
    filename: (req, file, cb) => {
        cb(null, `product-${Date.now()}${path_1.default.extname(file.originalname)}`);
    },
});
const fileFilter = (req, file, cb) => {
    cb(null, true);
    /*  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
          cb(null, true);
      } else {
          cb(new Error("Invalid file type"), false);
      }*/
};
const upload = (0, multer_1.default)({
    storage,
    fileFilter,
});
router.post("/", auth_1.verifyToken, upload.single("image"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, price, category, short_description, manufacturing_date } = req.body;
    const product = new Product_1.default({
        name,
        price,
        category,
        user: req.user._id,
        shortDescription: short_description,
        image: req.file.filename,
        manufacturingDate: manufacturing_date
    });
    yield product.save();
    res.json(product)
        .status(201);
}));
router.put("/:id", auth_1.verifyToken, upload.single("image"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, price, category, short_description, manufacturing_date } = req.body;
    const product = yield Product_1.default.findById(req.params.id);
    if (product) {
        product.name = name;
        product.price = price;
        product.category = category;
        product.shortDescription = short_description;
        product.manufacturingDate = manufacturing_date;
        if (req.file) {
            product.image = req.file.filename;
        }
        yield product.save();
        res.json(product)
            .status(200);
    }
    else {
        res.status(404);
        throw new Error("Product not found");
    }
}));
router.delete("/:id", auth_1.verifyToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield Product_1.default.findById(req.params.id);
    if (product) {
        yield product.remove();
        fs.unlink(`public/images/${product.image}`, (err) => {
            if (err)
                return res.status(500).send("Error deleting the image.");
            res.send("Product and its associated image have been successfully deleted.");
        });
    }
    else {
        res.status(404);
        throw new Error("Product not found");
    }
}));
exports.default = router;
