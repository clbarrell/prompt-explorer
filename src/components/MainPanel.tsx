import React, { useContext } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Stack,
  Switch,
  Text,
} from "@chakra-ui/react";
import { useChainContext } from "@/lib/promptContext";
import { PromptComponent } from "./prompt";
import { SelectButtonGroup } from "./SelectButtonGroup";

const ToggleButton = ({
  label,
  editMode,
}: {
  label: string;
  editMode: boolean;
}) => {
  const { dispatch } = useChainContext();
  const active =
    (label === "edit" && editMode) || (label === "run" && !editMode);

  const handleClick = () => {
    if (!active) {
      dispatch({ type: "SWITCH_MODE" });
    }
  };

  return <Button onClick={handleClick} bg={active ? 'gray.200' : 'inherit'}>{label} mode</Button>;
};

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
          </Stack>
          <HStack direction="row">
            {!state.editMode && <Button colorScheme={"green"} size="sm">Start</Button>}
            <ButtonGroup isAttached variant="outline" size="sm">
              <ToggleButton label="edit" editMode={state.editMode} />
              <ToggleButton label="run" editMode={state.editMode} />
            </ButtonGroup>
          </HStack>
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
              chainId={activeChain.id}
            />
          ))}
          {state.editMode && (
            <Button onClick={handleAddPrompt} mt={4}>
              Add new prompt
            </Button>
          )}
        </Stack>
      </Flex>
    </Container>
  );
};

export default MainPanel;
