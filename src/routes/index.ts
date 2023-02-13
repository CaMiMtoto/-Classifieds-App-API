import express, {Request, Response} from "express";

const router = express.Router();

router.get("/", (req: Request, res: Response) => {
    res.json({
        title: "Classifieds API",
        version: "1.0.0",
        message: "Welcome to the Classifieds API"
    });
});

export default router;

