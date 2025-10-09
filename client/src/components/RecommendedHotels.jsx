import React, { useEffect,useState } from "react";

import HotelCard from "./HotelCard";
import Title from "./Title";
import { useAppContext } from "../context/AppContext";

const RecommendedHotels = () => {
  const { rooms, searchedCities } = useAppContext();
const [Recommended, setRecommended] = useState([])

const filterHotels=()=>{
    const filteredHotels=rooms.slice().filter(room => searchedCities.includes(room.hotel.city));
    setRecommended(filteredHotels);
}

useEffect(()=>{
    filterHotels()
},[rooms,searchedCities])
  return (
    Recommended.length > 0 && (
      <div className="flex flex-col items-center justify-center px-6 md:px-16 lg:px-24 bg-slate-50 py-20">
        <Title
          title={"Recommended Hotels"}
          subTitle={
            "Explore our handpicked selection of top destinations, each offering unique experiences and unforgettable experiences."
          }
          align={"center"}
        />

        <div className="flex flex-wrap items-center justify-center gap-6 mt-20">
          {Recommended.slice(0, 4).map((room, index) => (
            <HotelCard key={room._id} room={room} index={index} />
          ))}
        </div>

        
      </div>
    )
  );
};

export default RecommendedHotels;
