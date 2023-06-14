import { Chain, Prompt } from "@/lib/promptContext";
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
import { FiCopy } from "react-icons/fi";

export function ExportModal({
  chain,
  isOpen,
  onClose,
}: {
  chain: Chain;
  isOpen: boolean;
  onClose: () => void;
}) {
  const { onCopy, value, setValue, hasCopied } = useClipboard(
    JSON.stringify(chain)
  );
  const toast = useToast();

  const handleCopy = () => {
    onCopy();
    onClose();
    toast({
      title: "Chain copied",
      description: "You're ready to share!",
      status: "success",
      isClosable: true,
    });
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Export {chain.name}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Textarea
            fontSize={"sm"}
            bg="gray.800"
            color="whiteAlpha.800"
            readOnly
            rows={7}
          >
            {JSON.stringify(chain)}
          </Textarea>
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme="green"
            mr={3}
            onClick={handleCopy}
            leftIcon={<FiCopy />}
          >
            Copy
          </Button>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
