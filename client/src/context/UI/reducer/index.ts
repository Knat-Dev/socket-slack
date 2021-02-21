import { UI } from '..';

export type Action =
  | {
      type: 'set_drawer_closed';
    }
  | {
      type: 'set_drawer_open';
    }
  | {
      type: 'set_mobile';
    }
  | {
      type: 'set_desktop';
    };

export const uiReducer = (state: UI, action: Action): UI => {
  switch (action.type) {
    case 'set_drawer_closed':
      return { ...state, isDrawerOpen: false };
    case 'set_drawer_open':
      return { ...state, isDrawerOpen: true };
    case 'set_mobile':
      return {
        ...state,
        isMobile: true,
      };
    case 'set_desktop':
      return {
        ...state,
        isMobile: false,
      };
    default:
      return state;
  }
};
