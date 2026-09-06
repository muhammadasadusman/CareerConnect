import { useEffect, useRef, useState } from "react";
import { Link, useParams} from "react-router-dom";

import {
  FaArrowLeft,
  FaSearch,
  FaPaperPlane,
  FaEnvelope,
  FaClock,
  FaPaperclip,
  FaFilePdf,
  FaFileWord,
  FaImage,
  FaDownload,
  FaTimes,
  FaCheck,
FaCheckDouble,
} from "react-icons/fa";

import API from "../../api/api";

const Messages = () => {
  const { userId } = useParams();
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);

  const [messageText, setMessageText] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const [search, setSearch] = useState("");

  const [loadingConversations, setLoadingConversations] =
    useState(true);

  const [loadingMessages, setLoadingMessages] =
    useState(false);

  const [sending, setSending] = useState(false);

  const messagesEndRef = useRef(null);

  // =====================================================
  // API CONFIG
  // =====================================================

  const token = localStorage.getItem("token");

  // =====================================================
  // Fetch Conversations
  // =====================================================

  const fetchConversations = async () => {
    try {
      setLoadingConversations(true);

      const response = await API.get("/messages");

      setConversations(response.data.conversations || []);
    } catch (error) {
      console.error(
        "Fetch Conversations Error:",
        error.response?.data || error.message
      );
    } finally {
      setLoadingConversations(false);
    }
  };

  // =====================================================
  // Fetch Conversation
  // =====================================================

  const fetchConversation = async (userId) => {
    try {
      setLoadingMessages(true);

      const response = await API.get(
        `/messages/conversation/${userId}`
      );

      setSelectedUser(response.data.user);
      setChatMessages(response.data.messages || []);

      // Mark conversation as read
      await API.put(`/messages/read/${userId}`);

      // Update unread count locally
      setConversations((prev) =>
        prev.map((conversation) => {
          if (
            conversation.user?._id === userId
          ) {
            return {
              ...conversation,
              unreadCount: 0,
            };
          }

          return conversation;
        })
      );
    } catch (error) {
      console.error(
        "Fetch Conversation Error:",
        error.response?.data || error.message
      );
    } finally {
      setLoadingMessages(false);
    }
  };

  // =====================================================
  // Initial Load
  // =====================================================

  useEffect(() => {
  if (token) {
    fetchConversations();
  }
}, [token]);


useEffect(() => {
  if (!userId || !token) return;

  fetchConversation(userId);
}, [userId, token]);

  // =====================================================
  // Auto Scroll
  // =====================================================

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [chatMessages]);

  // =====================================================
  // Select Conversation
  // =====================================================

  const handleSelectConversation = (conversation) => {
    const user = conversation.user;

    setSelectedUser(user);

    fetchConversation(user._id);
  };

  // =====================================================
  // Send Message
  // =====================================================

  const handleSend = async (e) => {
    e.preventDefault();

    if (
      !selectedUser ||
      (!messageText.trim() && !selectedFile)
    ) {
      return;
    }

    try {
      setSending(true);

      const formData = new FormData();

      formData.append(
        "receiver",
        selectedUser._id
      );

      if (messageText.trim()) {
        formData.append(
          "message",
          messageText.trim()
        );
      }

      if (selectedFile) {
        formData.append(
          "attachment",
          selectedFile
        );
      }

      const response = await API.post(
        "/messages",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const newMessage = response.data.data;

      setChatMessages((prev) => [
        ...prev,
        newMessage,
      ]);

      setMessageText("");
      setSelectedFile(null);

      // Reset file input
      const fileInput =
        document.getElementById("message-file");

      if (fileInput) {
        fileInput.value = "";
      }

      // Refresh conversations
      fetchConversations();
    } catch (error) {
      console.error(
        "Send Message Error:",
        error.response?.data || error.message
      );

      alert(
        error.response?.data?.message ||
          "Failed to send message"
      );
    } finally {
      setSending(false);
    }
  };

  // =====================================================
  // File Select
  // =====================================================

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/jpeg",
      "image/png",
      "image/jpg",
    ];

    if (!allowedTypes.includes(file.type)) {
      alert(
        "Only PDF, DOC, DOCX, JPG and PNG files are allowed."
      );

      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert(
        "File size must be less than 5MB."
      );

      e.target.value = "";
      return;
    }

    setSelectedFile(file);
  };

  // =====================================================
  // Remove Selected File
  // =====================================================

  const removeSelectedFile = () => {
    setSelectedFile(null);

    const fileInput =
      document.getElementById("message-file");

    if (fileInput) {
      fileInput.value = "";
    }
  };

  // =====================================================
  // Search
  // =====================================================

  const filteredConversations =
    conversations.filter((conversation) => {
      const name =
        conversation.user?.name?.toLowerCase() || "";

      const email =
        conversation.user?.email?.toLowerCase() || "";

      const lastMessage =
        conversation.lastMessage?.message?.toLowerCase() ||
        "";

      const searchText =
        search.toLowerCase();

      return (
        name.includes(searchText) ||
        email.includes(searchText) ||
        lastMessage.includes(searchText)
      );
    });

  // =====================================================
  // Format Date
  // =====================================================

  const formatTime = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // =====================================================
  // Format Conversation Date
  // =====================================================

  const formatConversationDate = (date) => {
    if (!date) return "";

    const messageDate = new Date(date);
    const today = new Date();

    const sameDay =
      messageDate.toDateString() ===
      today.toDateString();

    if (sameDay) {
      return formatTime(date);
    }

    return messageDate.toLocaleDateString([], {
      day: "2-digit",
      month: "short",
    });
  };

  // =====================================================
  // Get Initials
  // =====================================================

  const getInitials = (name = "") => {
    return name
      .split(" ")
      .filter(Boolean)
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  // =====================================================
  // Attachment Icon
  // =====================================================

  const getAttachmentIcon = (type = "") => {
    if (type.includes("pdf")) {
      return (
        <FaFilePdf className="text-red-500" />
      );
    }

    if (
      type.includes("word") ||
      type.includes("document")
    ) {
      return (
        <FaFileWord className="text-blue-500" />
      );
    }

    if (type.includes("image")) {
      return (
        <FaImage className="text-green-500" />
      );
    }

    return (
      <FaPaperclip className="text-purple-500" />
    );
  };

  // =====================================================
  // Attachment URL
  // =====================================================

  const getAttachmentUrl = (attachment) => {
    if (!attachment) return "";

    if (attachment.startsWith("http")) {
      return attachment;
    }

    return `http://localhost:5000${attachment}`;
  };

  return (
    <div className="min-h-screen bg-gray-100">

      {/* =================================================
          Header
      ================================================= */}

      <header className="bg-[#070B2B] text-white">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="min-h-20 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

            <div>

              <h1 className="text-2xl sm:text-3xl font-bold">
                Career
                <span className="text-purple-500">
                  Connect
                </span>
              </h1>

              <p className="text-gray-400 text-sm mt-1">
                Employer Panel
              </p>

            </div>

            <Link
              to="/employer-dashboard"
              className="inline-flex items-center justify-center gap-2 text-sm text-gray-300 hover:text-purple-400 transition"
            >
              <FaArrowLeft />
              Dashboard
            </Link>

          </div>

        </div>

      </header>


      {/* =================================================
          Main
      ================================================= */}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

        {/* Heading */}

        <div className="mb-6">

          <p className="text-sm text-purple-600 font-medium">
            EMPLOYER PANEL
          </p>

          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
            Messages
          </h1>

          <p className="text-gray-500 mt-2 text-sm sm:text-base">
            Communicate with candidates and manage your conversations.
          </p>

        </div>


        {/* =================================================
            Messages Container
        ================================================= */}

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">

          <div className="grid grid-cols-1 lg:grid-cols-3 min-h-[650px]">


            {/* =================================================
                Conversation List
            ================================================= */}

            <div
              className={`border-r border-gray-200 ${
                selectedUser
                  ? "hidden lg:block"
                  : "block"
              }`}
            >

              {/* Search */}

              <div className="p-4 border-b border-gray-200">

                <div className="relative">

                  <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                  <input
                    type="text"
                    value={search}
                    onChange={(e) =>
                      setSearch(e.target.value)
                    }
                    placeholder="Search candidates..."
                    className="w-full bg-gray-100 rounded-lg pl-11 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-purple-500"
                  />

                </div>

              </div>


              {/* Conversations */}

              <div className="max-h-[580px] overflow-y-auto">

                {loadingConversations ? (

                  <div className="p-8 text-center text-gray-500">
                    Loading conversations...
                  </div>

                ) : filteredConversations.length === 0 ? (

                  <div className="p-8 text-center">

                    <div className="w-16 h-16 mx-auto rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-2xl">
                      <FaEnvelope />
                    </div>

                    <h3 className="font-semibold text-gray-900 mt-4">
                      No conversations
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                      Candidate messages will appear here.
                    </p>

                  </div>

                ) : (

                  filteredConversations.map(
                    (conversation) => {

                      const user =
                        conversation.user;

                      const isSelected =
                        selectedUser?._id ===
                        user?._id;

                      return (

                        <button
                          key={user?._id}
                          type="button"
                          onClick={() =>
                            handleSelectConversation(
                              conversation
                            )
                          }
                          className={`w-full text-left p-4 border-b border-gray-100 transition ${
                            isSelected
                              ? "bg-purple-50"
                              : "hover:bg-gray-50"
                          }`}
                        >

                          <div className="flex items-start gap-3">

                            {/* Avatar */}

                            <div className="w-11 h-11 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold shrink-0">

                              {getInitials(
                                user?.name
                              )}

                            </div>


                            {/* Info */}

                            <div className="flex-1 min-w-0">

                              <div className="flex items-center justify-between gap-2">

                                <h3 className="font-semibold text-gray-900 truncate">
                                  {user?.name}
                                </h3>

                                <span className="text-xs text-gray-400 shrink-0">
                                  {formatConversationDate(
                                    conversation
                                      .lastMessage
                                      ?.createdAt
                                  )}
                                </span>

                              </div>


                              <p className="text-xs text-gray-400 mt-1 truncate">
                                {user?.email}
                              </p>


                              <p className="text-sm text-gray-500 truncate mt-1">

                                {conversation
                                  .lastMessage
                                  ?.message ||
                                  conversation
                                    .lastMessage
                                    ?.attachmentName ||
                                  "Attachment"}

                              </p>


                              {conversation.unreadCount >
                                0 && (

                                <span className="inline-flex items-center justify-center mt-2 bg-purple-600 text-white text-xs font-bold rounded-full min-w-5 h-5 px-1">

                                  {
                                    conversation.unreadCount
                                  }

                                </span>

                              )}

                            </div>

                          </div>

                        </button>

                      );
                    }
                  )

                )}

              </div>

            </div>


            {/* =================================================
                Chat Area
            ================================================= */}

            <div
              className={`lg:col-span-2 flex flex-col min-h-[650px] ${
                selectedUser
                  ? "block"
                  : "hidden lg:flex"
              }`}
            >

              {!selectedUser ? (

                /* Empty State */

                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">

                  <div className="w-20 h-20 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-3xl">

                    <FaEnvelope />

                  </div>

                  <h2 className="text-xl font-bold text-gray-900 mt-5">
                    Select a Conversation
                  </h2>

                  <p className="text-gray-500 mt-2 max-w-md">
                    Select a candidate from the list to view the conversation and reply.
                  </p>

                </div>

              ) : (

                <>

                  {/* =================================================
                      Chat Header
                  ================================================= */}

                  <div className="p-4 sm:p-5 border-b border-gray-200 flex items-center gap-3">

                    <button
                      type="button"
                      onClick={() =>
                        setSelectedUser(null)
                      }
                      className="lg:hidden text-gray-500 hover:text-purple-600 transition"
                    >
                      <FaArrowLeft />
                    </button>


                    <div className="w-11 h-11 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold shrink-0">

                      {getInitials(
                        selectedUser.name
                      )}

                    </div>


                    <div className="min-w-0">

                      <h2 className="font-bold text-gray-900 truncate">
                        {selectedUser.name}
                      </h2>

                      <p className="text-xs text-gray-500 truncate">
                        {selectedUser.email}
                      </p>

                    </div>

                  </div>


                  {/* =================================================
                      Messages
                  ================================================= */}

                  <div className="flex-1 p-4 sm:p-6 space-y-4 bg-gray-50 overflow-y-auto">

                    {loadingMessages ? (

                      <div className="flex items-center justify-center h-full text-gray-500">
                        Loading messages...
                      </div>

                    ) : chatMessages.length === 0 ? (

                      <div className="flex items-center justify-center h-full">

                        <div className="text-center">

                          <div className="w-16 h-16 mx-auto rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-2xl">
                            <FaEnvelope />
                          </div>

                          <h3 className="font-semibold text-gray-900 mt-4">
                            No messages yet
                          </h3>

                          <p className="text-sm text-gray-500 mt-1">
                            Start the conversation with this candidate.
                          </p>

                        </div>

                      </div>

                    ) : (

                      chatMessages.map(
                        (message) => {

                          const senderId =
                            message.sender?._id;

                          const isEmployer =
                            senderId !==
                            selectedUser._id;

                          return (

                            <div
                              key={message._id}
                              className={`flex ${
                                isEmployer
                                  ? "justify-end"
                                  : "justify-start"
                              }`}
                            >

                              <div
                                className={`max-w-[90%] sm:max-w-[75%] rounded-2xl px-4 py-3 ${
                                  isEmployer
                                    ? "bg-purple-600 text-white rounded-br-none"
                                    : "bg-white text-gray-700 shadow-sm rounded-bl-none"
                                }`}
                              >

                                {/* Text */}

                                {message.message && (

                                  <p className="text-sm leading-6 whitespace-pre-wrap">
                                    {message.message}
                                  </p>

                                )}


                                {/* Attachment */}

                                {message.attachment && (

                                  <a
                                    href={getAttachmentUrl(
                                      message.attachment
                                    )}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`mt-3 flex items-center gap-3 p-3 rounded-lg border ${
                                      isEmployer
                                        ? "bg-purple-700 border-purple-400"
                                        : "bg-gray-50 border-gray-200"
                                    }`}
                                  >

                                    <div className="text-xl">

                                      {getAttachmentIcon(
                                        message.attachmentType
                                      )}

                                    </div>


                                    <div className="flex-1 min-w-0">

                                      <p
                                        className={`text-sm font-medium truncate ${
                                          isEmployer
                                            ? "text-white"
                                            : "text-gray-800"
                                        }`}
                                      >
                                        {message.attachmentName ||
                                          "Attachment"}
                                      </p>

                                      <p
                                        className={`text-xs ${
                                          isEmployer
                                            ? "text-purple-200"
                                            : "text-gray-500"
                                        }`}
                                      >
                                        Click to open
                                      </p>

                                    </div>


                                    <FaDownload
                                      className={
                                        isEmployer
                                          ? "text-purple-200"
                                          : "text-gray-400"
                                      }
                                    />

                                  </a>

                                )}


{/* Time + Message Status */}

<div
  className={`flex items-center gap-2 text-xs mt-2 ${
    isEmployer
      ? "text-purple-200"
      : "text-gray-400"
  }`}
>

  {/* Time */}
  <div className="flex items-center gap-1">
    <FaClock />

    {formatTime(message.createdAt)}
  </div>

  {/* Sent / Seen Status */}
  {isEmployer && (
    <div className="flex items-center gap-1">

      {message.isRead ? (
        <>
          <FaCheckDouble className="text-blue-300" />

          <span className="text-blue-300">
            Seen
          </span>
        </>
      ) : (
        <>
          <FaCheck className="text-purple-200" />

          <span className="text-purple-200">
            Sent
          </span>
        </>
      )}

    </div>
  )}

</div>
                                

                              </div>

                            </div>

                          );
                        }
                      )

                    )}

                    <div ref={messagesEndRef} />

                  </div>


                  {/* =================================================
                      Selected File Preview
                  ================================================= */}

                  {selectedFile && (

                    <div className="px-4 pt-3 bg-white border-t border-gray-200">

                      <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-lg p-3">

                        <div className="text-xl">

                          {getAttachmentIcon(
                            selectedFile.type
                          )}

                        </div>


                        <div className="flex-1 min-w-0">

                          <p className="text-sm font-medium text-gray-800 truncate">
                            {selectedFile.name}
                          </p>

                          <p className="text-xs text-gray-500">
                            {(
                              selectedFile.size /
                              1024 /
                              1024
                            ).toFixed(2)}{" "}
                            MB
                          </p>

                        </div>


                        <button
                          type="button"
                          onClick={
                            removeSelectedFile
                          }
                          className="w-8 h-8 rounded-lg hover:bg-red-100 text-gray-500 hover:text-red-500 flex items-center justify-center transition"
                        >
                          <FaTimes />
                        </button>

                      </div>

                    </div>

                  )}


                  {/* =================================================
                      Message Input
                  ================================================= */}

                  <form
                    onSubmit={handleSend}
                    className="p-4 border-t border-gray-200 bg-white"
                  >

                    <div className="flex items-center gap-2">

                      {/* File */}

                      <label
                        htmlFor="message-file"
                        className="w-11 h-11 rounded-lg border border-gray-300 text-gray-500 hover:text-purple-600 hover:border-purple-500 flex items-center justify-center cursor-pointer transition shrink-0"
                        title="Attach file"
                      >

                        <FaPaperclip />

                      </label>


                      <input
                        id="message-file"
                        type="file"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        onChange={handleFileChange}
                        className="hidden"
                      />


                      {/* Text */}

                      <input
                        type="text"
                        value={messageText}
                        onChange={(e) =>
                          setMessageText(
                            e.target.value
                          )
                        }
                        placeholder="Type your message..."
                        className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-sm outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                      />


                      {/* Send */}

                      <button
                        type="submit"
                        disabled={
                          sending ||
                          (!messageText.trim() &&
                            !selectedFile)
                        }
                        className="w-12 h-12 rounded-lg bg-purple-600 hover:bg-yellow-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white flex items-center justify-center transition shrink-0"
                        title="Send Message"
                      >

                        {sending ? (
                          <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        ) : (
                          <FaPaperPlane />
                        )}

                      </button>

                    </div>

                    <p className="text-xs text-gray-400 mt-2">
                      PDF, DOC, DOCX, JPG and PNG files up to 5MB.
                    </p>

                  </form>

                </>

              )}

            </div>

          </div>

        </div>

      </main>

    </div>
  );
};

export default Messages;