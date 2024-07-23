
export const INITIAL_STATE = {
    userInfo: {},
  };
  
  export default (state = INITIAL_STATE, { type, payload }) => {
    console.log("REDUCER", type, payload);
    switch (type) {
      case "SET_OBJECT":
        return {
          ...state,
          ...payload,
        };
  
      default:
        return state;
    }
  };
  