-- CreateTable
CREATE TABLE `Cliente` (
    `CpfCliente` VARCHAR(11) NOT NULL,
    `NomeCLiente` VARCHAR(45) NOT NULL,
    `EmailCliente` VARCHAR(45) NOT NULL,
    `TelefoneCliente` VARCHAR(45) NOT NULL,

    PRIMARY KEY (`CpfCliente`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Produto` (
    `IdProduto` INTEGER NOT NULL AUTO_INCREMENT,
    `NomeProduto` VARCHAR(45) NOT NULL,
    `Preco` DOUBLE NOT NULL,
    `Tipo` VARCHAR(45) NOT NULL,
    `Quantidade` INTEGER NOT NULL,

    PRIMARY KEY (`IdProduto`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Venda` (
    `NotaFiscal` INTEGER NOT NULL AUTO_INCREMENT,
    `Data` DATETIME(3) NOT NULL,
    `ValorTotal` DOUBLE NOT NULL,
    `CpfCliente` VARCHAR(11) NOT NULL,
    `CpfFuncionario` VARCHAR(11) NOT NULL,

    PRIMARY KEY (`NotaFiscal`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Funcionario` (
    `CpfFunc` VARCHAR(11) NOT NULL,
    `NomeFunc` VARCHAR(45) NOT NULL,
    `Cargo` VARCHAR(45) NOT NULL,
    `Salario` DOUBLE NOT NULL,

    PRIMARY KEY (`CpfFunc`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ItemVenda` (
    `IdItem` INTEGER NOT NULL AUTO_INCREMENT,
    `Quantidade` INTEGER NOT NULL,
    `Preco` DOUBLE NOT NULL,
    `NotaFiscal` INTEGER NOT NULL,
    `IdProduto` INTEGER NOT NULL,

    PRIMARY KEY (`IdItem`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Venda` ADD CONSTRAINT `Venda_CpfCliente_fkey` FOREIGN KEY (`CpfCliente`) REFERENCES `Cliente`(`CpfCliente`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Venda` ADD CONSTRAINT `Venda_CpfFuncionario_fkey` FOREIGN KEY (`CpfFuncionario`) REFERENCES `Funcionario`(`CpfFunc`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ItemVenda` ADD CONSTRAINT `ItemVenda_NotaFiscal_fkey` FOREIGN KEY (`NotaFiscal`) REFERENCES `Venda`(`NotaFiscal`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ItemVenda` ADD CONSTRAINT `ItemVenda_IdProduto_fkey` FOREIGN KEY (`IdProduto`) REFERENCES `Produto`(`IdProduto`) ON DELETE RESTRICT ON UPDATE CASCADE;
