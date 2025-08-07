import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { assets } from '../assets/assets';
import Title from '../component/Title';
import Card from '../component/Card';
import { authDataContext } from '../context/AuthContext';

const MyListing = () => {
  const { userData, navigate } = useContext(authDataContext);
  const listings = userData?.user?.listing || [];

  return (
    <div className="w-full min-h-screen bg-sky-100 py-10 flex flex-col items-center relative ">
      <div className="w-[90%] max-w-6xl my-10 ">
        {/* Back Button */}
        <div onClick={()=>navigate('/')} className=" absolute px-4 py-2 border border-sky-300 right-2 top-6 text-sky-700 flex justify-center items-center cursor-pointer rounded-full bg-white hover:bg-sky-50 ">
          Go To Home  
        </div>

        {/* Title */}
        <div className="text-3xl mb-8">
          <Title text1="MY" text2="LISTINGS" />
        </div>

        {/* Booking List */}
        {listings.length > 0 ? (
          <div className="flex flex-wrap gap-8 justify-center">
            {listings.reverse().map((item, index) => (
              <Card
                key={index}
                id={item._id}
                title={item.title}
                image1={item.image1}
                image2={item.image2}
                image3={item.image3}
                image4={item.image4}
                price={item.price}
                landmark={item.landmark}
                city={item.city}
                rating={item.rating}
                isBooked={item.isBooked}
                host={item.host}
              />
            ))}
          </div>
        ) : (
          <div className="mt-10 flex justify-center">
             <div className="bg-white shadow-lg rounded-xl px-6 py-8 text-gray-600 text-lg text-center max-w-md w-full">
              You haven’t Added any listings yet.
             </div>
          </div>

        )}
      </div>
    </div>
  );
};

export default MyListing;
