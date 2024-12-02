import Mensagem from "../modelo/mensagens.js";
export default class MensagemCTRL {
    gravar(req, res) {
        res.type('application/json');
        if (req.method == 'POST' && req.is('application/json')) {
            const dados = req.body;
            const dataHora = new Date();
            const lida = false;
            const usuario = dados.usuario;
            const msg = dados.mensagem
            if (usuario && msg) {
                const mensagem = new Mensagem(0, lida, msg, dataHora, usuario);
                mensagem.incluir().then(() => {
                    res.status(200).json({
                        status: true,
                        id: mensagem.id,
                        mensagem: 'Mensagem incluída com sucesso!'
                    });
                }).catch((erro) => {
                    res.status(400).json({
                        status: false,
                        mensagem: 'Erro ao incluir a mensagem: ' + erro.message
                    });
                });
            } else {
                res.status(400).json({
                    status: false,
                    mensagem: 'Por favor, informe todos os dados da mensagem (usuario, mensagem)!'
                });
            }
        } else {
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
            const lida = dados.lida;
            if (id && typeof(lida) == 'boolean') {
                const mensagem = new Mensagem(id,lida);
                mensagem.alterar().then(() => {
                    res.status(200).json({
                        status: true,
                        mensagem: 'Mensagem atualizada com sucesso!'
                    });
                }).catch((erro) => {
                    res.status(400).json({
                        status: false,
                        mensagem: 'Erro ao atualizar a mensagem: ' + erro.message
                    });
                });
            } 
            else 
            {
                res.status(400).json({
                    status: false,
                    mensagem: 'Por favor, informe todos os dados da mensagem (id, lida)!'
                });
            }
        }
        else
        {
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
            if (id) {
                const mensagem = new Mensagem(id);
                mensagem.excluir().then(() => {
                    res.status(200).json({
                        status: true,
                        mensagem: 'Mensagem excluída com sucesso!'
                    });
                }).catch((erro) => {
                    res.status(400).json({
                        status: false,
                        mensagem: 'Erro ao excluir a mensagem: ' + erro.message
                    });
                });
            } 
            else 
            {
                res.status(400).json({
                    status: false,
                    mensagem: 'Por favor, informe todos os dados da mensagem (id)!'
                });
            }
        }
        else
        {
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
            const mensagem = new Mensagem(0);
            mensagem.consultar(termo).then((mensagens) => {
                res.status(200).json({
                    status: true,
                    listaMensagens: mensagens
                });
            }).catch((erro) => {
                res.status(400).json({
                    status: false,
                    mensagem: 'Erro ao consultar as mensagens: ' + erro.message
                });
            });
        } 
        else 
        {
            res.status(400).json({
                status: false,
                mensagem: 'Requisição inválida!'
            });
        }
    }
}