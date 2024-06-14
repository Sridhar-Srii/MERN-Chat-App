import React, { useEffect, useRef } from "react";
import { ChatState } from "../Context/ChatProvider";
import { Avatar } from "@chakra-ui/avatar";
import { Tooltip } from "@chakra-ui/tooltip";
import { isLastMessage, isSameSender, isSameSenderMargin } from "./config/ChatLogics";

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();
  const chatContainerRef = useRef(null);

  useEffect(() => {
    // Scroll to the bottom of the chat container when messages change
    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  }, [messages]);

  return (
    <div
      ref={chatContainerRef}
      style={{
        maxHeight: "70vh", // Set the maximum height to 80% of the viewport height
        overflowY: "auto",
        paddingBottom: "10px", // Add some bottom padding to prevent the last message from being hidden behind the scrollbar
      }}
    >
      {Array.isArray(messages) && messages.length > 0 ? (
        messages.map((m, i) => (
          <div
            key={m && m._id}
            style={{
              display: "flex",
              flexDirection: m.sender && m.sender._id === user._id ? "row-reverse" : "row",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            {(isSameSender(messages, m, i, user._id) || isLastMessage(messages, i, user._id)) && m.sender && (
              <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                <Avatar mt="7px" mr={1} size="sm" cursor="pointer" name={m.sender.name} src={m.sender.pic} />
              </Tooltip>
            )}
            <span
              style={{
                backgroundColor: `${m.sender && m.sender._id === user._id ? "#B9F5D0" : "#BEE3F8"}`,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
                marginLeft: isSameSenderMargin(messages, m, i, user._id),
              }}
            >
              {m.content}
            </span>
          </div>
        ))
      ) : (
        <div fontFamily="Times New Roman" fontWeight="bold">No messages to display</div>
      )}
    </div>
  );
};

export default ScrollableChat;
