import '../lib/primereact'
import { BrowserRouter as Router } from 'react-router-dom';
import { INITIAL_STATE as AUTH_INITIAL_STATE } from '../auth/reducerAuth'
import { INITIAL_STATE as APP_INITIAL_STATE } from "../app/reducer";
import reducer from "../reducer";
import { StateProvider } from '../context';
import { ToastProvider } from '../../../Components/Toast';
const initialState = {
  auth: AUTH_INITIAL_STATE,
  app: APP_INITIAL_STATE,
};

export const AppProvider = ({ children }) => {
  return (
    <StateProvider initialState={initialState} reducer={reducer}>
      <ToastProvider>
        <Router>{children}</Router>
      </ToastProvider>
    </StateProvider>
  );
};