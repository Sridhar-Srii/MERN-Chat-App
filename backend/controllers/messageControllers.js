const asyncHandler = require("express-async-handler");
const Message = require("../models/messageModel");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");



const allMessages = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat");
    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});




//@description     Create New Message
//@route           POST /api/message/
//@access          Protected



const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;
  const userId = req.user._id; // Assuming you set req.user in your authentication middleware

  if (!content || !chatId || !userId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  try {
    const newMessage = await Message.create({
      sender: userId,
      content: content,
      chat: chatId,
    });

    let message = await newMessage.populate("sender", "name pic");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });

    await Chat.findByIdAndUpdate(chatId, { latestMessage: message });

    res.json(message);
  } catch (error) {
    console.error("Error creating message:", error);
    res.status(400).json({ message: error.message });
  }
});





module.exports = { sendMessage, allMessages };
