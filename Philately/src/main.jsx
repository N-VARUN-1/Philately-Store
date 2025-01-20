import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client';
import App from './App'
import './index.css'

import { ThemeProvider } from "@material-tailwind/react";

import * as ReactDOM from "react-dom";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import { store, persistor } from './redux/store.js'
import { Provider } from 'react-redux';

import SignIn from './Pages/signIn';
import AdminSignIn from './Pages/adminSignIn.jsx';
import AdminSignUp from './Pages/adminSignUp.jsx';
import UserSignIn from './Pages/userSignIn.jsx';
import UserSignUp from './Pages/userSignUp.jsx';
import { PersistGate } from 'redux-persist/integration/react';
import persistReducer from 'redux-persist/es/persistReducer';

import BrochuresPage from './Pages/ExplorePage/BrochurePage';
import ThematicPackPage from './Pages/ExplorePage/ThematicpackPage';
import FdcPage from './Pages/ExplorePage/FdcPage';
import MinststampPage from './Pages/ExplorePage/MintstampsPage';
import CollectorspackPage from './Pages/ExplorePage/CollectorsPage';
import CartPage from './Pages/Purchase/CartPage.jsx';
import DeliveryAddressForm from './Pages/Purchase/DeliveryAdd.jsx';
import AllProductPage from './Pages/ExplorePage/AllProductPage.jsx';
import PaymentsPage from './Pages/Purchase/PaymentsPage.jsx';
import OrderHist from './Pages/Purchase/OrderHist.jsx';
import About from './Pages/About.jsx';
import Contact from './Pages/Contact.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/signin",
        element: <SignIn />,
      },
      {
        path: "/admin-signin",
        element: <AdminSignIn />
      },
      {
        path: "/admin-signup",
        element: <AdminSignUp />
      },
      {
        path: "/user-signin",
        element: <UserSignIn />
      },
      {
        path: "/user-signup",
        element: <UserSignUp />
      },
      {
        path: "/explore",
        children: [
          {
            path: "brochures",
            element: <BrochuresPage />
          },
          {
            path: "allProductPage",
            element: <AllProductPage />
          },
          {
            path: "thematic_pack",
            element: <ThematicPackPage />
          },
          {
            path: "fdc",
            element: <FdcPage />
          },
          {
            path: "mint_stamps",
            element: <MinststampPage />
          },
          {
            path: "collectors_pack",
            element: <CollectorspackPage />
          },
        ]
      },
      {
        path: "/purchase",
        children: [
          {
            path: "yourcart",
            element: <CartPage />
          },
          {
            path: "deliveryaddress",
            element: <DeliveryAddressForm />
          },
          {
            path: "paymentsgateway",
            element: <PaymentsPage />
          },
          {
            path: "order_history",
            element: <OrderHist />
          }
        ]
      },
      {
        path: '/aboutPhilatelyStore',
        element: <About />
      },
      {
        path: '/contactPhilatelyStore',
        element: <Contact />
      }
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <PersistGate loading={null} persistor={persistor}>
        <Provider store={store}>
          <RouterProvider router={router}/>
        </Provider>
      </PersistGate>
    </ThemeProvider>
  </StrictMode>,
)





