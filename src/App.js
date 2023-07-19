import Home from "./components/Home/Home";
import { Route, Routes } from "react-router-dom";
import UserPage from "./components/Home/UserPage";
function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/userpage" element={<UserPage />} />
      </Routes>
    </div>
  );
}

export default App;
