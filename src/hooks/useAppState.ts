import { useEffect, useState } from "react";
import { AppState, Platform, AppStateStatus } from "react-native";

export default function useAppState() {
  const currentState = AppState.currentState;
  const [appState, setAppState] = useState(currentState);

  function onChange(newState: AppStateStatus) {
    setAppState(newState);
  }

  useEffect(() => {
    const listener = AppState.addEventListener("change", onChange);
    if (Platform.OS === "web") {
      window.onfocus = () => onChange("active");
      window.onblur = () => onChange("background");
    }

    return () => {
      listener.remove();
    };
  });

  return appState;
}
