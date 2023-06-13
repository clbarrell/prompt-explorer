import { useChainContext } from "@/lib/promptContext";
import { useState } from "react";

// Hook function to run the active chain, and all of its prompts
// storing the results in the Execution context
export const useRunChains = (chainId: string) => {
  // need to keep track of running state, progress and results
  // need to keep track of the current chain and prompt
  const { state: chainState, dispatch: chainDispatch } = useChainContext();

  // tOdo; check that all inputs of the splits are filled in

  const startChain = () => {
    chainDispatch({ type: "RUNNING", payload: { running: true } });

  };
};
