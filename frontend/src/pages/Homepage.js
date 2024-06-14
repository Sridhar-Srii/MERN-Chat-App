import {
    Box,
    Container,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Text,
  } from "@chakra-ui/react";
import { useEffect } from "react";
import Login from "../components/Authentication/Login";
import Signup from "../components/Authentication/Signup";
import { useNavigate } from "react-router";
import { Image } from '@chakra-ui/react'
import chatapp from "../Images/chatapp.png"



const Homepage = () => {


    const Navigate = useNavigate();

    useEffect(() => {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      // setUser(userInfo);

      if(userInfo) {
          Navigate('/chats');
      }

  },[Navigate]);
   
    return (

      <Container maxW="xl" centerContent>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          p={3}
          bg="white"
          w="100%"
          m="40px 0 15px 0"
          borderRadius="lg"
          borderWidth="1px"
        >
         <Box display="flex" alignItems="center">
          <Image
            src={chatapp}
            width={{ base: "30px", md: "50px" }}
            height={{ base: "30px", md: "50px" }}
            mt="7px"
            me="10px"
            alt='Chat App Logo'
          />
          <Text fontSize={{ base: "2xl", md: "4xl" }} fontFamily="Times New Roman" fontWeight="bold">
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
        </Box>
        
        <Box bg="white" w="100%" p={4} borderRadius="lg" borderWidth="1px" >
          <Tabs isFitted variant="soft-rounded">
            <TabList mb="1em">
              <Tab>Login</Tab>
              <Tab>Sign Up</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Login />
              </TabPanel>
              <TabPanel>
                <Signup />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Container>
    );
  }
  


export default Homepage;