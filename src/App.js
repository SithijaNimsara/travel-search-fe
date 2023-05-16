import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Route, Routes
} from 'react-router-dom';
import './App.css';
import SignIn from './component/SignIn/SignIn';
import SignUp from './component/SignUp/SignUp';
import NormalUser from './component/NormalUser/NormalUser';
import HotelUser from './component/HotelUser/HotelUser';
import ViewHotel from './component/ViewHotel/ViewHotel';
import history from './history';


// const NormalUser = lazy(() => import('./component/NormalUser/NormalUser'))

function App() {
  return (
   
     
    
    <Router history={history}>
      <Routes>
        <Route path="" exact element={<SignIn/>} />
        <Route path="/user-home" element={<NormalUser/>} />
        <Route path="/hotel-home" element={<HotelUser/>} />
        <Route path="/sign-up" element={<SignUp/>} />
        <Route path="/login" element={<SignIn/>} />
        <Route path="/view-hotel/:id" element={<ViewHotel/>} />
        {/* <Route path="/view-hotel/:id"
          render= {() => (
            <ViewHotel
              {...props}
              apiEndpoint=''
            />
          )}
        /> */}
      </Routes>
    </Router>
  
  );
}

export default App;
