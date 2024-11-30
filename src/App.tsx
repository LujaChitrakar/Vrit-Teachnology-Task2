import "./App.css";
import Navbar from "./components/common/Navbar";
import KanbanBoard from "./components/KanbanBoard";
import backgroundImage from "./assets/mountain.jpg";

function App() {
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
        <KanbanBoard />
      </div>
    </>
  );
}

export default App;
