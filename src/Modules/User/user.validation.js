import Joi from "joi";
import { generalFilds } from "../../Middlewares/validation.middleware.js";
import { fileValidation } from "../../Utlis/multer/local.multer.js";


export const updateProfilePicSchema = {
    file: Joi
    .object({
        filename : generalFilds.file.filename.valid("attachments").required(),
        originalname : generalFilds.file.originalname.required(),
        mimetype : generalFilds.file.mimetype
        .valid(...fileValidation.images)
        .required(),
        size : generalFilds.file.size
        .max(5 * 1024 * 1024)
        .required(), // 5MB
        path : generalFilds.file.path.required(),
        destination : generalFilds.file.destination.required(),
        fieldname : generalFilds.file.fieldname.required(),
        encoding : generalFilds.file.encoding.required(),
        finalPath : generalFilds.file.finalPath.required(),
    }).required()
};

export const coverImagesValidation = {
    files: Joi
    .object({
        filename : generalFilds.file.filename.valid("attachments").required(),
        originalname : generalFilds.file.originalname.required(),
        mimetype : generalFilds.file.mimetype
        .valid(...fileValidation.images)
        .required(),
        size : generalFilds.file.size
        .max(5 * 1024 * 1024)
        .required(), // 5MB
        path : generalFilds.file.path.required(),
        destination : generalFilds.file.destination.required(),
        fieldname : generalFilds.file.fieldname.required(),
        encoding : generalFilds.file.encoding.required(),
        finalPath : generalFilds.file.finalPath.required(),
    }).required(),
};

export const updatePasswordSchema = {
 body: Joi.object({
    oldPassword: generalFilds.password.required(),
    newPassword: generalFilds.password.required(),
    confirmNewPassword: Joi.ref("newPassword")
 })
};

export const freezeAccountSchema = {
    params: Joi.object({
        userId: generalFilds.id,
    }),
};

export const restoreAccountSchema = {
    params: Joi.object({
        userId: generalFilds.id,
    }),
};

export const hardDeleteAccountSchema = {
    params: Joi.object({
        userId: generalFilds.id,
    }),
};

