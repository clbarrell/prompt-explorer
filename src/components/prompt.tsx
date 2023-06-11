import { Box, Button, Input, Stack, Text, Flex } from "@chakra-ui/react";
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

  const deletePrompt = () => {
    dispatch({
      type: "DELETE_PROMPT",
      payload: { chainId, promptId: prompt.id },
    });
  };

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
          value="{{Previous response goes here}}"
          readOnly={true}
        />
      );
    } else if (part[0] === "{") {
      return <Input key={part.slice(0, 10)} placeholder={part} />;
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
      p={4}
      rounded="md"
      color={emptyPrompt ? "gray.400" : "inherit"}
    >
      <Stack py={2} px={4} borderWidth={0}>
        <Text>{emptyPrompt && "Empty prompt"}</Text>
        {parsedParts}
      </Stack>
    </Box>
  );
};
