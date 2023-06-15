import { useChainContext } from "@/lib/promptContext";
import { Button } from "@chakra-ui/react";
import { FiPlay, FiPlayCircle } from "react-icons/fi";

export const ToggleButton = ({
  label,
  editMode,
}: {
  label: string;
  editMode: boolean;
}) => {
  const { state, dispatch } = useChainContext();
  const active =
    (label === "edit" && editMode) || (label === "run" && !editMode);

  const handleClick = () => {
    if (!active && state.running === false) {
      dispatch({ type: "SWITCH_MODE" });
    }
  };

  return (
    <Button
      onClick={handleClick}
      bg={active ? "gray.200" : "inherit"}
      borderWidth={2}
      leftIcon={label === "run" ? <FiPlayCircle /> : undefined}
      isDisabled={state.running}
    >
      {label} mode
    </Button>
  );
};
