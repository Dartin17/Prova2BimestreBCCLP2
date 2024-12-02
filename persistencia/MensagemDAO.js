import Mensagem from "../modelo/mensagens.js";
import Usuario from "../modelo/usuario.js";
import conectarBanco, { liberarConexao } from "./conexao.js";
export default class MensagemDAO {

    constructor() {
        this.init();
    }
    async init() {
        try {
            const sql = `CREATE TABLE IF NOT EXISTS mensagens (
                         id INT NOT NULL AUTO_INCREMENT, 
                         dataHora DATETIME,
                         lida BOOLEAN, 
                         mensagem VARCHAR(250), 
                         id_usuario INT NOT NULL,
                         CONSTRAINT PK_MENSAGENS PRIMARY KEY (id),
                         CONSTRAINT FK_MENSAGENS_USUARIOS FOREIGN KEY (id_usuario) REFERENCES usuario(id)
                         )`;
            const conexao = await conectarBanco();
            const resultado = await conexao.execute(sql);
            liberarConexao(conexao);
            console.log("Tabela mensagens iniciada com sucesso!");
        } catch (erro) {
            console.log("Não foi possível iniciar a tabela mensagens: " + erro);
        }
    }
    async gravar(mensagem) {
        if (mensagem instanceof Mensagem) {
            const sql = "INSERT INTO mensagens(dataHora, lida, mensagem, id_usuario) VALUES (STR_TO_DATE(?,'%d/%m/%Y, %H:%i:%s'), ?, ?, ?)";
            const dados = [mensagem.dataHora, mensagem.lida, mensagem.mensagem, mensagem.usuario.id];
            const conexao = await conectarBanco();
            const resultado = await conexao.execute(sql, dados);
            mensagem.id = resultado[0].insertId;
            liberarConexao(conexao);
        }
    }

    async alterar(mensagem) {
        if (mensagem instanceof Mensagem) {
            const sql = "UPDATE mensagens SET lida = ? WHERE id = ? ";
            const dados = [mensagem.lida, mensagem.id];
            const conexao = await conectarBanco();
            await conexao.execute(sql, dados);
            liberarConexao(conexao);
        }
    }

    async excluir(mensagem) {
        if (mensagem instanceof Mensagem) {
            const sql = "DELETE FROM mensagens WHERE id = ?";
            const dados = [mensagem.id];
            const conexao = await conectarBanco();
            await conexao.execute(sql, dados);
            liberarConexao(conexao);
        }
    }

    async consultar(termo) {
        let sql = "";
        let parametros = [];
        if (isNaN(parseInt(termo || ""))) {
            sql = `SELECT u.id, u.usuario, u.urlAvatar, u.dataIngresso,
            m.id as id_mensagem, m.dataHora, m.lida, m.mensagem, m.id_usuario 
            FROM usuario u
            INNER JOIN mensagens m ON u.id = m.id_usuario
            WHERE m.mensagem LIKE ?
            ORDER BY m.dataHora ASC`;
            parametros.push(`%${termo}%`);
        } else {
            sql = sql = `SELECT u.id, u.usuario, u.urlAvatar, u.dataIngresso,
                         m.id as id_mensagem, m.dataHora, m.lida, m.mensagem, m.id_usuario 
            FROM usuario u
            INNER JOIN mensagens m ON u.id = m.id_usuario
            WHERE m.id = ?
            ORDER BY m.dataHora ASC`;;
            parametros.push(termo);
        }

        const conexao = await conectarBanco();
        const [linhas, campos] = await conexao.execute(sql, parametros);
        liberarConexao(conexao);
        let mensagens = [];
        for (const linha of linhas) {
            const usuario = new Usuario(linha.id, linha.usuario, linha.urlAvatar, linha.dataIngresso, []);
            const mensagem = new Mensagem(linha.id_mensagem, linha.lida, linha.mensagem, linha.dataHora, usuario);
            mensagens.push(mensagem);
        }

        return mensagens;
    }
}