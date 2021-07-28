import express from "express";
import { isAuthenticated } from "../utils/authUtil";
import * as ChatRoomController from "../controllers/ChatRoomController";

const router = express.Router();

router.post("/", isAuthenticated, ChatRoomController.createChatRoom);
router.post("/:id", isAuthenticated, ChatRoomController.updateChatRoomUsers);
router.get("/list/:page", isAuthenticated, ChatRoomController.getChatRooms);
router.get("/:id", isAuthenticated, ChatRoomController.getChatRoom);
router.put("/:id", isAuthenticated, ChatRoomController.updateChatRoom);
router.delete("/:id", isAuthenticated, ChatRoomController.deleteChatRoom);

export default router;
