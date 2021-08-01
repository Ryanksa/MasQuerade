import express from "express";
import { isAuthenticated } from "../utils/authUtil";
import * as ChatMessageController from "../controllers/ChatMessageController";

const router = express.Router();

router.post("/", isAuthenticated, ChatMessageController.postChatMessage);
router.get("/listen", isAuthenticated, ChatMessageController.listenForChatMessages);
router.get("/:roomId", isAuthenticated, ChatMessageController.getChatMessages);
router.put("/:id", isAuthenticated, ChatMessageController.editChatMessage);
router.delete("/:id", isAuthenticated, ChatMessageController.deleteChatMessage);

export default router;
