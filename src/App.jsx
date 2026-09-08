import { Routes, Route } from "react-router-dom";
import Inicial from "../componentes/inicial/inicial"
import login from "../componentes/login/login"

function App() {
  return (
    <Routes>
      <Route path="/" element={<inicial />} />
    </Routes>
  );
}

export default App;