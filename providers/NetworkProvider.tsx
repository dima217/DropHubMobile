import NetInfo, { NetInfoState } from "@react-native-community/netinfo";
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

interface NetworkContextValue {
  isConnected: boolean;
  isAirplaneMode: boolean;
  networkError: "no_internet" | "airplane_mode" | null;
  refresh: () => Promise<void>;
}

const NetworkContext = createContext<NetworkContextValue | undefined>(
  undefined
);

export const useNetwork = () => {
  const ctx = useContext(NetworkContext);
  if (!ctx) throw new Error("useNetwork must be used within NetworkProvider");
  return ctx;
};

export const NetworkProvider = ({ children }: PropsWithChildren) => {
  const [isConnected, setIsConnected] = useState(true);
  const [isAirplaneMode, setIsAirplaneMode] = useState(false);
  const [networkError, setNetworkError] = useState<
    "no_internet" | "airplane_mode" | null
  >(null);

  const updateState = useCallback((state: NetInfoState) => {
    const connected = !!state.isConnected;
    const airplane = Boolean(
      state.details &&
        "isAirplaneMode" in state.details &&
        state.details.isAirplaneMode
    );

    setIsConnected(connected);
    setIsAirplaneMode(airplane);

    if (!connected || state.isInternetReachable === false) {
      setNetworkError(airplane ? "airplane_mode" : "no_internet");
    } else {
      setNetworkError(null);
    }
  }, []);

  useEffect(() => {
    const unsub = NetInfo.addEventListener(updateState);
    NetInfo.fetch().then(updateState);
    return unsub;
  }, [updateState]);

  const refresh = useCallback(async () => {
    const state = await NetInfo.fetch();
    updateState(state);
  }, [updateState]);

  return (
    <NetworkContext.Provider
      value={{ isConnected, isAirplaneMode, networkError, refresh }}
    >
      {children}
    </NetworkContext.Provider>
  );
};
