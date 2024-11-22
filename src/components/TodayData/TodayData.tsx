import { useState } from "react";
import "./TodayData.css";
import { parkingDetails } from "../Data/parkingdata";

const TodayData = () => {
  const [showData, setShowData] = useState(true);
  const [location, setLocation] = useState("");
  const [filteredData, setFilteredData] = useState(parkingDetails[0][0]); // Initially show today's data (index 0)
  const [viewByDate, setViewByDate] = useState(false);
  const [selectedDay, setSelectedDay] = useState(0); // Store the selected day index
  const [futureDate, setFutureData] = useState(false);
  const [original, setOriginal] = useState(parkingDetails[0][0]);
  const [isToday, setIsToday] = useState(true);
  const [isPast, setIsPast] = useState(false);

  const handleSearch = () => {
    console.log( futureDate);
    
    if(isToday){
      setFilteredData(original.filter(val => val.place == location));
    }
    else if (futureDate){
      if (location === "singanallur"){
        setFilteredData(original.filter((val) => val.name == "Parking A" || val.name == "Parking B" || val.name == "Parking E"));
      }
      else if(location === "sulur"){
        setFilteredData(original.filter((val) => val.name == "Parking C" || val.name == "Parking D"));
      }
      else{
        setFilteredData([]);
      }
    }
  };
  

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = e.target.value;
    const today = new Date();
    const selectedDateObj = new Date(selectedDate);
    console.log(selectedDate);
    console.log(today.getDate);
    console.log(selectedDateObj);
    setIsPast(false);
    if (today === selectedDateObj){
      
      setIsToday(true);
      setFutureData(false);
      setFilteredData(parkingDetails[0][0]);
      setOriginal(parkingDetails[0][0]);
    }
    else{
      console.log("Hi");
      setIsToday(false);
      console.log(isToday);
      
      // Calculate the difference in days between today and the selected date
      const timeDiff = selectedDateObj.getTime() - today.getTime();
      const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)); // Positive for future dates, negative for past dates
    
    
      if (dayDiff >= 0) {
        setFutureData(true);
        // For future dates or today, calculate the week and day within the 4-week data range
        const totalDaysInWeek = parkingDetails[0].length; // Number of days in a week (assuming 7 days per week)
        const totalWeeks = parkingDetails.length; // Total number of weeks
      
        // Calculate the equivalent week index and day within the week
        const futureWeekIndex = Math.floor(dayDiff / totalDaysInWeek); // Get the number of weeks from the day difference
        const futureDayIndex = dayDiff % totalDaysInWeek; // Get the specific day within the week
      
        // Wrap around the week index if necessary (for 4-week range)
        const weekIndex = futureWeekIndex % totalWeeks;
    
        // Get data for the selected week and day
        const weekData = parkingDetails.map((week) => week[futureDayIndex]);
      
        // Calculate the average available space across the 4 weeks for the selected day
        const predictedAvailabilityPercentage = weekData.reduce((acc, week) => {
          // Iterate over each parking space in the week
          week.forEach((item) => {
            const availableSpace = item.capacity - item.filled;
            if (!acc[item.name]) {
              acc[item.name] = { totalAvailability: 0, count: 0, totalCapacity: item.capacity };
            }
            acc[item.name].totalAvailability += availableSpace;
            acc[item.name].count += 1;
          });
          return acc;
        }, {});
        
        // Now, calculate the predicted availability percentage for each parking space
        const predictedData = Object.keys(predictedAvailabilityPercentage).map((parkingSpace) => {
          const { totalAvailability, count, totalCapacity } = predictedAvailabilityPercentage[parkingSpace];
          const averageAvailability = totalAvailability / count; // Calculate the average available space for this parking space
          
          // Calculate the predicted availability percentage for the future
          const predictedPercentage = (averageAvailability / totalCapacity) * 100;
        
          return {
            name: parkingSpace,
            predictedPercentage: predictedPercentage.toFixed(2), // Predicted percentage with 2 decimal places
          };
        });
      
        setSelectedDay(futureDayIndex);
        setOriginal(predictedData); // Update with predicted data for the selected day
        setFilteredData(predictedData);
        setShowData(true);
        console.log(original);
      } else {
        setFilteredData([]);
        setIsPast(true);
      }
    }
    
  };
  
  
  

  const handleCancel = () => {
    setViewByDate(false); // Hide date picker
    setOriginal(parkingDetails[0][0]);
    setFilteredData(parkingDetails[0][0]) // Reset to today's data (0th index)
    setSelectedDay(0); // Reset selected day
    setFutureData(false);
    setIsToday(true);

  };

  return (
    <div className="d-flex flex-column align-items-center" style={{ margin: "50px" }}>
      <div
        id="headSection"
        className="d-flex justify-content-around align-items-center"
        style={{ width: viewByDate ? "1000px" : "800px" }}
      >
        <p id="LocationTag">Location:</p>
        <select
          className="form-select mt-10"
          aria-label="small select example"
          style={{ width: "300px" }}
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        >
          <option value="">Select the Place</option>
          <option value="singanallur">Singanallur</option>
          <option value="sulur">Sulur</option>
        </select>
        <button className="btn btn-primary" onClick={handleSearch}>
          Search
        </button>

        {!viewByDate && (
          <button
            className="btn btn-success"
            onClick={() => setViewByDate(true)}
          >
            View By Date
          </button>
        )}

        {viewByDate && (
          <input
            type="date"
            className="form-select mt-10"
            aria-label="small select example"
            style={{ width: "200px" }}
            onChange={handleDateChange}
          />
        )}

        {viewByDate && (
          <button
            className="btn btn-warning"
            onClick={handleCancel}
          >
            Cancel
          </button>
        )}
      </div>

      {showData && (
        <div className="container text-center">
          <div id="bodySection" className="mt-3 row row-cols-2 g-3">
            {filteredData.length > 0 ? (
              filteredData.map((item, index) => {
                if (!futureDate){
                const availableSpace = item.capacity - item.filled;
                return (
                  <div
                    id="dataContainer"
                    key={index}
                    className={`col p-3 rounded-4 mb-3 ${
                      availableSpace === 0 ? "bg-danger-subtle" : "bg-primary-subtle"
                    }`}
                    style={{ marginRight: "20px" }}
                  >
                    <h2>{item.name}</h2>
                    <p>Available Space: {availableSpace}</p>
                  </div>
                );
              }
                else{
                  return (
                    <div
                      id="dataContainer"
                      key={index}
                      className={`col p-3 rounded-4 mb-3 ${
                        item.predictedPercentage <= 30.5 ? "bg-danger-subtle" : "bg-primary-subtle"
                      }`}
                      style={{ marginRight: "20px" }}
                    >
                      <h2>{item.name}</h2>
                      <p>Possibility of Availability: {item.predictedPercentage}%</p>
                    </div>
                  );
                }
              })
            ) : (
              <div>
                {!isPast && <p className="text-danger">
                  No parking data available for the selected location.
                </p>}

                {isPast && <p className="text-danger">
                  Cannot able to forecast the past Days.
                </p>}
                
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TodayData;
