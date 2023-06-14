import { createContext, useContext, useEffect, useReducer } from "react";
import { useLocalStorage } from "usehooks-ts";

export type Prompt = {
  prompt: string;
  id: string;
  userInput: boolean;
  inputs: { [key: number]: string };
  response: string;
};

export type Chain = {
  id: string;
  name: string;
  active: boolean;
  prompts: Prompt[];
};

type ContextState = {
  editMode: boolean;
  chainList: Chain[];
  running: boolean;
  progress: number;
};

const emptyInputs = {
  // making empty inputs for the new prompt
  0: "",
  1: "",
  2: "",
  3: "",
  4: "",
  5: "",
  6: "",
  7: "",
  8: "",
};

type Action =
  | { type: "SWITCH_MODE" }
  | {
      type: "NEW_CHAIN";
      payload: { id: string; prompt: string; userInput: boolean };
    }
  | {
      type: "UPDATE_CHAIN";
      payload: {
        prompt: { id: string; prompt: string; userInput: boolean };
        chainId: string;
      };
    }
  | { type: "IMPORT"; payload: { chain: Chain } }
  | { type: "ADD_PROMPT"; payload: { chainId: string; userInput: boolean } }
  | { type: "CHANGE_ACTIVE"; payload: { chainId: string } }
  | { type: "LOAD_CHAINS"; payload: { chainList: Chain[] } }
  | { type: "DELETE_PROMPT"; payload: { chainId: string; promptId: string } }
  | { type: "DELETE_CHAIN"; payload: { chainId: string } }
  | { type: "CHANGE_NAME"; payload: { chainId: string; name: string } }
  | { type: "RUNNING"; payload: { running: boolean } }
  | {
      type: "SET_INPUT";
      payload: {
        chainId: string;
        promptId: string;
        index: number;
        input: string;
      };
    }
  | {
      type: "SET_RESPONSE";
      payload: { chainId: string; promptId: string; response: string };
    }
  | { type: "PROGRESS"; payload: { progress: number } }
  | { type: "CLEAR_RESPONSES"; payload: { chainId: string } };

interface ContextProps {
  state: ContextState;
  dispatch: React.Dispatch<Action>;
}

const initialState: ContextState = {
  editMode: true,
  chainList: [
    {
      name: "Chain 1",
      id: "1",
      active: true,
      prompts: [
        {
          prompt: "Tell me some fun facts about\n\n{{topic}}",
          id: "1",
          userInput: false,
          inputs: {},
          response: "",
        },
      ],
    },
  ],
  running: false,
  progress: 0,
};

// reducer function
const reducer = (state: ContextState, action: Action): ContextState => {
  switch (action.type) {
    case "SWITCH_MODE":
      return { ...state, editMode: !state.editMode };
    case "NEW_CHAIN":
      const oldChainList = state.chainList.map((chain) => ({
        ...chain,
        active: false,
      }));
      return {
        ...state,
        editMode: true,
        chainList: [
          ...oldChainList,
          {
            id: Date.now().toString(),
            name: `New chain ${state.chainList.length + 1}`,
            active: true,
            prompts: [
              {
                prompt: "Tell me some fun facts about\n\n{{topic}}",
                id: Date.now().toString(),
                userInput: false,
                inputs: {},
                response: "",
              },
            ],
          },
        ],
      };
    case "UPDATE_CHAIN":
      // find the chain that needs to be updated, find the prompt and then update it
      const newChainList = state.chainList.map((chain) => {
        if (chain.id === action.payload.chainId) {
          return {
            ...chain,
            prompts: chain.prompts.map((prompt) =>
              prompt.id === action.payload.prompt.id
                ? {
                    ...action.payload.prompt,
                    inputs: emptyInputs,
                    response: "",
                  }
                : prompt
            ),
          };
        } else {
          return chain;
        }
      });
      return {
        ...state,
        chainList: newChainList,
      };
    case "IMPORT":
      const mergedChain = {
        ...initialState.chainList[0],
        ...action.payload.chain,
        id: Date.now().toString(),
      };
      const mergedList = [...state.chainList, mergedChain];
      mergedList.forEach((c) => (c.active = false));
      mergedList[mergedList.length - 1].active = true;
      return {
        ...state,
        chainList: mergedList,
      };
    case "ADD_PROMPT":
      const newPrompt = {
        prompt:
          "Add a new prompt here. Refer to previous context: \n{{prev_response}}",
        id: Date.now().toString(),
        userInput: action.payload.userInput,
        inputs: emptyInputs,
        response: "",
      };
      return {
        ...state,
        chainList: state.chainList.map((chain) =>
          chain.id === action.payload.chainId
            ? {
                ...chain,
                prompts: [...chain.prompts, newPrompt],
              }
            : chain
        ),
      };
    case "CHANGE_ACTIVE":
      return {
        ...state,
        chainList: state.chainList.map((chain) =>
          chain.id === action.payload.chainId
            ? {
                ...chain,
                active: true,
              }
            : {
                ...chain,
                active: false,
              }
        ),
      };
    case "LOAD_CHAINS":
      return {
        ...state,
        chainList: [...action.payload.chainList],
      };
    case "DELETE_PROMPT":
      return {
        ...state,
        chainList: state.chainList.map((chain) =>
          chain.id === action.payload.chainId
            ? {
                ...chain,
                prompts: chain.prompts.filter(
                  (prompt) => prompt.id !== action.payload.promptId
                ),
              }
            : chain
        ),
      };
    case "DELETE_CHAIN":
      const filteredChainList = state.chainList.filter(
        (chain) => chain.id !== action.payload.chainId
      );
      filteredChainList[0].active = true;
      return {
        ...state,
        chainList: filteredChainList,
      };
    case "CHANGE_NAME":
      return {
        ...state,
        chainList: state.chainList.map((chain) =>
          chain.id === action.payload.chainId
            ? {
                ...chain,
                name: action.payload.name,
              }
            : chain
        ),
      };
    case "RUNNING":
      return {
        ...state,
        running: action.payload.running,
      };
    case "SET_INPUT":
      return {
        ...state,
        chainList: state.chainList.map((chain) =>
          chain.id === action.payload.chainId
            ? {
                ...chain,
                prompts: chain.prompts.map((prompt) =>
                  prompt.id === action.payload.promptId
                    ? {
                        ...prompt,
                        inputs: {
                          ...prompt.inputs,
                          [action.payload.index]: action.payload.input,
                        },
                      }
                    : prompt
                ),
              }
            : chain
        ),
      };
    case "PROGRESS":
      return {
        ...state,
        progress: action.payload.progress,
      };
    case "CLEAR_RESPONSES":
      return {
        ...state,
        chainList: state.chainList.map((chain) => ({
          ...chain,
          prompts: chain.prompts.map((prompt) => ({
            ...prompt,
            response: "",
          })),
        })),
      };
    case "SET_RESPONSE":
      return {
        ...state,
        chainList: state.chainList.map((chain) =>
          chain.id === action.payload.chainId
            ? {
                ...chain,
                prompts: chain.prompts.map((prompt) =>
                  prompt.id === action.payload.promptId
                    ? {
                        ...prompt,
                        response: action.payload.response,
                      }
                    : prompt
                ),
              }
            : chain
        ),
      };
    default:
      return state;
  }
};

export const ChainContext = createContext<ContextProps>({
  state: initialState,
  dispatch: () => null,
});

export const ChainProvider = ({ children }: { children: JSX.Element }) => {
  const [promptContextState, setPpromptContextState] = useLocalStorage(
    "promptContext",
    initialState
  );
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (JSON.stringify(state) === JSON.stringify(initialState)) {
      dispatch({
        type: "LOAD_CHAINS",
        payload: { chainList: promptContextState.chainList },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // save to local storage
  useEffect(() => {
    if (JSON.stringify(state) != JSON.stringify(initialState)) {
      setPpromptContextState(state);
    }
  }, [setPpromptContextState, state]);

  return (
    <ChainContext.Provider value={{ state, dispatch }}>
      {children}
    </ChainContext.Provider>
  );
};

// usePromptContext()
export const useChainContext = () => {
  const context = useContext(ChainContext);
  if (context === undefined) {
    throw new Error("usePromptContext must be used within a PromptProvider");
  }
  return context;
};
