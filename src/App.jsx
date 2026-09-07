import { Routes, Route } from "react-router-dom";
import Inicial from "./Componentes/Inicial/Inicial"

function App() {
  return (
    <Routes>
      <Route path="/" element={<inicial />} />
    </Routes>
  );
}

export default App;