const Message = require("../models/message");
const User = require("../models/userModel");

// ==========================
// Send Message
// ==========================
const sendMessage = async (req, res) => {
  try {
    const senderId = req.user.id;
    const { receiver, message } = req.body;

    if (!receiver) {
      return res.status(400).json({
        message: "Receiver is required",
      });
    }

    if (!message?.trim() && !req.file) {
      return res.status(400).json({
        message: "Message or attachment is required",
      });
    }

    const receiverUser = await User.findById(receiver);

    if (!receiverUser) {
      return res.status(404).json({
        message: "Receiver not found",
      });
    }

    const newMessage = await Message.create({
      sender: senderId,
      receiver,
      message: message?.trim() || "",
      attachment: req.file
        ? `/uploads/messages/${req.file.filename}`
        : "",
      attachmentName: req.file
        ? req.file.originalname
        : "",
      attachmentType: req.file
        ? req.file.mimetype
        : "",
    });

    const populatedMessage = await Message.findById(newMessage._id)
      .populate("sender", "name email profileImage")
      .populate("receiver", "name email profileImage");

    res.status(201).json({
      message: "Message sent successfully",
      data: populatedMessage,
    });
  } catch (error) {
    console.error("Send Message Error:", error);

    res.status(500).json({
      message: "Failed to send message",
      error: error.message,
    });
  }
};

// ==========================
// Get Conversation
// ==========================
const getConversation = async (req, res) => {
  try {
    const userId = req.user.id;
    const otherUserId = req.params.userId;

    const otherUser = await User.findById(otherUserId).select(
      "name email profileImage role resume"
    );

    if (!otherUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const messages = await Message.find({
      $or: [
        {
          sender: userId,
          receiver: otherUserId,
        },
        {
          sender: otherUserId,
          receiver: userId,
        },
      ],
    })
      .populate("sender", "name email profileImage")
      .populate("receiver", "name email profileImage")
      .sort({ createdAt: 1 });

    res.status(200).json({
      user: otherUser,
      messages,
    });
  } catch (error) {
    console.error("Get Conversation Error:", error);

    res.status(500).json({
      message: "Failed to fetch conversation",
      error: error.message,
    });
  }
};

// ==========================
// Get My Conversations
// ==========================
const getMyConversations = async (req, res) => {
  try {
    const userId = req.user.id;

    const messages = await Message.find({
      $or: [
        { sender: userId },
        { receiver: userId },
      ],
    })
      .populate("sender", "name email profileImage role")
      .populate("receiver", "name email profileImage role")
      .sort({ createdAt: -1 });

    const conversations = [];

    const conversationUsers = new Set();

    for (const msg of messages) {
      const otherUser =
        msg.sender._id.toString() === userId
          ? msg.receiver
          : msg.sender;

      const otherUserId = otherUser._id.toString();

      if (!conversationUsers.has(otherUserId)) {
        conversationUsers.add(otherUserId);

        conversations.push({
          user: otherUser,
          lastMessage: msg,
          unreadCount: 0,
        });
      }
    }

    // Get unread counts
    for (const conversation of conversations) {
      conversation.unreadCount = await Message.countDocuments({
        sender: conversation.user._id,
        receiver: userId,
        isRead: false,
      });
    }

    res.status(200).json({
      count: conversations.length,
      conversations,
    });
  } catch (error) {
    console.error("Get Conversations Error:", error);

    res.status(500).json({
      message: "Failed to fetch conversations",
      error: error.message,
    });
  }
};

// ==========================
// Get Unread Count
// ==========================
const getUnreadCount = async (req, res) => {
  try {
    const count = await Message.countDocuments({
      receiver: req.user.id,
      isRead: false,
    });

    res.status(200).json({
      count,
    });
  } catch (error) {
    console.error("Unread Count Error:", error);

    res.status(500).json({
      message: "Failed to fetch unread messages",
      error: error.message,
    });
  }
};

// ==========================
// Mark Conversation Read
// ==========================
const markConversationRead = async (req, res) => {
  try {
    const userId = req.user.id;
    const otherUserId = req.params.userId;

    await Message.updateMany(
      {
        sender: otherUserId,
        receiver: userId,
        isRead: false,
      },
      {
        $set: {
          isRead: true,
        },
      }
    );

    res.status(200).json({
      message: "Messages marked as read",
    });
  } catch (error) {
    console.error("Mark Read Error:", error);

    res.status(500).json({
      message: "Failed to mark messages as read",
      error: error.message,
    });
  }
};

module.exports = {
  sendMessage,
  getConversation,
  getMyConversations,
  getUnreadCount,
  markConversationRead,
};