import { ViewIcon } from "@chakra-ui/icons";
import { Button, IconButton, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, Image, Text } from "@chakra-ui/react";
import React from "react";



const ProfileModal = ({ user, children }) => {

    const { isOpen, onOpen, onClose } = useDisclosure();

    return (

        <div>
            {children ? (
                <span onClick={onOpen}>{children}</span>
            ) : (
                <IconButton
                    display={{ base: "flex" }}
                    icon={<ViewIcon></ViewIcon>}
                    onClick={onOpen}> 
                </IconButton>
            )}
            <Modal isOpen={isOpen} onClose={onClose}>

                <ModalOverlay />
                
                <ModalContent>

                    <ModalHeader 
                    fontSize="40px"
                    fontFamily="Times New Roman" fontWeight="bold"
                    display="flex"
                    justifyContent="center"
                    >{user.name}</ModalHeader>

                    <ModalCloseButton />

                    <ModalBody 
                    display="flex"
                    flexDir="column" 
                    alignItems="center"
                    justifyContent="space-between"
                    >
                        <Image 
                        borderRadius="full"
                        boxSize="150px"
                        src={user.pic}
                        alt={user.name}
                        ></Image>
                        <Text fontSize={{base:"20px", md:"25px"}} fontFamily="Times New Roman" fontWeight="bold">Email : {user.email}</Text>
                    </ModalBody>

                    <ModalFooter>
                        <Button
                         fontFamily="Times New Roman" fontWeight="bold"
                         colorScheme='blue' mr={3} onClick={onClose}>
                            Close
                        </Button>
                    </ModalFooter>

                </ModalContent>
            </Modal>
        </div>
    )
}


export default ProfileModal;