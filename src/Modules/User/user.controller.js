import { Router } from "express";
import * as userService from "./user.service.js";
import { authentication, authorization } from "../../Middlewares/auth.middleware.js";
import { RoleEnum, TokenTypeEnum } from "../../Utlis/enumes/user.enumes.js";
import { localFileUpload, fileValidation } from "../../Utlis/multer/local.multer.js";
import { validation } from "../../Middlewares/validation.middleware.js";
import * as userValidation from "./user.validation.js";


const router = Router();

router.get(
    "/getuser", 
    authentication({tokenType: TokenTypeEnum.Access}),
    authorization({AccessRoles: [RoleEnum.User]}),
    userService.getprofile,

);


router.patch(
  "/update-profile-pic",
  authentication({ tokenType: TokenTypeEnum.Access }),
  authorization({ AccessRoles: [RoleEnum.User] }),
  localFileUpload({
    customPath: "Users",
    validation: [...fileValidation.images],
  }).single("attachments"),
  validation(userValidation.updateProfilePicSchema),
  userService.uploadProfilePic,
);

router.patch(
  "/update-cover-pic",
  authentication({ tokenType: TokenTypeEnum.Access }),
  authorization({ AccessRoles: [RoleEnum.User] }),
  localFileUpload({
    customPath: "Users",
    validation: [...fileValidation.images],
  }).array("attachments", 5),
  validation(userValidation.coverImagesValidation),
  userService.uploadCoverPic,
);

router.patch(
  "/update-password",
  authentication({ tokenType: TokenTypeEnum.Access }),
  authorization({ AccessRoles: [RoleEnum.User, RoleEnum.Admin] }),
  validation(userValidation.updatePasswordSchema),
  userService.updatePassword,
);

router.delete(
  "/:userId/freeze-account",
  authentication({ tokenType: TokenTypeEnum.Access }),
  authorization({ AccessRoles: [RoleEnum.User, RoleEnum.Admin] }),
  validation(userValidation.freezeAccountSchema),
  userService.freezeAccount,
);

// Restored User --> Admin
router.patch(
  "/:userId/restore-account",
  authentication({ tokenType: TokenTypeEnum.Access }),
  authorization({ AccessRoles: [RoleEnum.Admin] }),
  validation(userValidation.restoreAccountSchema),
  userService.restoreAccount,
);

router.delete(
  "/:userId/hard-delete",
  authentication({ tokenType: TokenTypeEnum.Access }),
  authorization({ AccessRoles: [RoleEnum.Admin] }),
  validation(userValidation.hardDeleteAccountSchema),
  userService.hardDeleteAccount,
);


export default router;
