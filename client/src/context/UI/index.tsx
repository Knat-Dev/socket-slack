import React, { createContext, useContext, useReducer, useRef } from 'react';
import { Action, uiReducer } from './reducer';

export interface UI {
  isMobile: boolean;
  isDrawerOpen: boolean;
}

const initial: UI = {
  isMobile: false,
  isDrawerOpen: false,
};

export const UIContext = createContext<
  [UI, React.Dispatch<Action>, React.MutableRefObject<HTMLInputElement | null>]
>([initial, () => {}, { current: null }]);
export const useUIContext = () => useContext(UIContext);

export const UIContextProvider: React.FC = (props) => {
  const [state, dispatch] = useReducer(uiReducer, initial);
  const chatInputRef = useRef<HTMLInputElement | null>(null);
  const defaultUIContext: [UI, typeof dispatch, typeof chatInputRef] = [
    state,
    dispatch,
    chatInputRef,
  ];

  return (
    <UIContext.Provider value={defaultUIContext}>
      {props.children}
    </UIContext.Provider>
  );
};
