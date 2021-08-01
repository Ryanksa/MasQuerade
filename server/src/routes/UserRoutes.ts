import express from "express";
import { isAuthenticated } from "../utils/authUtil";
import * as UserController from "../controllers/UserController";

const router = express.Router();

router.post("/signup/", UserController.SignUp);
router.post("/signin/", UserController.SignIn);
router.get("/signout/", isAuthenticated, UserController.SignOut);
router.get("/list", isAuthenticated, UserController.getUsers);
router.get("/:username", isAuthenticated, UserController.getUser);

export default router;
