import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from 'styled-components';
import { Routes, Route } from "react-router-dom";
import { theme } from './config/theme';
import LoginLayout from './layout/logIn/LoginLayout';
import { Suspense, Fragment } from 'react';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Provider } from "react-redux";
import { store } from './redux/store';

function App() {
  const accessToken = true;


  return (
    <>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Suspense fallback={<Fragment />}>
            <Routes>{<Route path="/*" element={accessToken ? <LoginLayout /> : <div>Please login</div>} />}</Routes>
          </Suspense>
        </ThemeProvider>
      </Provider>
    </>
  );
}

export default App;
