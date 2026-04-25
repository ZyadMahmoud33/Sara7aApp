import { create, find, findById } from "../../DB/models/database.repository.js";
import UserModel from "../../DB/models/user.model.js";
import { NotFoundException, BadRequestException } from "../../Utlis/response/error.response.js";
import MessageModel from "../../DB/models/message.model.js";
import { successResponse } from "../../Utlis/response/succes.response.js";

export const sendMessage = async (req, res) => {
    const { receiverId } = req.params;
    const { content } = req.body;
    
    const user = await findById ({
        model: UserModel,
        id: receiverId
    });
    if(!user) throw NotFoundException ({ message: "receiver not found" });
    if (!content) throw BadRequestException({ message: "Content is required" });

    //send message 
    const message = await create({ 
        model: MessageModel,
        data: [{ content, receiverId: user._id,}] 
    });
    return successResponse({ 
        res,
        statusCode: 200,
        message: "Message sent successfully", 
        data: { message }
    });
};

export const getMessage = async (req, res) => {
    const message = await find({
        model: MessageModel,
    })
    return successResponse({ 
        res,
        statusCode: 200,
        message: "Message sent successfully", 
        data: { message }
    });
};
//Admin
export const getAllMessages = async (req, res) => {
  const messages = await find({
    model: MessageModel,
  });

  return successResponse({
    res,
    message: "All messages",
    data: { messages },
  });
};

export const getUserMessages = async (req, res) => {
  const { receiverId } = req.params;

  const messages = await find({
    model: MessageModel,
    filter: { receiverId },
  });

  return successResponse({
    res,
    message: "User messages",
    data: { messages },
  });
};
