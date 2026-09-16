import { Link } from "react-router-dom";
import './Inicial.css'

function Inicial() {
    return (
        <div>
            <div className="cima">
                <Link to='/login'>
                    <button className="b1">Login</button>
                </Link>
                <Link to='/cadastro'>
                    <button className="b2">Cadastro</button>
                </Link>
            </div>

            <div className="baixo">  
                <Link to='/caixa'>
                    <button className="b3">Caixa</button>
                </Link>
                <Link to='/admin'>
                    <button className="b4">Admin</button>
                </Link>
            </div>
            <div></div>
        </div>
    );
}

export default Inicial;