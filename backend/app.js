import { Routes, route } from "react-router-dom";
import inicial from "./componentes/inicial/inicial"

function App(){
  return(

    <Routes>
      <Route path="/" element={<inicial />} />
    </Routes>
  )
}