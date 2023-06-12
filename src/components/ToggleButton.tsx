import { useChainContext } from "@/lib/promptContext";
import { Button } from "@chakra-ui/react";

export const ToggleButton = ({
  label,
  editMode,
}: {
  label: string;
  editMode: boolean;
}) => {
  const { dispatch } = useChainContext();
  const active =
    (label === "edit" && editMode) || (label === "run" && !editMode);

  const handleClick = () => {
    if (!active) {
      dispatch({ type: "SWITCH_MODE" });
    }
  };

  return (
    <Button onClick={handleClick} bg={active ? "gray.200" : "inherit"} borderWidth={2}>
      {label} mode
    </Button>
  );
};
