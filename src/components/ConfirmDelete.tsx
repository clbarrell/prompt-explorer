import {
  useDisclosure,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Text,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
} from "@chakra-ui/react";
import React from "react";
import { useRef } from "react";

export const ConfirmDelete = ({
  chainName,
  confirmDeleteCallBack,
  isOpen,
  onClose,
}: {
  chainName: string;
  confirmDeleteCallBack: () => void;
  isOpen: boolean;
  onClose: () => void;
}) => {
  // open a modal using ChakraUI's Modal component and ask user to confirm delete
  // if confirmed, delete the chain
  // if not, close the modal

  const cancelRef = React.useRef(null);

  const handleDelete = () => {
    confirmDeleteCallBack();
    onClose();
  };
  return (
    <>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete {chainName}
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? You can{"'"}t undo this action afterwards.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};
