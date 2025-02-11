import { useNavigate } from "react-router";

const { createContext, useContext, useState, useEffect } = require("react");

const ChatContext = createContext();



const ChatProvider = ({children}) => {

    const [user,setUser] = useState();
    const [selectedChat, setSelectedChat] = useState();
    const [chats, setChats] = useState([]);
    const [notification, setNotification] = useState([]);


    const Navigate = useNavigate();

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        setUser(userInfo);

        if(!userInfo) {
            Navigate('/');
        }

    },[Navigate]);



    return(

        <ChatContext.Provider value={{ user, setUser, selectedChat, setSelectedChat, chats, setChats, notification,setNotification}}>
        {children}
        </ChatContext.Provider>
    );

};

export const ChatState = () => {
    return useContext(ChatContext);
}


export default ChatProvider;