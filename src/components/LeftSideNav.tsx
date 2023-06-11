import { Box, Button, Stack, Text } from "@chakra-ui/react";
import { useChainContext } from "@/lib/promptContext";

const LeftSideNav = () => {
  const { state, dispatch } = useChainContext();

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
      <Text fontSize="xl" fontWeight="bold" mb={4}>
        Prompt Explorer
      </Text>
      <Stack>
        {state.chainList.map((chain) => (
          <Button
            key={chain.id}
            variant="ghost"
            colorScheme={chain.active ? "blue" : "gray"}
            fontWeight={chain.active ? "bold" : "normal"}
            rounded="none"
            onClick={() => handleChainClick(chain.id)}
            w="100%"
          >
            {chain.name}
          </Button>
        ))}
      </Stack>
      <Button
        onClick={handleNewChain}
        w="100%"
        mt={8}
        variant="solid"
        colorScheme={"green"}
      >
        New Chain
      </Button>
    </Box>
  );
};

export default LeftSideNav;
