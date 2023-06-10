import { getBrowserID } from "@/lib/setBrowserID";
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Input,
  List,
  ListItem,
  Stack,
  Text,
  Textarea,
  UnorderedList,
} from "@chakra-ui/react";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import { useLocalStorage } from "usehooks-ts";

type FeedbackResponse = {
  category: string;
  included: string;
  missing: string;
  description: string;
};

export default function Home() {
  const input = useRef<HTMLTextAreaElement>(null);
  const [feedback, setFeedback] = useState("");
  const [submittedFeedback, setSubmittedFeedback] = useState(false);
  const [response, setResponse] = useState<FeedbackResponse | null>(null);
  const [waitingOnResponse, setwaitingOnResponse] = useState(false);

  useEffect(() => {
    if (input.current != null) {
      input.current.focus();
    }
  }, []);

  const handleSubmit = () => {
    // setResponse("");
    if (feedback == "") {
      window.alert("Enter some feedback first please");
    } else {
      setSubmittedFeedback(true);
      onSubmit();
    }
  };

  const handleReset = () => {
    setSubmittedFeedback(false);
    if (input.current != null) {
      input.current.focus();
    }
    setFeedback("");
  };

  async function onSubmit() {
    try {
      setwaitingOnResponse(true);

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ feedback: feedback, user: getBrowserID() }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw (
          data.error ||
          new Error(`Request failed with status ${response.status}`)
        );
      }

      console.log(JSON.parse(data.result));
      setResponse(JSON.parse(data.result));
      setwaitingOnResponse(false);
    } catch (error: any) {
      // Consider implementing your own error handling logic here
      console.error(error);
      setwaitingOnResponse(false);
      alert(error.message);
    }
  }

  const useExample = () => {
    setFeedback(
      "Lead architects want to understand how teams' average build completion time is trending over time"
    );
  };

  return (
    <>
      <Head>
        <title>Is this good product feedback?</title>
        <meta name="description" content="Is this good product feedback?" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Flex
          h={"100vh"}
          justifyContent="center"
          flexDir={"column"}
          width={"full"}
        >
          <Box borderBottomWidth={1}>
            <Container>
              <Flex h={12} alignItems="center">
                Top
              </Flex>
            </Container>
          </Box>
          <Box flexGrow={1}>
            <Container h="full">
              <Stack mt={6} borderLeftWidth={2}>
                <Heading>Title here</Heading>
                <Box>Body</Box>
              </Stack>
            </Container>
          </Box>
          <Box borderTopWidth={1}>
            <Container>
              <Flex alignItems={"center"} h={12}>
                <Text color="gray.400" fontSize={"sm"}>
                  Made by Chris Barrell yo
                </Text>
              </Flex>
            </Container>
          </Box>
        </Flex>
      </main>
    </>
  );
}

const capitalise = (s: string) => s && s[0].toUpperCase() + s.slice(1);
