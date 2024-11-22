import TodayData from "./components/TodayData/TodayData";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css"


const App = () => {
  return (
    <div className="">
      <h1 id="headTag">Parking Space Availability</h1>
      <TodayData />
    </div>
  );
};

export default App;
