const prisma = require("../prisma/client");

//Realizar Login dos Funcionários
async function login(req, res) {
    try {
        const { cpffunc} = req.body;

        const funcionario = await prisma.funcionario.findUnique({
            where: {CpfFunc: cpffunc}
        });

        if (!funcionario) {
            return res.status(401).json({ error: "Funcionário não encontrado / CPF inválido"});
        }

        return res.status(200).json({
            message: "Login realizado com sucesso",
            funcionario
        });
    } catch (error) {
        console.error("Erro ao realizar login", error);
        return res.status(500).json({ error: "Falha ao realizar login"});
    }
}

module.exports = {
    login
};