import { useState } from 'react'
import {list} from "./assets/assets.js"
import Home from './pages/Home.jsx'
import Contact from "./pages/Contact.jsx"
import About from './pages/About.jsx'
import Login from './pages/Login.jsx'
import {Routes,Route } from "react-router-dom"
import MyListing from './pages/MyListing.jsx'
import MyBooking from './pages/MyBooking.jsx'
import AddList from './pages/AddList.jsx'
import Booking from './pages/Booking.jsx'
import ConfimBooking from './pages/ConfimBooking.jsx'
import { ToastContainer } from 'react-toastify'
import Edit from './pages/Edit.jsx'
import ViewCard from './pages/ViewCard.jsx'
import ForgetPassword from './pages/ForgetPassword.jsx'
import VerifyOtp from './pages/VerifyOtp.jsx'
import ResetPassword from './pages/ResetPassword.jsx'


function App() {
 
  return ( 
  <div className='w-full flex justify-center   '>
  
    <Routes>
       
       <Route path="/" element={<Home />} />
       <Route path="/contact" element={<Contact />} />
       <Route path="/about" element={<About />} />
       <Route path="/my-listing" element={<MyListing />} />
       <Route path='/viewcard' element={<ViewCard />} />
       <Route path="/my-booking" element={<MyBooking />} />
       <Route path="/add-list" element={<AddList />} />
       <Route path="/editlist/:listingid" element={<Edit />} />
       <Route path="/booking/:productId" element={<Booking />} />
       <Route path="/confirm-booking" element={<ConfimBooking/>} />
       <Route path="/login" element={<Login />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
         <Route path="/verify-otp" element={<VerifyOtp />} />
         <Route path="/reset-password" element={<ResetPassword />} />

    </Routes>
    <ToastContainer />
  </div>
  )
}

export default App
