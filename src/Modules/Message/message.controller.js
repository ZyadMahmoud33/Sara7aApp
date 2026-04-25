import { Router } from "express";
import * as messageService from "./message.service.js";
import * as messageValidation from "./message.validation.js";
import { validation } from "../../Middlewares/validation.middleware.js";
import { authentication, authorization } from "../../Middlewares/auth.middleware.js";
import { RoleEnum, TokenTypeEnum } from "../../Utlis/enumes/user.enumes.js";
const router = Router();

// send message
router.post(
  "/send-message/:receiverId",
  validation(messageValidation.sendMessageValidation),
  messageService.sendMessage
);

// get All messages for Admin
router.get("/get-all-messages",
authentication({tokenType: TokenTypeEnum.Access}),
authorization({ AccessRoles: [RoleEnum.Admin] }),
messageService.getAllMessages
);

// get message Admin by receiverId
router.get(
  "/get-message-admin/:receiverId",
 authentication({tokenType: TokenTypeEnum.Access}),
authorization({ AccessRoles: [RoleEnum.Admin] }),
  messageService.getUserMessages
);

// get message User
router.get("/get-message",
authentication({tokenType: TokenTypeEnum.Access}),
authorization({ AccessRoles: [RoleEnum.User] }),
messageService.getMessage
);


export default router;
