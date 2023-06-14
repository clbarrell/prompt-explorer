import {
  Box,
  Button,
  Divider,
  Stack,
  StackDivider,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useChainContext } from "@/lib/promptContext";
import { ImportModal } from "./ImportModal";
import {
  FiDownload,
  FiFile,
  FiFilePlus,
  FiFolder,
  FiFolderPlus,
  FiPlus,
  FiUpload,
} from "react-icons/fi";

const LeftSideNav = () => {
  const { state, dispatch } = useChainContext();
  const { onOpen, isOpen, onClose } = useDisclosure();

  const handleImport = () => {
    onOpen();
  };

  const handleNewChain = () => {
    dispatch({
      type: "NEW_CHAIN",
      payload: { prompt: "", id: "", userInput: false },
    });
  };

  const handleChainClick = (chainId: string) => {
    dispatch({ type: "CHANGE_ACTIVE", payload: { chainId } });
  };

  return (
    <Box w="20%" minW={"190px"} h="100vh" p={4}>
      <Text fontSize="xl" fontWeight="bold" mb={0}>
        Prompt Explorer
      </Text>
      <Button
        onClick={handleNewChain}
        w="100%"
        mt={6}
        variant="outline"
        colorScheme={"green"}
        justifyContent={"start"}
        leftIcon={<FiFilePlus />}
      >
        New Chain
      </Button>
      <Button
        onClick={handleImport}
        w="100%"
        mt={2}
        mb={3}
        variant="outline"
        colorScheme={"green"}
        justifyContent={"start"}
        leftIcon={<FiUpload />}
      >
        Import
      </Button>
      <Stack spacing={0}>
        {state.chainList.map((chain) => (
          <Button
            key={chain.id}
            variant="ghost"
            // colorScheme={chain.active ? "gray" : "gray"}
            // fontWeight={chain.active ? "bold" : "normal"}
            bg={chain.active ? "gray.100" : "white"}
            rounded="md"
            onClick={() => handleChainClick(chain.id)}
            w="100%"
            textAlign={"left"}
            overflow="hidden"
            whiteSpace={"nowrap"}
            textOverflow="ellipsis"
            display={"inline-block"}
            leftIcon={<FiFile />}
          >
            {chain.name}
          </Button>
        ))}
      </Stack>
      <ImportModal isOpen={isOpen} onClose={onClose} />
    </Box>
  );
};

export default LeftSideNav;
