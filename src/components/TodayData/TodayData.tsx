import { useState } from "react";
import "./TodayData.css";
import { parkingDetails } from "../Data/parkingdata";

interface ParkingDetail {
  name: string;
  capacity: number;
  filled: number;
  place: string;
}

interface PredictedData {
  name: string;
  predictedPercentage: string;
  place: string;
}

type ParkingData = ParkingDetail | PredictedData;

const TodayData = () => {
  const [showData, setShowData] = useState(true);
  const [location, setLocation] = useState("");
  const [filteredData, setFilteredData] = useState<ParkingData[]>(parkingDetails[0][0]);
  const [viewByDate, setViewByDate] = useState(false);
  const [futureDate, setFutureData] = useState(false);
  const [original, setOriginal] = useState<ParkingData[]>(parkingDetails[0][0]);
  const [isToday, setIsToday] = useState(true);
  const [isPast, setIsPast] = useState(false);

  const handleSearch = () => {
    console.log(location);
    if (isToday) {
      setFilteredData(
        original.filter((val) => val.place === location)
      );
    } else if (futureDate) {
      if (location === "singanallur") {
        setFilteredData(
          original.filter(
            (val) => val.name === "Parking A" || val.name === "Parking B" || val.name === "Parking E"
          )
        );
      } else if (location === "sulur") {
        setFilteredData(
          original.filter((val) => val.name === "Parking C" || val.name === "Parking D")
        );
      } else {
        setFilteredData([]);
      }
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = e.target.value;
    const today = new Date();
    const selectedDateObj = new Date(selectedDate);

    setIsPast(false);
    if (today.toDateString() === selectedDateObj.toDateString()) {
      setIsToday(true);
      setFutureData(false);
      setFilteredData(parkingDetails[0][0]);
      setOriginal(parkingDetails[0][0]);
    } else {
      setIsToday(false);
      const timeDiff = selectedDateObj.getTime() - today.getTime();
      const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

      if (dayDiff >= 0) {
        setFutureData(true);
        const totalDaysInWeek = parkingDetails[0].length;
        const futureDayIndex = dayDiff % totalDaysInWeek;
        const weekData = parkingDetails.map((week) => week[futureDayIndex]);

        const predictedAvailabilityPercentage = weekData.reduce<Record<string, any>>((acc, week) => {
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

        const predictedData = Object.keys(predictedAvailabilityPercentage).map((parkingSpace) => {
          const { totalAvailability, count, totalCapacity } = predictedAvailabilityPercentage[parkingSpace];
          const averageAvailability = totalAvailability / count;
          const predictedPercentage = (averageAvailability / totalCapacity) * 100;

          return {
            name: parkingSpace,
            predictedPercentage: predictedPercentage.toFixed(2),
            place: "null",
          };
        });

        setOriginal(predictedData);
        setFilteredData(predictedData);
        setShowData(true);
      } else {
        setFilteredData([]);
        setIsPast(true);
      }
    }
  };

  const handleCancel = () => {
    setViewByDate(false);
    setOriginal(parkingDetails[0][0]);
    setFilteredData(parkingDetails[0][0]);
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
                if (!futureDate) {
                  const availableSpace = (item as ParkingDetail).capacity - (item as ParkingDetail).filled;
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
                } else {
                  return (
                    <div
                      id="dataContainer"
                      key={index}
                      className={`col p-3 rounded-4 mb-3 ${
                        parseFloat((item as PredictedData).predictedPercentage) <= 30.5
                          ? "bg-danger-subtle"
                          : "bg-primary-subtle"
                      }`}
                      style={{ marginRight: "20px" }}
                    >
                      <h2>{item.name}</h2>
                      <p>Possibility of Availability: {(item as PredictedData).predictedPercentage}%</p>
                    </div>
                  );
                }
              })
            ) : (
              <div>
                {!isPast && (
                  <p className="text-danger">No parking data available for the selected location.</p>
                )}
                {isPast && <p className="text-danger">Cannot forecast past days.</p>}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TodayData;
  