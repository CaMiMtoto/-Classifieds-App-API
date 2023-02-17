import express, {Request, Response, Router} from "express";
import Product from "../models/Product";
import {verifyToken} from "./auth";
import multer from "multer";
import path from "path";
import * as fs from "fs";

const router: Router = express.Router();

router.get("/", verifyToken, async (req: any, res: Response) => {

    // get categoryId from query string and take on 10 products
    let categoryId = req.query.categoryId;
    let products;
    if (categoryId) {
        products = await Product
            .find({category: categoryId, user: req.user['_id']})
            .populate("category")
            .sort({name: 1})
            .limit(10);
    } else {
        products = await Product
            .find({user: req.user['_id']})
            .sort({name: 1})
            .populate("category");
    }
    res.json(products)
        .status(200);
});

router.get("/:id", verifyToken, async (req: any, res: Response) => {
        let product = await Product
            .findById(req.params.id)
            .populate("category", "_id name");
        res.json(product)
            .status(200);
    }
);


const storage = multer.diskStorage({
    destination: (req: Request, file: any, cb: any) => {
        cb(null, "public/images");
    },
    filename: (req: Request, file: any, cb: any) => {
        cb(null, `product-${Date.now()}${path.extname(file.originalname)}`);
    },
});
const fileFilter = (req: Request, file: any, cb: any) => {

    cb(null, true);
    /*  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
          cb(null, true);
      } else {
          cb(new Error("Invalid file type"), false);
      }*/
};

const upload = multer({
    storage,
    fileFilter,
});
router.post("/", verifyToken, upload.single("image"), async (req: any, res: Response) => {
        const {name, price, category, short_description, manufacturing_date} = req.body;
        const product = new Product({
            name,
            price,
            category,
            user: req.user._id,
            shortDescription: short_description,
            image: req.file.filename,
            manufacturingDate: manufacturing_date
        });
        await product.save();
        res.json(product)
            .status(201);
    }
);

router.put("/:id", verifyToken, upload.single("image"), async (req: any, res: Response) => {
        const {name, price, category, short_description, manufacturing_date} = req.body;
        const product = await Product.findById(req.params.id);
        if (product) {
            product.name = name;
            product.price = price;
            product.category = category;
            product.shortDescription = short_description;
            product.manufacturingDate = manufacturing_date;
            if (req.file) {
                product.image = req.file.filename;
            }
            await product.save();
            res.json(product)
                .status(200);
        } else {
            res.status(404);
            throw new Error("Product not found");
        }
    }
);

router.delete("/:id", verifyToken, async (req: any, res: Response) => {
    const product = await Product.findById(req.params.id);
    if (product) {
        await product.remove();
        fs.unlink(`public/images/${product.image}`, (err) => {
            if (err) return res.status(500).send("Error deleting the image.");
            res.send("Product and its associated image have been successfully deleted.");
        });
    } else {
        res.status(404);
        throw new Error("Product not found");
    }
});

export default router;