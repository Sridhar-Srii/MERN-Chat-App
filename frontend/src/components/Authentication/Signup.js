import React, { useState } from "react";
import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack, useToast } from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router";



const Signup = () => {



  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const toast = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [confirmpassword, setConfirmpassword] = useState();
  const [password, setPassword] = useState();
  const [pic, setPic] = useState();
  const [picLoading, setPicLoading] = useState(false);



    const postDetails = (pics) => { 

      setPicLoading(true);
      if (pics === undefined) {
        toast({
          title: 'Please Select an Image!',
          status: 'warning',
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        return
      }
      console.log(pics);

      if(pics.type === "image/jpeg" || pics.type === "image/png" ) {

        const data = new FormData();
        data.append("file", pics);
        data.append("upload_preset","Chat App");
        data.append("cloud_name","dh6rk1s93");
        fetch("https://api.cloudinary.com/v1_1/dh6rk1s93/image/upload", {
          method: "post", 
          body: data,
        }).then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          console.log(data.url.toString());
          setPicLoading(false);
        })
        
        

      }
    };

    const submitHandler = async () => { 

      setPicLoading(true);

      if( !name || !email || !password || !confirmpassword) {
        toast({
          title: 'Please Fill the all the Fields!',
          status: 'warning',
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        setPicLoading(false);
        return;
      }

      if(password !== confirmpassword) {
          toast({
            title: 'Password and Confirmpassword Must be Same!',
            status: 'warning',
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
          return;
        }

      try {

        const config = {
          header: {
            "Content-type" : "application/json",
          },
        };

        const {data} = await axios.post('/api/user',{name,email,password,pic},config);

        toast({
          title: 'Registration Successful!',
          status: 'success',
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });

        localStorage.setItem("userInfo", JSON.stringify(data));
      
        setPicLoading(false);
        navigate('/chats');

      } 
      catch(error) {

        toast({
          title: 'Error Occured!',
          status: 'warning',
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });

        setPicLoading(false);

      }

    };



    return(


        <div>

<VStack spacing="5px">

      <FormControl id="first-name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          placeholder="Enter Your Name"
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>

      <FormControl id="email" isRequired>
        <FormLabel>Email Address</FormLabel>
        <Input
          type="email"
          placeholder="Enter Your Email Address"
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>
      
      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup size="md">
          <Input
            type={show ? "text" : "password"}
            placeholder="Enter Password"
            onChange={(e) => setPassword(e.target.value)}
          />

          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>

        </InputGroup>

      </FormControl>

      <FormControl id="confirmpassword" isRequired>
        <FormLabel>Confirm Password</FormLabel>

        <InputGroup size="md">
          <Input
            type={show ? "text" : "password"}
            placeholder="Confirm password"
            onChange={(e) => setConfirmpassword(e.target.value)}
          />

          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>

        </InputGroup>
      </FormControl>

      <FormControl id="pic">
        <FormLabel>Upload your Picture</FormLabel>
        <Input
          type="file"
          p={1.5}
          accept="image/*"
          onChange={(e) => postDetails(e.target.files[0])}
        />
      </FormControl>

      <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        // isLoading={picLoading}
      >
        Sign Up
      </Button>

    </VStack>



        </div>
    )
}


export default Signup;