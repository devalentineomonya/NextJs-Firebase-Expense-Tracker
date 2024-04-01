import { X } from "lucide-react";
import React, { useState } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

const WeatherMapPopup = ({openFullMap}) => {
  const [loaded, setLoaded] = useState(false);
  const [ visible, setVisible] = useState(true);
  return (
    
    <div className={`bg-[#feffff] rounded-2xl h-[200px] w-[200px] flex flex-col  items-center pt-[10px] relative transition-all ease-in-out duration-300 ${visible ? "" : "hidden"} `}>
      <div className="absolute w-[30px] h-[30px] rounded-full bg-[#101010] 
      text-[#feffff] flex justify-center items-center top-[-5px] left-[-5px]
       cursor-pointer"
       onClick={()=>{setVisible(false)}}>
        <X />
      </div>

      <p className="text-center text-[12px] font-Titillium px-[20px] font-semibold">
        Explore global map of wind, weather and oceans condition
      </p>
      <div className="w-[85%] h-[80px] bg-[#000] overflow-hidden rounded-lg">
        {loaded === false ? (
          <SkeletonTheme
            baseColor="#202020"
            highlightColor="#444"
            enableAnimation={true}
          >
            <Skeleton className="w-full h-full" />
          </SkeletonTheme>
        ) : (
          <img
          className={loaded ? "" : "hidden"} 
          src="https://tile.openweathermap.org/map/clouds_new/1/1/1.png?appid=ea76d6ff36ff18c4cfdb2cb46488379d"
          alt="Cloud"
          onLoad={() => {
            setLoaded(true);
          }}
        />
        )}
      </div>
        <button className="w-[85%] h-[35px] bg-[#cbbbec] text-[#101010] rounded-lg mt-[8px] cursor-pointer " onClick={openFullMap}>Get Started</button>
    </div>
  );
};

export default WeatherMapPopup;
