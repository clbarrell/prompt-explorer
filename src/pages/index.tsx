import { useState } from "react";
import { Box, Button, Flex, Text } from "@chakra-ui/react";
import LeftSideNav from "../components/LeftSideNav";
import MainPanel from "../components/MainPanel";
import { useChainContext } from "@/lib/promptContext";

const IndexPage = () => {
  const { state, dispatch } = useChainContext();

  return (
    <Flex>
      <LeftSideNav />
      <MainPanel />
    </Flex>
  );
};

export default IndexPage;
