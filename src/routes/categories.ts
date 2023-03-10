import express, {Request, Response} from "express";
import Category from "../models/Category";
import {verifyToken} from "./auth";

const router = express.Router();

router.get("/", verifyToken, async (req: any, res: Response) => {
    // find all categories where user equal to id or is null or undefined
    let id = req.user['_id'];
    let categories = await Category
        .find({$or: [{user: id}, {user: null}, {user: undefined}]})
        .populate('user', '_id name')
        .sort({name: 1});

    res.json(categories)
        .status(200);
});

router.post("/", verifyToken, async (req: any, res: Response) => {
    console.log(req.body);
    let category = new Category({
        name: req.body.name,
        description: req.body.description,
        user: req.user
    });
    let result = await category.save();
    let savedCategory = await result.populate("user", "_id name");
    res.json(savedCategory)
        .status(201);
});

router.get("/:id", verifyToken, async (req: Request, res: Response) => {
        try {
            let category = await Category.findById(req.params.id)
                .populate('user', '_id name');
            res.json(category)
                .status(200);
        } catch (e) {
            res.status(404)
                .json({message: "Category not found"});
        }
    }
);

router.put("/:id", verifyToken, async (req: Request, res: Response) => {
    let category = await Category.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        description: req.body.description,
    });
    res.json(category)
        .status(200);
});

router.delete("/:id", verifyToken, async (req: Request, res: Response) => {
    try {
        let category = await Category.findByIdAndDelete(req.params.id);
        res.json(category)
            .status(200);
    } catch (e) {
        res.status(404)
            .json({message: "Category not found"});
    }
});


export default router;
