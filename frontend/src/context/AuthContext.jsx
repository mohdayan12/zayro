import React, { createContext } from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import { toast } from 'react-toastify';

export const authDataContext=createContext()
const AuthContext = ({children}) => {

    const backendUrl=import.meta.env.VITE_BACKEND_URL
    const currency='₹'
    const navigate=useNavigate()
    const [userData,setUserData]=useState(null)
    const [allListing,setAllListing]=useState([]);
    const [cardDetails,setCardDetails]=useState(null)
    const [checkIn,setCheckIn]=useState("")
    const [checkOut,setCheckOut]=useState("")
    const [night,setNight]=useState(0)
    const [totalPrice,setTotalPrice]=useState(0)
    const [bookingData,setBookingData]=useState()
    const [otpEmail,setOtpEmail]=useState("")
    const [addListing, setAddListing] =useState(false)
    const [editListing,setEditListing]=useState(false)
    


    const getCurrentUser=async()=>{
      try {
         const response=await axios.get(backendUrl+'/api/user/currentuser',{withCredentials:true})
        
         if(response.data.success){
           setUserData(response.data)
         }
         else{
          setUserData(null)
         }
         
      } catch (error) {
        setUserData(null)
        toast.error(error.message)
        console.log(error)
      }
    }
    const getAllListing=async()=>{
      try {
        const response=await axios.post(backendUrl+'/api/listing/allListing',{},{withCredentials:true})
        console.log(response.data.allListing)
        if(response.data.success){
          setAllListing(response.data.allListing)
        }
        else{
          toast.error(response.data.message)
        }
      } catch (error) {
        console.log(error)
        toast.error(error.message)
      }
    }
    const handleViewCard=async(id)=>{
      try {
        const response=await axios.get(backendUrl +`/api/listing/findlistingByid/${id}`,{withCredentials:true})
        console.log(response)
        if(response.data.success){
          setCardDetails(response.data.listing)
          navigate('/viewcard') 
        }
        else{
          toast.error(response.data.message)
        }
      
      } catch (error) {
        console.log(error)
        toast.error(error.message)
      }
    }
    const handleBooking=async(id)=>{
      console.log(id)
      try {
        const response=await axios.post(backendUrl +`/api/booking/create/${id}`,{checkIn,checkOut,totalRent:totalPrice},{withCredentials:true})
         console.log(response);
         
         if(response.data.success){
          setBookingData(response.data.booking)
          toast.success("Listing is booked")
          navigate("/confirm-Booking")
         }
         else{
          toast.error(response.data.message)
         } 
      } catch (error) {
        console.log(error)
        setBookingData(null)
        toast.error(error.message)
      }
    }
    const cancelBooking=async(id)=>{
       try {
        const response=await axios.delete(backendUrl +`/api/booking/cancel/${id}`,{withCredentials:true})
        console.log(response.data)
        if(response.data.success){
         await getCurrentUser()
         await getAllListing()
         toast.success(response.data.message)
        }
        else{
          toast.error(response.data.message)
        }
        
        
        
       } catch (error) {
          console.log(error)
          toast.error(error.message)
       }
    }
    const handleSearch=async(data)=>{
      if (!data || data.trim() === "") return;
      try {
        const response=await axios.get(backendUrl +`/api/listing/search?query=${data}`)
        if(response.data.success){
            setAllListing(response.data.listing)
        }
        else{
           await getAllListing()
        }
       
      } catch (error) {
        console.log(error)
        toast.error(error.message)
        
      }
    }
    useEffect(()=>{
      if(checkIn && checkOut){
        const inDate=new Date(checkIn)
        const outDate=new Date(checkOut)

        const n=(outDate-inDate)/(24*60*60*1000)
        setNight(n)
        const airBnbCharge=(cardDetails.price*(7/100))
        const tax=(cardDetails.price*(7/100))
        if(n>0){
          setTotalPrice((cardDetails.price*n)+airBnbCharge+tax)
        }
        else{
          setTotalPrice(0)
        }
      }
    },[checkIn,checkOut,totalPrice])

    useEffect(()=>{
      getCurrentUser();
      getAllListing();
    },[addListing,editListing])
  

    const value={
        backendUrl,
        currency,
        navigate,
        userData,
        setUserData,
        getCurrentUser,
        getAllListing,
        allListing,
        setAllListing,
        handleViewCard,setCardDetails,cardDetails,
        checkIn,setCheckIn,
        checkOut,setCheckOut,
        night,setNight,
        totalPrice,setTotalPrice,
        handleBooking,
        cancelBooking,
        bookingData,
        setBookingData,
        handleSearch,
        otpEmail,
        setOtpEmail,
        addListing, setAddListing,
        editListing,setEditListing
        


    }

  return (
    <div>
      <authDataContext.Provider value={value} >
        {children}
      </authDataContext.Provider>
    </div>
  )
}

export default AuthContext
