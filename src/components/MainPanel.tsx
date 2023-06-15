import React, { useContext } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Container,
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  IconButton,
  Skeleton,
  Stack,
  Switch,
  Text,
  Tooltip,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { useChainContext } from "@/lib/promptContext";
import { PromptComponent } from "./prompt";
import { SelectButtonGroup } from "./SelectButtonGroup";
import { ToggleButton } from "./ToggleButton";
import { ConfirmDelete } from "./ConfirmDelete";
import { useRunChains } from "@/hooks/useRunChains";
import { ExportModal } from "./export";
import {
  FiDelete,
  FiDownload,
  FiPlay,
  FiPlayCircle,
  FiPlus,
  FiTrash,
  FiTrash2,
} from "react-icons/fi";

const MainPanel = () => {
  const { state, dispatch } = useChainContext();
  const { chainList, editMode } = state;
  const activeChain = chainList.find((chain) => chain.active);
  const { isOpen, onClose, onOpen } = useDisclosure();
  const startChain = useRunChains(activeChain?.id || "");

  const {
    isOpen: exportOpen,
    onClose: onExportClose,
    onOpen: onExportOpen,
  } = useDisclosure();
  const handleExport = () => {
    onExportOpen();
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

  const handleNameChange = (name: string) => {
    if (!activeChain) return;
    dispatch({
      type: "CHANGE_NAME",
      payload: { chainId: activeChain?.id, name: name },
    });
  };

  const handleDelete = () => {
    if (!activeChain) return;
    dispatch({ type: "DELETE_CHAIN", payload: { chainId: activeChain?.id } });
  };

  if (!activeChain) return <Skeleton height="100vh" width="100%" />;

  return (
    <Container maxW={"container.lg"} py={4}>
      <Flex
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        width="100%"
      >
        <Box mt={3} mb={6}>
          <Editable
            value={activeChain?.name}
            isPreviewFocusable={true}
            selectAllOnFocus={false}
            fontSize="2xl"
            fontWeight={"bold"}
            onChange={handleNameChange}
          >
            <Tooltip label="Click to edit" shouldWrapChildren={true}>
              <EditablePreview
                py={2}
                px={4}
                _hover={{
                  background: "gray.100",
                }}
              />
            </Tooltip>
            <EditableInput textAlign={"center"} />
          </Editable>
        </Box>
        <Flex
          alignItems="center"
          justifyContent="space-between"
          width="100%"
          mb={4}
        >
          <HStack direction="row">
            <ButtonGroup isAttached variant="outline" size="sm">
              <ToggleButton label="edit" editMode={state.editMode} />
              <ToggleButton label="run" editMode={state.editMode} />
            </ButtonGroup>
            {!state.editMode && (
              <Button
                colorScheme={"green"}
                size="sm"
                onClick={startChain}
                isLoading={state.running}
                loadingText="Running"
                leftIcon={<FiPlayCircle />}
              >
                Start
              </Button>
            )}
          </HStack>
          <Stack direction="row">
            <IconButton
              aria-label={"Download"}
              onClick={handleExport}
              icon={<FiDownload />}
              title="Download"
              variant={"ghost"}
            />
            <IconButton
              aria-label={"Delete"}
              icon={<FiTrash />}
              title="delete"
              onClick={onOpen}
              variant={"ghost"}
            />
          </Stack>
        </Flex>
        <Stack
          alignItems="center"
          justifyContent="center"
          spacing={4}
          width="100%"
        >
          <Box width={"full"}>
            {state.editMode ? (
              <Text color="gray.600">
                Edit your prompts below then use {"'Run mode'"}
              </Text>
            ) : (
              <Text color="gray.600">
                Fill out the input boxes below and press the start button to run
                your prompts
              </Text>
            )}
          </Box>
          {activeChain?.prompts.map((prompt) => (
            <PromptComponent
              key={prompt.id}
              prompt={prompt}
              onPromptUpdate={handlePromptUpdate}
              chainId={activeChain.id}
            />
          ))}
          {state.editMode && (
            <Button onClick={handleAddPrompt} mt={4} leftIcon={<FiPlus />}>
              Add new prompt
            </Button>
          )}
        </Stack>
      </Flex>
      <ConfirmDelete
        chainName={activeChain?.name}
        confirmDeleteCallBack={handleDelete}
        isOpen={isOpen}
        onClose={onClose}
      />
      <ExportModal
        chain={activeChain}
        isOpen={exportOpen}
        onClose={onExportClose}
      />
    </Container>
  );
};

export default MainPanel;
