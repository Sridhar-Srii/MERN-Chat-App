import { Box, Button, Tooltip, Text, Menu, MenuButton, MenuList, Avatar, MenuItem, MenuDivider, Drawer, DrawerOverlay, DrawerContent, DrawerHeader, DrawerBody, Input, useToast } from "@chakra-ui/react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import React, { useEffect, useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import ProfileModel from "./ProfileModal";
import { useDisclosure } from "@chakra-ui/hooks";
import axios from "axios";
import ChatLoading from "../ChatLoading";
import UserListItem from "../UserAvatar/UserListItem";
import { Spinner } from "@chakra-ui/spinner";
import { getSender } from "../config/ChatLogics";
import NotificationBadge from "react-notification-badge";
import { Effect } from "react-notification-badge";
import { Image } from '@chakra-ui/react'
import chatapp from "../../Images/chatapp.png"

const SideDrawer = () => {


  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();

  const { user, setSelectedChat, chats, setChats, notification, setNotification } = ChatState();



  const { isOpen, onOpen, onClose } = useDisclosure()


  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    window.location.href = '/';
  };




  const toast = useToast();


  // live Search User ;;

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!search) return;
      setLoading(true);
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };
        const { data } = await axios.get(`/api/user?search=${search}`, config);
        setLoading(false);
        setSearchResult(data);
      } catch (error) {
        setLoading(false);
        toast({
          title: "Error Occurred!",
          description: "Failed to Load the Search Results",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-left",
        });
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchSearchResults();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [search, user.token, toast]);




  const accessChat = async (userId) => {
    console.log(userId);

    try {
      setLoadingChat(true);

      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(`/api/chat`, { userId }, config);

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };


  return (

    <div>


      <Box display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white" w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px"> 


        <Tooltip label="Search Users to Chat" hasArrow placement="bottom-end">

          <Button variant="ghost" onClick={onOpen}>

            <i class="fa-brands fa-searchengin"></i>

            <Text display={{ base: "none", md: "flex " }} px="4" fontFamily="Times New Roman" fontWeight="bold">
              Search User
            </Text>

          </Button>

        </Tooltip>

        {/* <Text fontSize={{ base: "18px", md: "2xl" }} fontFamily="Work sans"> Chat-App</Text> */}

        <Box display="flex" alignItems="center">
          <Image
            src={chatapp}
            width={{ base: "30px", md: "50px" }}
            height={{ base: "30px", md: "50px" }}
            mt="7px"
            me="10px"
            alt='Chat App Logo'
          />
          <Text fontSize={{ base: "1xl", md: "4xl" }} fontFamily="Times New Roman" fontWeight="bold">
            Chat App
          </Text>
          <Image
            src={chatapp}
            width={{ base: "30px", md: "50px" }}
            height={{ base: "30px", md: "50px" }} 
            mt="7px"
            ms="10px"
            alt='Chat App Logo'
          />
        </Box>

        <div>
          <Menu>
            <MenuButton p="1">
              <NotificationBadge
                count={notification.length}
                effect={Effect.SCALE}
              />
              <BellIcon fontSize="2xl"></BellIcon>
            </MenuButton>

            <MenuList pl={2}>
              {!notification.length && "No New Messages"}
              {notification.map((notif) => (
                <MenuItem
                  key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setNotification(notification.filter((n) => n !== notif));
                  }}
                >
                  {notif.chat.isGroupChat
                    ? `New Message in ${notif.chat.chatName}`
                    : `New Message from ${getSender(user, notif.chat.users)}`}
                </MenuItem>
              ))}

            </MenuList>

          </Menu>

          <Menu>

            <MenuButton as={Button} rightIcon={<ChevronDownIcon></ChevronDownIcon>}>
              <Avatar size="sm" cursor="pointer" name={user.name} src={user.pic}></Avatar>
            </MenuButton>

            <MenuList> 
              
              <ProfileModel user={user}>
              <MenuItem>My Profile</MenuItem>
              </ProfileModel>

              <MenuDivider></MenuDivider>
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>

          </Menu>

        </div>

      </Box>

      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>

        <DrawerOverlay></DrawerOverlay>
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
          <DrawerBody>
            <Box display="flex" pb={2}>
              <Input
                placeholder="Search by Name or Email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}>
              </Input>
              {/* <Button onClick={fetchSearchResults}>Go</Button> */}
            </Box>
            {loading ? (
              <ChatLoading></ChatLoading>
            ) : (
              searchResult?.map((user) => (
                <UserListItem key={user._id} user={user} handleFunction={() => accessChat(user._id)} />
              ))
            )}
            {loadingChat && <Spinner ml="auto" display="flex"></Spinner>}
          </DrawerBody>
        </DrawerContent>

      </Drawer>

    </div>
  )
}

export default SideDrawer;