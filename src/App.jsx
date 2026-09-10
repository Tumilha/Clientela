import { Routes, Route } from "react-router-dom";
import Inicial from "../componentes/inicial/inicial"
import login from "../componentes/login/login"
import admin from "../componentes/admin/admin"
import caixa from "../componentes/caixa/caixa"
import cadastro from "../componentes/cadastro/cadastro"

function App() {
  return (
    <Routes>
      <Route path="/inicial" element={<inicial />} />
      <Route path="/login" element={<login />} />
      <Route path="/admin" element={<admin />} />
      <Route path="/caixa" element={<caixa />} />
      <Route path="/cadastro" element={<cadastro />} />

    </Routes>
  );
}

export default App;