import { Routes, Route } from "react-router-dom";
import Inicial from "../componentes/inicial/Inicial"
import Login from "../componentes/login/Login"
import Admin from "../componentes/admin/Admin"
import Caixa from "../componentes/Caixa/caixa"
import Cadastro from "../componentes/Cadastro/cadastro"

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