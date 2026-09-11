import { Routes, Route } from "react-router-dom";
import Inicial from "../componentes/Inicial/inicial"
import Login from "../componentes/Login/login"
import Admin from "../componentes/admin/Admin"
import Caixa from "../componentes/Caixa/caixa"
import Cadastro from "../componentes/Cadastro/cadastro"

function App() {
  return (
    <Routes>
      <Route path="/" element={<inicial />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/caixa" element={<Caixa />} />
      <Route path="/cadastro" element={<Cadastro />} />

    </Routes>
  );
}

export default App;