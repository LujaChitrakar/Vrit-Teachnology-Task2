import "./App.css";
import Navbar from "./components/common/Navbar";
import KanbanBoard from "./components/KanbanBoard";
import backgroundImage from "./assets/mountain.jpg";
import { useState } from "react";

function App() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <>
      <div
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "100vh",
        }}
      >
        <Navbar />
        <KanbanBoard
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      </div>
    </>
  );
}

export default App;
