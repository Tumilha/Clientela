function Inicial() {
    return (
        <div>
            <div>
                <button><Link to='/login'></Link>Login</button>
                <button><Link to ='/cadastro'></Link>Cadastro</button>
            </div>
            <div>
                <button><Link to='/caixa'>Caixa</Link></button>
                <button><Link to='/admin'>Admin</Link></button>
            </div>

        </div>
    );
}

export default Inicial;