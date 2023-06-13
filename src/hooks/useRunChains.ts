import { useChainContext } from "@/lib/promptContext";
import { useState } from "react";

function replaceTopics(originalString: string, topicsArray: string[]) {
  const matches = originalString
    .split(/({{.*?}})/g)
    .filter((x) => x.includes("{"));
  return originalString.replace(/{{.*?}}/g, function (match) {
    if (match === "{{prev_response}}") return match;
    const index = matches.indexOf(match);
    // Replace the match with the corresponding value from the topicsArray
    return topicsArray[index];
  });
}

// Hook function to run the active chain, and all of its prompts
// storing the results in the Execution context
export const useRunChains = (chainId: string) => {
  // need to keep track of running state, progress and results
  // need to keep track of the current chain and prompt
  const { state: chainState, dispatch: chainDispatch } = useChainContext();

  const startChain = async () => {
    chainDispatch({ type: "RUNNING", payload: { running: true } });
    chainDispatch({ type: "CLEAR_RESPONSES", payload: { chainId: chainId } });
    // how many prompts are there?
    const prompts = chainState.chainList.find((c) => c.id === chainId)?.prompts;
    if (!prompts) {
      console.log("ERROR! no prompts to run.");
      return;
    }
    const promptCount = prompts.length;

    // validate that the number of inputs not "" equal the matches
    prompts.forEach((prompt) => {
      const inputs = Object.values(prompt.inputs).filter(
        (input) => input !== ""
      );
      const matches = prompt.prompt
        .split(/({{.*?}})/g)
        .filter((x) => x != "{{prev_response}}");
      if (inputs.length !== matches.length) {
        console.log("ERROR! number of inputs does not match number of matches");
        return;
      }
    });

    // run each prompt in turn
    let current = 0;
    let resultsList: string[] = [];
    while (current < promptCount) {
      // run the prompt
      const prompt = prompts[current];
      const inputs = Object.values(prompt.inputs).filter(
        (input) => input !== ""
      );
      let formattedPrompt = replaceTopics(prompt.prompt, inputs);
      // replace the previous response if it exists
      if (current > 0) {
        const prevResponse = resultsList[current - 1];
        formattedPrompt = formattedPrompt.replace(
          "{{prev_response}}",
          prevResponse
        );
      }
      // console.log("Formatted prompt", formattedPrompt);

      // store the result
      const results = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: formattedPrompt }),
      });

      const jsonResult = await results.json();

      // console.log("Result from\n\t", formattedPrompt, "\nis\n\t", jsonResult.result);
      resultsList.push(jsonResult.result);
      chainDispatch({
        type: "SET_RESPONSE",
        payload: { chainId, promptId: prompt.id, response: jsonResult.result },
      });

      // update the progress
      current += 1;
      chainDispatch({
        type: "PROGRESS",
        payload: { progress: current / promptCount },
      });
    }
    chainDispatch({ type: "RUNNING", payload: { running: false } });
  };
  return startChain;
};
