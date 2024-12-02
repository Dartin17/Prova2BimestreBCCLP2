import Usuario from "../modelo/usuario.js";
import conectarBanco, { liberarConexao } from "../persistencia/conexao.js";
import Mensagem from "../modelo/mensagens.js";

export default class UsuarioDAO {
    
    constructor(){
        this.init();
    }

    async init(){
        try{
            const sql = "CREATE TABLE IF NOT EXISTS usuario (id INT NOT NULL AUTO_INCREMENT, usuario VARCHAR(100) NOT NULL, urlAvatar VARCHAR(250), dataIngresso DATE, senha varchar(50) NOT NULL, PRIMARY KEY (id))";
            const conexao = await conectarBanco();
            const resultado = await conexao.execute(sql);
            liberarConexao(conexao);
            console.log("Tabela usuário iniciada com sucesso!");
        }catch(erro){
            console.log("Não foi possível iniciar a tabela usuário: "+erro);
        }
    }
    async gravar(usuario) {
        if (usuario instanceof Usuario) {
            const sql = "INSERT INTO usuario (usuario, urlAvatar, dataIngresso, senha) VALUES (?, ?, STR_TO_DATE(?, '%d/%m/%Y'), sha1(?))";
            const data = new Date(usuario.dataIngresso);
            const parametros = [usuario.nickname, usuario.urlAvatar, data.toLocaleDateString("pt-BR"), usuario.senha];
            const conexao = await conectarBanco();
            const resultado = await conexao.execute(sql, parametros);
            usuario.id = resultado[0].insertId;
            liberarConexao(conexao);
        }
    }

    async alterar(usuario) {
        if (usuario instanceof Usuario) {
            const sql = "UPDATE usuario SET usuario = ?, urlAvatar = ?, senha = sha1(?) WHERE id = ? and senha = sha1(?)";
            const parametros = [usuario.nickname, usuario.urlAvatar, usuario.senha, usuario.id];
            const conexao = await conectarBanco();
            await conexao.execute(sql, parametros);
            liberarConexao(conexao);
        }
    }

    async excluir(usuario) {
        if (usuario instanceof Usuario) {
            const sql = "DELETE FROM usuario WHERE id = ? and senha = sha1(?)";
            const conexao = await conectarBanco();
            await conexao.execute(sql, [usuario.id, usuario.senha]);
            liberarConexao(conexao);
        }
    }

    async consultar(termo) {
        let sql = "";
        let parametros = [];
        if (isNaN(parseInt(termo || ""))) {
            sql = `SELECT u.id, u.usuario, u.urlAvatar, u.dataIngresso, u.senha,
            m.id as id_mensagem, m.dataHora, m.lida, m.mensagem, m.id_usuario 
            FROM usuario u
            LEFT JOIN mensagens m ON u.id = m.id_usuario
            WHERE u.usuario LIKE ?
            ORDER BY m.dataHora ASC`;
            parametros.push(`%${termo}%`);
        } else {
            sql = sql = `SELECT u.id, u.usuario, u.urlAvatar, u.dataIngresso, u.senha,
                         m.id as id_mensagem, m.dataHora, m.lida, m.mensagem, m.id_usuario 
            FROM usuario u
            LEFT JOIN mensagens m ON u.id = m.id_usuario
            WHERE u.id = ?
            ORDER BY m.dataHora ASC`;;
            parametros.push(termo);
        }

        const conexao = await conectarBanco();
        const [linhas, campos] = await conexao.execute(sql, parametros);
        const registros = linhas.reduce((grupos, item) => {
            const grupo = grupos[item.id] || [];
            grupo.push(item);
            grupos[item.id] = grupo;
            return grupos;
        }, {});

        let usuarios = [];
        for (const [key, registro] of Object.entries(registros)) {
            let mensagens = [];
            for (const linha of registro) {
                if (linha.id_mensagem){
                    const mensagem = new Mensagem(linha.id_mensagem, linha.lida, linha.mensagem, linha.dataHora, {});
                    mensagens.push(mensagem);
                }
            }
            const usuario = new Usuario(registro[0].id, registro[0].usuario, registro[0].urlAvatar, registro[0].dataIngresso, registro[0].senha, mensagens);
            usuarios.push(usuario)
        }
        liberarConexao(conexao);
        return usuarios;
    }

    async verificarSenha(usuario, senha) {
        const sql = "SELECT id FROM usuario WHERE usuario = ? and senha = sha1(?)";
        const conexao = await conectarBanco();
        const [linhas, campos] = await conexao.execute(sql, [usuario, senha]);
        liberarConexao(conexao);
        return linhas.length > 0;
    }
}
