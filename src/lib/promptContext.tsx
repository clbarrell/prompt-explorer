import { createContext, useContext, useEffect, useReducer } from "react";
import { useLocalStorage } from "usehooks-ts";

export type Prompt = {
  prompt: string;
  id: string;
  userInput: boolean;
};

export type Chain = {
  id: string;
  name: string;
  active: boolean;
  prompts: Prompt[];
};

export type ContextState = {
  editMode: boolean;
  chainList: Chain[];
};

type Action =
  | { type: "SWITCH_MODE" }
  | { type: "NEW_CHAIN"; payload: Prompt }
  | { type: "UPDATE_CHAIN"; payload: { prompt: Prompt; chainId: string } }
  | { type: "IMPORT"; payload: { chainList: Chain[] } }
  | { type: "ADD_PROMPT"; payload: { chainId: string; userInput: boolean } }
  | { type: "CHANGE_ACTIVE"; payload: { chainId: string } }
  | { type: "LOAD_CHAINS"; payload: { chainList: Chain[] } };

interface ContextProps {
  state: ContextState;
  dispatch: React.Dispatch<Action>;
}

const initialState: ContextState = {
  editMode: false,
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
        },
      ],
    },
  ],
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
                ? action.payload.prompt
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
      return {
        ...state,
        chainList: [...state.chainList, ...action.payload.chainList],
      };
    case "ADD_PROMPT":
      const newPrompt = {
        prompt:
          "Add a new prompt here. Refer to previous context: \n{{prev_response}}",
        id: Date.now().toString(),
        userInput: action.payload.userInput,
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
    setPpromptContextState(state);
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
