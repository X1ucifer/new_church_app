import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux'; // Import Provider
import { QueryClient, QueryClientProvider } from 'react-query'; // Import QueryClient
import { store } from './redux/store'; // Import your Redux store
import { ToastContainer } from 'react-toastify';
import 'react-loading-skeleton/dist/skeleton.css';
import 'react-toastify/dist/ReactToastify.css';
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';
import 'rc-time-picker/assets/index.css';

const queryClient = new QueryClient(); 

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <ToastContainer />
      <App />
    </QueryClientProvider>
  </Provider>
);

reportWebVitals();
