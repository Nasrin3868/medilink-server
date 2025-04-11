// const specCollection=require("../model/specializationModel")
// const slotCollection=require("../model/slotModel")
// const jwt=require('jsonwebtoken')
const doctorCollection = require("../model/doctormodel");
const userCollection = require("../model/usermodel");
const bookedSlotCollection = require("../model/bookedSlotModel");
const chatCollection = require("../model/chatModel");
const messageCollection = require("../model/messageModel");
const { findSenderModel } = require("../helper/findSenderModel");
const { HttpStatusCodes } = require("../helper/enum");

const userAccessChat = async (req, res) => {
  try {
    const { userId } = req.query;
    console.log('userId:',userId)
    if (!userId) {
      console.log("doctorId or userId param is not send with request");
      res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ message: "doctorId param is not send with request" });
    }
    console.log('docId:',req.query.doctorId);
    console.log('userId:',userId);
    let isChat = await chatCollection.findOne({ user: userId }).populate([
      { path: "user", model: "usercollection" },
      { path: "doctor", model: "doctorcollection" },
      { path: "latestMessage", populate: { path: "sender" } },
    ]);
    console.log('isChat:',isChat);

    if (isChat) {
      res.status(HttpStatusCodes.OK).json(isChat);
    } else {
      if(!req.query.doctorId){
        console.log('req.query.doctorId:',req.query.doctorId)
      res.status(HttpStatusCodes.BAD_REQUEST).json({message:"You dont have any chats yet"});
      }else{
        let chatData = {
          chatName: "sender",
          user: userId,
          doctor: doctorId,
        };
        console.log('chatdata:',chatData);
        const createdChat = await chatCollection.create(chatData);
        console.log('createdChat',createdChat);
        const fullChat = await chatCollection
          .findOne({
            _id: createdChat._id,
          })
          .populate({ path: "user", model: "usercollection" })
          .populate({ path: "doctor", model: "doctorcollection" });
  
          console.log("full chat is ==>", fullChat)
          res.status(HttpStatusCodes.OK).json(fullChat);
          // return fullChat;
      }
    }
  } catch (error) {
    console.log("chat access in userside error");
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server error" });
  }
};

const userFetchAllChat = async (req, res) => {
  try {
    console.log('req.query.userId',req.query.userId)
    if(!req.query.userId){
      res.status(HttpStatusCodes.BAD_REQUEST).json({message:"missing required data"})
    }
    //check if the userId is getting from req.userId else we have to pass through api
    let data = await chatCollection
      .find({ users: req.query.userId })
      .populate([
        { path: "user", model: "usercollection" },
        { path: "doctor", model: "doctorcollection" },
        { path: "latestMessage", model: "messageCollection" },
      ])
      .sort({ updatedAt: -1 });
    // console.log('data after populating the user,doctor,latestmessage while fetchchats:',data);
    if (data && data.latestMessage) {
      const senderModel = await findSenderModel(data.latestMessage.sender);
      if (senderModel) {
        await messageCollection.populate(data.latestMessage, {
          path: "sender",
          model: senderModel,
        });
      }
    }
    console.log('data after fetching:',data);
    res.status(HttpStatusCodes.OK).json(data);
  } catch (error) {
    console.log("userFetchChat in userside error");
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Server side error" });
  }
};

const sendMessage = async (req, res) => {
  try {
    console.log("sendMessage in serverSide");
    const { content, chatId, userId } = req.body;
    if (!content || !chatId || !userId) {
      res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ message: "Invalid data passed as content or chatId" });
    }
    const newMessage = {
      sender: userId, // assuming req.userId contains the user's ID
      senderModel: "usercollection",
      content: content,
      chat: chatId,
    };

    //create a new message
    let message = await messageCollection.create(newMessage);
    // console.log('message created',message);

    //update latest message
    let chat = await chatCollection.findByIdAndUpdate(chatId, {
      $set: { latestMessage: message._id },
    });
    const chatss = await chatCollection.findById(chatId);
    // console.log('chat:',chatss);

    //fetch the message and populate required ones
    const populatedMessage = await messageCollection
      .findById(message._id)
      .populate({
        path: "sender",
        model: newMessage.senderModel,
      });
    res.status(HttpStatusCodes.CREATED).json(populatedMessage);
  } catch (error) {
    console.log("sendMessage in userside error");
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Server side error" });
  }
};

const userFetchAllMessages = async (req, res) => {
  try {
    console.log("userFetchAllMessages in serverSide");
    const data = req.query;
    const chatId = data.chatId;
    const messages = await messageCollection
      .find({ chat: chatId })
      .sort({ updatedAt: -1 });
    // .populate({
    //     path: 'sender'
    // })
    // console.log('messages:',messages);
    res.status(HttpStatusCodes.OK).json(messages);
  } catch (error) {
    console.log("userFetchAllMessages in userside error");
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Server side error" });
  }
};

const doctorAccessedChats = async (req, res) => {
  try {
    const { doctorId } = req.query;
    if(!doctorId){
      res.status(HttpStatusCodes.BAD_REQUEST).json({message:"missing required data"})
    }
    let data = await chatCollection
      .find({ doctor: doctorId })
      .populate([
        { path: "user", model: "usercollection" },
        { path: "doctor", model: "doctorcollection" },
        { path: "latestMessage", model: "messageCollection" },
      ])
      .sort({ updatedAt: -1 });
      console.log(data)
      
    // console.log('data after populating the user,doctor,latestmessage while fetchchats:',data);
    res.status(HttpStatusCodes.OK).json(data);
  } catch (error) {
    console.log("internal server error");
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Internal Server Error" });
  }
};

const doctorFetchAllMessages = async (req, res) => {
  try {
    console.log("doctorFetchAllMessages in serverSide");
    const data = req.query;
    const chatId = data.chatId;
    if(!chatId){
      res.status(HttpStatusCodes.BAD_REQUEST).json({message:"missing required data"})
    }
    // console.log(data);
    const messages = await messageCollection
      .find({ chat: chatId })
      .sort({ updatedAt: -1 });
    // .populate({
    //     path: 'sender'
    // })
    // console.log('messages:',messages);
    res.status(HttpStatusCodes.OK).json(messages);
  } catch (error) {
    console.log("doctorFetchAllMessages in doctorside error");
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Server side error" });
  }
};

const doctorSendMessage = async (req, res) => {
  try {
    console.log("doctorSendMessage in serverSide");
    const { content, chatId, doctorId } = req.body;
    if (!content || !chatId || !doctorId) {
      res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ message: "Invalid data passed as content or chatId" });
    }
    const newMessage = {
      sender: doctorId, // assuming req.userId contains the user's ID
      senderModel: "doctorcollection",
      content: content,
      chat: chatId,
    };

    //create a new message
    let message = await messageCollection.create(newMessage);
    console.log("message created", message);

    //update latest message
    let chat = await chatCollection.findByIdAndUpdate(chatId, {
      $set: { latestMessage: message._id },
    });
    const chatss = await chatCollection.findById(chatId);
    console.log("chat:", chatss);

    //fetch the message and populate required ones
    const populatedMessage = await messageCollection
      .findById(message._id)
      .populate({
        path: "sender",
        model: newMessage.senderModel,
      });
    res.status(HttpStatusCodes.CREATED).json(populatedMessage);
  } catch (error) {
    console.log("doctorSendMessage in doctorside error");
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Server side error" });
  }
};

module.exports = {
  userAccessChat,
  userFetchAllChat,
  sendMessage,
  userFetchAllMessages,
  doctorAccessedChats,
  doctorFetchAllMessages,
  doctorSendMessage,
};
