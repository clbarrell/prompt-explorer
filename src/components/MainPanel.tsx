import React, { useContext } from "react";
import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Stack,
  Switch,
  Text,
} from "@chakra-ui/react";
import { useChainContext } from "@/lib/promptContext";
import { PromptComponent } from "./prompt";

const MainPanel = () => {
  const { state, dispatch } = useChainContext();
  const { chainList, editMode } = state;
  const activeChain = chainList.find((chain) => chain.active);

  const handleExport = () => {
    // TODO: Implement export functionality
  };

  const handleEditModeToggle = () => {
    dispatch({ type: "SWITCH_MODE" });
  };

  const handlePromptUpdate = (promptId: string, newPrompt: string) => {
    if (!activeChain) return;
    dispatch({
      type: "UPDATE_CHAIN",
      payload: {
        prompt: { id: promptId, prompt: newPrompt, userInput: false },
        chainId: activeChain.id,
      },
    });
  };

  const handleAddPrompt = () => {
    if (!activeChain) return;
    dispatch({
      type: "ADD_PROMPT",
      payload: { chainId: activeChain.id, userInput: false },
    });
  };

  return (
    <Container py={4}>
      <Flex
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        width="100%"
      >
        <Box mt={3} mb={6}>
          <Heading>{activeChain?.name}</Heading>
        </Box>
        <Flex
          alignItems="center"
          justifyContent="space-between"
          width="100%"
          mb={4}
        >
          <Stack direction="row">
            <Button onClick={handleExport} variant="link">
              Export chain
            </Button>
            <Button onClick={handleExport} variant="link">
              Rename
            </Button>
          </Stack>
          <Box>
            <FormControl display="inline-flex" alignItems="center">
              <FormLabel htmlFor="edit-mode" mb="0">
                Edit mode
              </FormLabel>
              <Switch
                id="edit-mode"
                isChecked={editMode}
                onChange={handleEditModeToggle}
              />
            </FormControl>
          </Box>
        </Flex>
        <Stack
          alignItems="center"
          justifyContent="center"
          spacing={4}
          width="100%"
        >
          {activeChain?.prompts.map((prompt) => (
            <PromptComponent
              key={prompt.id}
              prompt={prompt}
              onPromptUpdate={handlePromptUpdate}
            />
          ))}
          {state.editMode ? (
            <Button onClick={handleAddPrompt} mt={4}>
              Add new prompt
            </Button>
          ) : (
            <Button onClick={handleAddPrompt} mt={4} colorScheme="green">
              Run
            </Button>
          )}
        </Stack>
      </Flex>
    </Container>
  );
};

export default MainPanel;
