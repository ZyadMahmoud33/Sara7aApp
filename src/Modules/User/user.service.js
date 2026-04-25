import { decrypt } from "../../Utlis/security/encryption.security.js";
import { successResponse } from "../../Utlis/response/succes.response.js";
import UserModel from "../../DB/models/user.model.js";
import { NotFoundException, BadRequestException } from "../../Utlis/response/error.response.js";
import { findOneAndUpdate, updateOne } from "../../DB/models/database.repository.js";
import { model } from "mongoose";
import { compareHash, generateHash } from "../../Utlis/security/hash.security.js";
import { HashEnum } from "../../Utlis/enumes/security.enum.js";
import { findById } from "../../DB/models/database.repository.js";
import { RoleEnum } from "../../Utlis/enumes/user.enumes.js";
import { deleteOne } from "../../DB/models/database.repository.js";

export const getprofile = async (req, res) => {
    req.user.phone = await decrypt(req.user.phone)
    return successResponse ({
        res, 
        message: "Done", 
        statusCode: 200,
        data: req.user,
    });
    
};

export const uploadProfilePic = async (req, res) => {
    const user = await findOneAndUpdate ({
        model: UserModel,
        id: req.user._id,
        update: { profilePic: req.file.finalPath },
    })
    return successResponse ({
        res, 
        message: "Done", 
        statusCode: 200,
        data: user,
    });
    
};


export const uploadCoverPic = async (req, res) => {
    const user = await findOneAndUpdate ({
        model: UserModel,
        id: req.user._id,
        update: { coverImages: req.files?.map((file) => file.finalPath)},
    })
    return successResponse ({
        res, 
        message: "Done", 
        statusCode: 200,
        data: user,
    });
    
};

export const updatePassword = async (req, res) => {
    const { oldPassword, newPassword, confirmNewPassword } = req.body;

    const user = await findById({ model: UserModel, id: req.user._id });

    const isValidPassword = await compareHash ({
        plaintext: oldPassword,
        ciphertext: user.password,
        algo: HashEnum.Argon
    });
    
    if (!isValidPassword) 
        throw BadRequestException("Invalid password");
    
    const hashPassword = await generateHash({
        plaintext: newPassword,
        algo: HashEnum.Argon
    });

    await updateOne ({
        model: UserModel,
        filter: { _id: req.user._id },
        update: { password: hashPassword },
    })

    return successResponse ({
        res, 
        message: "Password updated successfully", 
        statusCode: 200,
    });
    
};

export const freezeAccount = async (req, res) => {
    const { userId } = req.params;
    //check if user is admin
    if (userId && req.user.role !== RoleEnum.Admin)
        throw ForbiddenException({ message: "You are not authorized to freeze an account" });
    const updatedUser = await findOneAndUpdate({
        model: UserModel,
        filter: { _id: userId || req.user._id, freezedAt: { $exists: false } },
        update: {
            freezedAt: Date.now(),
            freezedBy: req.user._id,
            $unset: { 
                // Remove restored fields if they exist
                restoredBy: true,
                restoredAt: true
            },
        },
    });
    return successResponse ({
        res, 
        message: "Account freezed successfully", 
        statusCode: 200,
        data: { updatedUser },
    });
    
};

export const restoreAccount = async (req, res) => {
    const { userId } = req.params;
    
    const updatedUser = await findOneAndUpdate({
        model: UserModel,
        filter: { 
            _id: userId ,
            freezedAt: { $exists: true },
            freezedBy: { $ne: userId },
        },
        update: {
            restoredAt: Date.now(),
            restoredBy: req.user._id,
            $unset: { 
                // Remove restored fields if they exist
                freezedAt: true,
                freezedBy: true
            },
        },
    });
    return successResponse ({
        res, 
        message: " User Restored Successfully", 
        statusCode: 200,
        data: { updatedUser },
    });
    
};

export const hardDeleteAccount = async (req, res) => {
    const { userId } = req.params;
    const user = await deleteOne({
        model: UserModel,
        filter: { _id: userId },
    });
    user.deletedCount
     ? successResponse ({
        res, 
        message: " User Deleted Successfully", 
        statusCode: 200,
     }) 
    : NotFoundException({ message: "User not found" });
    
};


