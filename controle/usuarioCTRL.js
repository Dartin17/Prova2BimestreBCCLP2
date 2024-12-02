import Usuario from "../modelo/usuario.js";
export default class UsuarioCTRL {
    gravar(req, res) {
        res.type('application/json');
        if (req.method == 'POST' && req.is('application/json')) {
            const dados = req.body;
            const nickname = dados.nickname;
            const urlAvatar = dados.urlAvatar;
            const dataIngresso = new Date();
            const senha = dados.senha;
            if (nickname && urlAvatar && dataIngresso && senha) {
                const usuario = new Usuario(0, nickname, urlAvatar, dataIngresso, senha);
                usuario.incluir().then(() => {
                    res.status(200).json({
                        status: true,
                        id: usuario.id,
                        mensagem: 'Usuário incluído com sucesso!'
                    });
                })
                    .catch((erro) => {
                        res.status(400).json({
                            status: false,
                            mensagem: 'Erro ao incluir o usuário: ' + erro.message
                        });
                    });
            }
            else {
                res.status(400).json({
                    status: false,
                    mensagem: 'Por favor, informe todos os dados do usuário (nickname, urlAvatar, dataIngresso, senha)!'
                });
            }

        }
        else {
            res.status(400).json({
                status: false,
                mensagem: 'Requisição inválida!'
            });
        }
    }

    alterar(req, res) {
        res.type('application/json');
        if ((req.method == 'PUT' || req.method == 'PATCH') && req.is('application/json')) {
            const dados = req.body;
            const id = dados.id;
            const nickname = dados.nickname;
            const urlAvatar = dados.urlAvatar;
            const dataIngresso = new Date();
            const senha = dados.senha;
            if (id && nickname && urlAvatar && dataIngresso && senha) {
                const usuario = new Usuario(id, nickname, urlAvatar, dataIngresso, senha);
                usuario.alterar().then(() => {
                    res.status(200).json({
                        status: true,
                        mensagem: 'Usuário atualizado com sucesso!'
                    });
                })
                .catch((erro) => {
                        res.status(400).json({
                            status: false,
                            mensagem: "Erro ao atualizar o usuário: " + erro.message
                        });
                });
            }
            else {
                res.status(400).json({
                    status: false,
                    mensagem: 'Por favor, informe todos os dados do usuário (id,nickname, urlAvatar, dataIngresso, senha)!'
                });
            }

        }
        else {
            res.status(400).json({
                status: false,
                mensagem: 'Requisição inválida!'
            });
        }
    }

    excluir(req, res) {
        res.type('application/json');
        if (req.method == 'DELETE' && req.is('application/json')) {
            const dados = req.body;
            const id = dados.id;
            const senha = dados.senha;
            if (id) {
                const usuario = new Usuario(id,'','',null,senha);
                usuario.excluir().then(() => {
                    res.status(200).json({
                        status: true,
                        mensagem: 'Usuário excluído com sucesso!'
                    });
                })
                    .catch((erro) => {
                        res.status(400).json({
                            status: false,
                            mensagem: "Erro ao excluir o usuário: " + erro.message
                        });
                    });
            }
            else {
                res.status(400).json({
                    status: false,
                    mensagem: 'Por favor, informe todos os dados do usuário (id)!'
                });
            }

        }
        else {
            res.status(400).json({
                status: false,
                mensagem: 'Requisição inválida!'
            });
        }
    }

    consultar(req, res) {
        res.type('application/json');
        let termo = req.params.termo;
        if (!termo) {
            termo="";
        }
        if (req.method == 'GET') {
            const usuario = new Usuario(0);
            usuario.consultar(termo).then((usuarios) => {
                res.status(200).json({
                    status: true,
                    listaUsuarios: usuarios
                });
            })
            .catch((erro) => {
                res.status(400).json({
                    status: false,
                    mensagem: "Erro ao consultar os usuários: " + erro.message
                });
            });
        }
        else {
            res.status(400).json({
                status: false,
                mensagem: 'Requisição inválida!'
            });
        }
    }

    verificarSenha(req, res) {
        res.type('application/json');
        if (req.method == 'POST' && req.is('application/json')) {
            const dados = req.body;
            const nickname = dados.nickname;
            const senha = dados.senha;
            if (nickname && senha) {
                const usuario = new Usuario(0,nickname,'',null,senha);
                usuario.verificarSenha().then((retorno) => {
                    res.status(200).json({
                        status: true,
                        senhaCorreta: retorno,
                        mensagem: 'Senha verificada com sucesso!'
                    });
                })
                .catch((erro) => {
                    res.status(400).json({
                        status: false,
                        mensagem: "Erro ao verificar a senha: " + erro.message
                    });
                });
            }
            else {
                res.status(400).json({
                    status: false,
                    mensagem: 'Por favor, informe todos os dados do usuário (nickname, senha)!'
                });
            }

        }
        else {
            res.status(400).json({
                status: false,
                mensagem: 'Requisição inválida!'
            });
        }
    }
}