import { Prompt, useChainContext } from "@/lib/promptContext";
import { useState } from "react";

export const usePromptInput = (prompt: Prompt, chainId: string) => {
  // return a state and setState array to store a dynamic amount of inputs
  const { state, dispatch } = useChainContext();

  const setInputChange = (index: number) => {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      dispatch({
        type: "SET_INPUT",
        payload: { chainId, promptId: prompt.id, input: e.target.value, index },
      });
    };
  };

  const inputValue = (index: number) => {
    try {
      return (
        state.chainList
          .find((c) => c.id === chainId)
          ?.prompts.find((p) => p.id === prompt.id)?.inputs[index] || ""
      );
    } catch (error) {
      return "";
    }
  };

  return { inputValue, setInputChange };
};
