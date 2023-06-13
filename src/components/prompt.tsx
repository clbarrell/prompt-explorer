import { usePromptInput } from "@/hooks/usePromptInput";
import {
  Box,
  Button,
  Input,
  Stack,
  Text,
  Flex,
  GridItem,
  Grid,
} from "@chakra-ui/react";
import { useState } from "react";
import { HighlightWithinTextarea } from "react-highlight-within-textarea";
// https://bonafideduck.github.io/react-highlight-within-textarea/
import { Prompt, useChainContext } from "../lib/promptContext";

export const PromptComponent = ({
  prompt,
  onPromptUpdate,
  chainId,
}: {
  prompt: Prompt;
  onPromptUpdate: (promptId: string, newPrompt: string) => void;
  chainId: string;
}) => {
  const { state, dispatch } = useChainContext();
  const onChange = (value: string) => onPromptUpdate(prompt.id, value);
  const emptyPrompt = prompt.prompt === "";
  const { inputValue, setInputChange } = usePromptInput(prompt, chainId);

  const deletePrompt = () => {
    dispatch({
      type: "DELETE_PROMPT",
      payload: { chainId, promptId: prompt.id },
    });
  };

  const noVariables = prompt.prompt.match(/({{.*?}})/g) === null;

  if (state.editMode) {
    return (
      <Box bg="gray.50" p={4} rounded="md" width={"100%"}>
        <Box borderWidth={1} rounded="md" py={3} px={4} pos="relative">
          <HighlightWithinTextarea
            value={prompt.prompt}
            highlight={/({{.*?}})/g}
            onChange={onChange}
          />
          <Button
            size="xs"
            pos={"absolute"}
            right={1}
            top={1}
            onClick={deletePrompt}
          >
            delete
          </Button>
        </Box>
        {noVariables && (
          <Text fontSize={"sm"} color="gray.500">
            Tip: you can use {`{{`}variables{`}}`} in your prompt for input when
            running. {`{{`}prev_response{`}}`} is response from prior prompt.
          </Text>
        )}
      </Box>
    );
  }

  // RUN MODE
  // split prompt into parts and parse for {{}}
  // if {{}} is found, replace with input box
  // if not, just display the text
  const parts = prompt.prompt.split(/({{.*?}})/g);
  const parsedParts = parts.map((part, i) => {
    if (part === "{{prev_response}}") {
      return (
        <Input
          key={`${part.slice(0, 10)}-${i}`}
          value="{{Previous response here}}"
          readOnly={true}
          borderColor="gray.400"
          color="gray.600"
        />
      );
    } else if (part[0] === "{") {
      return (
        <Input
          key={`${part.slice(0, 10)}-${i}`}
          placeholder={part}
          value={inputValue(i)}
          onChange={setInputChange(i)}
          isInvalid={inputValue(i) === ""}
        />
      );
    } else {
      return (
        <Text key={part.slice(0, 10)} whiteSpace="pre-wrap">
          {part}
        </Text>
      );
    }
  });

  return (
    <Box
      width={"100%"}
      bg="gray.50"
      py={6}
      px={6}
      rounded="md"
      color={emptyPrompt ? "gray.400" : "inherit"}
    >
      <Grid templateColumns="repeat(3, 1fr)" gap={6}>
        <GridItem colSpan={{ sm: 3, md: 1 }}>
          <Stack borderWidth={0}>
            {emptyPrompt && <Text>Empty prompt</Text>}
            {parsedParts}
          </Stack>
        </GridItem>
        <GridItem
          colSpan={{ sm: 3, md: 2 }}
          borderLeftWidth={{ sm: 0, md: 1 }}
          borderLeftColor={"gray.300"}
          pl={{ sm: 0, md: 4 }}
        >
          <Text fontSize="sm" color="gray.500" letterSpacing={"wide"}>
            Press start to begin
          </Text>
        </GridItem>
      </Grid>
    </Box>
  );
};
