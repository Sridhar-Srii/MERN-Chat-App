import React, { useState, useEffect } from "react";
import { ChatState } from "../Context/ChatProvider";
import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from "@chakra-ui/react";
import ProfileModal from "./miscellaneous/ProfileModal";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { FiSend } from "react-icons/fi";
import { getSender, getSenderFull } from "./config/ChatLogics";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModall";
import axios from "axios";
import ScrollableChat from "./ScrollableChat";
import Lottie from "react-lottie";
import animationData from "../Animations/typing.json";

import io from 'socket.io-client';
const ENDPOINT = "http://localhost:8000";
let socket, selectedChatCompare;



const SingleChat = ({ fetchAgain, setFetchAgain }) => {


  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [istyping, setIsTyping] = useState(false);


  const toast = useToast();

  const { user, selectedChat, setSelectedChat, notification, setNotification} = ChatState();


  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };



  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);

      const { data } = await axios.get(`/api/message/${selectedChat._id}`, config);
      setMessages(data);
      setLoading(false);
      socket.emit('join chat', selectedChat._id);
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: "Failed to Load the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  useEffect(() => {
    fetchMessages();

    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  // console.log(notification, "..............................."); 



  const sendMessage = async (event) => {
    if ((event.key === "Enter" || event.type === "click") && newMessage) {
      socket.emit('stop typing', selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };

        setNewMessage("");
        const { data } = await axios.post("/api/message", {
          content: newMessage,
          chatId: selectedChat._id,
          userId: user._id,
        }, config);

        socket.emit('new Message', data);
        setMessages([...messages, data]);
        // console.log(data);
      } catch (error) {
        console.error("Error sending message:", error);
        toast({
          title: "Error Occurred!",
          description: "Failed to send the Message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };


  useEffect(() => {
    // Initialize the socket connection
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));

    // Handle connection event
    socket.on('connect', () => {
      console.log('Connected to Socket.io');
    });

    // Handle disconnection event
    socket.on('disconnect', () => {
      console.log('Disconnected from Socket.io');
    });

    // Clean up the connection when the component unmounts
    return () => {
      socket.disconnect();
    };

  }, []);


  useEffect(() => {

    socket.on("message received", (newMessageReceived) => {
      if (
        !selectedChatCompare || // if chat is not selected or doesn't match current chat
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) 
      {
        if (!notification.includes(newMessageReceived)) {
          setNotification([newMessageReceived, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      }
       else {
        setMessages([...messages, newMessageReceived]);
      }
    });

  });






  const typingHandler = (e) => {

    setNewMessage(e.target.value);
 

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);

  };





  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Times New Roman" fontWeight="bold"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat(null)}
            />
            {messages &&
              (!selectedChat.isGroupChat ? (
                <>
                  {getSender(user, selectedChat.users)}
                  <ProfileModal user={getSenderFull(user, selectedChat.users)} />
                </>
              ) : (
                <>
                  {selectedChat.chatName.toUpperCase()}
                  <UpdateGroupChatModal fetchMessages={fetchMessages} fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
                </>
              ))}
          </Text>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading ? (
              <Spinner size="xl" w={20} h={20} alignSelf="center" margin="auto" />
            ) : (
              <div className="messages">
                <ScrollableChat messages={messages} />
              </div>
            )}

            <FormControl id="first-name" isRequired mt={3} display="flex" alignItems="center" position="relative">
              {istyping ? (
                <Box position="absolute" left="0" top="-50px"> {/* Adjust top value as needed */}    
                  <Lottie
                    options={defaultOptions}
                    height={40}
                    width={70}
                    // style={{ marginBottom: 15 }}
                  />
                </Box>
              ) : null}
              <Input
                variant="filled"
                bg="#E0E0E0"
                placeholder="Enter a message.."
                value={newMessage}
                onChange={typingHandler}
                onKeyDown={sendMessage}
                fontSize={{ base: "sm", md: "md" }} // Adjust font size for responsiveness
                py={{ base: 2, md: 3 }} // Adjust padding vertically for responsiveness
                px={{ base: 3, md: 4 }} // Adjust padding horizontally for responsiveness
              />
              <IconButton
                colorScheme="blue" 
                icon={<FiSend />}
                onClick={sendMessage}
                aria-label="Send message"
                fontSize={{ base: "lg", md: "xl" }} // Adjust font size for responsiveness
                ml={2} // Add margin for spacing
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box display="flex" alignItems="center" justifyContent="center" h="100%">
          <Text fontSize="3xl" pb={3} fontFamily="Times New Roman" fontWeight="bold">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};


export default SingleChat; 
