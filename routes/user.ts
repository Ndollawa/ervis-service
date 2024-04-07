import express from "express";
import User from "../models/userModel";
import bcrypt from "bcrypt";
import jwt, {Secret} from "jsonwebtoken";
import {isAuthenticated} from "../middleware";

const ONE_DAY = 24 * 60 * 60;

const generateToken = (id: string , email: string) => {
    return jwt.sign({ id, email }, process.env.JWT_SECRET as Secret, {
        expiresIn: ONE_DAY,
    });
};

const userRouter = express.Router();

userRouter.get("/all", isAuthenticated, (req, res) => {
    res.send("respond with a resource");
});

userRouter.post("/register", async (req, res) => {
    const { email, password } = req.body;
    console.log(email, password);
    try {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = new User({ email, password: hashedPassword });
        await user.save();
        const { _id, email: userEmail, isActive, createdAt } = user;

        res.status(201).json({
            id: _id,
            email: userEmail,
            isActive,
            createdAt,
        });
    } catch (err: any) {
        console.log(err);
        res.status(400).send(err.message || "error registering user");
    }
});

userRouter.post("/auth", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email }).exec();
        if (user) {
            const isAuthenticated = await bcrypt.compare(password, user.password);
            if (isAuthenticated) {
                const { _id, email, isActive, organizationId, createdAt, modifiedAt } = user;
                const jwt = generateToken(_id.toString(), email);
                res.cookie("auth_token", jwt, {
                    httpOnly: true,
                    maxAge: ONE_DAY * 1000,
                });

                return res.status(200).json({
                    id: _id,
                    email,
                    isActive,
                    organizationId,
                    createdAt,
                    modifiedAt,
                });
            }
            res.status(401).send("User Authentication Failed");
        } else {
            res.status(404).send("User Not Found");
        }
    } catch (err: any) {
        res.status(401).send(err.message || "User Authentication Failed");
    }
});


userRouter.get("/logout", async (req, res) => {
    res.cookie("auth_token", "", { maxAge: 1 });
    res.status(200).send("User Logged Out");
});

export default userRouter;
