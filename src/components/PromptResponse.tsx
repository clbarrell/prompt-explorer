import { useChainContext } from "@/lib/promptContext";
import {
  Box,
  Button,
  Input,
  Stack,
  Text,
  Flex,
  GridItem,
  Grid,
  SkeletonText,
} from "@chakra-ui/react";

export const PromptResponse = ({
  promptId,
  chainId,
}: {
  promptId: string;
  chainId: string;
}) => {
  const { state } = useChainContext();
  const prompt = state.chainList
    .find((chain) => chain.id === chainId)
    ?.prompts.find((prompt) => prompt.id === promptId);
  if (!prompt) return <Box />;
  const isResponse = prompt.response != "";

  if (!state.running && !isResponse) {
    return (
      <Text fontSize="sm" color="gray.500" letterSpacing={"wide"}>
        Press start to begin
      </Text>
    );
  }

  return (
    <SkeletonText
      isLoaded={isResponse}
      noOfLines={4}
      spacing="4"
      skeletonHeight="2"
    >
      <Text fontSize={"sm"} color="gray.500">Response</Text>
      <Text whiteSpace={"pre-line"}>{prompt.response}</Text>
    </SkeletonText>
  );
};
