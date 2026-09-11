import { Routes, Route } from "react-router-dom";
import Inicial from "../componentes/Inicial/Inicial"
import Login from "../componentes/Login/Login"
import Admin from "../componentes/Admin/Admin"
import Caixa from "../componentes/Caixa/Caixa"
import Cadastro from "../componentes/Cadastro/Cadastro"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Inicial />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/caixa" element={<Caixa />} />
      <Route path="/cadastro" element={<Cadastro />} />

    </Routes>
  );
}

export default App;