import { Box, Input, Stack, Text, Textarea } from "@chakra-ui/react";
import { useState } from "react";
import { HighlightWithinTextarea } from "react-highlight-within-textarea";
// https://bonafideduck.github.io/react-highlight-within-textarea/
import { Prompt, useChainContext } from "../lib/promptContext";

export const PromptComponent = ({
  prompt,
  onPromptUpdate,
}: {
  prompt: Prompt;
  onPromptUpdate: (promptId: string, newPrompt: string) => void;
}) => {
  const { state, dispatch } = useChainContext();
  const onChange = (value: string) => onPromptUpdate(prompt.id, value);
  const [input, setInput] = useState("sdf");
  const emptyPrompt = prompt.prompt === "";

  if (state.editMode) {
    return (
      <Box bg="gray.50" p={6} rounded="md" width={"100%"}>
        <Box borderWidth={1} rounded="md" p={2}>
          <HighlightWithinTextarea
            value={prompt.prompt}
            highlight={/({{.*?}})/g}
            onChange={onChange}
          />
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
      return <Text key={part.slice(0, 10)}>{part}</Text>;
    }
  });

  return (
    <Box
      width={"100%"}
      bg="gray.50"
      p={6}
      rounded="md"
      color={emptyPrompt ? "gray.400" : "inherit"}
    >
      <Stack>
        <Text>{emptyPrompt && "Empty prompt"}</Text>
        {parsedParts}
      </Stack>
    </Box>
  );
};
