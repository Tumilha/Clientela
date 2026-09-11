import { Link } from "react-router-dom";

function Inicial() {
    return (
        <div>
            <div>
                <button><Link to='/login'>Login</Link></button>
                <button><Link to ='/cadastro'>Cadastro</Link></button>
            </div>
            <div>
                
                <button><Link to='/caixa'>Caixa</Link></button>
                <button><Link to='/admin'>Admin</Link></button>
            </div>
                <div></div>
        </div>
    );
}

export default Inicial;