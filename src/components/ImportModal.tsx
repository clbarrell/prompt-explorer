import { Chain, Prompt, useChainContext } from "@/lib/promptContext";
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
  Box,
  Textarea,
  Input,
  useClipboard,
  useToast,
} from "@chakra-ui/react";
import { use, useEffect, useRef, useState } from "react";
import { FiDownload, FiUpload } from "react-icons/fi";

export function ImportModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const toast = useToast();
  const [importData, setImportData] = useState("");
  const [importError, setImportError] = useState(false);
  const { dispatch } = useChainContext();
  const inputRef = useRef(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setImportData(e.target.value);
  };

  // Check that JSON is valid
  useEffect(() => {
    if (importData != "") {
      try {
        const data = JSON.parse(importData);
        setImportError(false);
      } catch (error) {
        console.log("Error importing json!");
        setImportError(true);
      }
    } else {
      setImportError(false);
    }
  }, [importData, setImportError]);

  const handleImport = () => {
    onClose();
    toast({
      title: "Chain imported",
      status: "success",
      isClosable: true,
    });
    setImportData("");
    dispatch({ type: "IMPORT", payload: { chain: JSON.parse(importData) } });
  };
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      initialFocusRef={inputRef}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Import chain</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text mb={3}>Someone shared something tasty? Paste below.</Text>
          <Textarea
            rows={7}
            value={importData}
            onChange={handleChange}
            isInvalid={importError}
            errorBorderColor="red.300"
            focusBorderColor={importError ? "red.300" : "gray.300"}
            ref={inputRef}
          />
          {importError && (
            <Text mt={2} color="red.400">
              Error, that {"doesn't"} look like proper JSON! Try again
            </Text>
          )}
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme="green"
            mr={3}
            onClick={handleImport}
            leftIcon={<FiUpload />}
          >
            Import
          </Button>
          <Button variant="ghost">Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
