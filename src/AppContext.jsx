import { createContext, useContext, useReducer } from "react";
import { initialState, reducer } from "./lib/Reducer";
const AppContext = createContext();

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const store = { state, dispatch };
  return <AppContext.Provider value={store}>{children}</AppContext.Provider>;
}

export default function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}
