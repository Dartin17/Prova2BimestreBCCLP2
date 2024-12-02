import MensagemDAO from "../persistencia/MensagemDAO.js";

export default class Mensagem{
    #id;
    #dataHora;
    #lida;
    #mensagem;
    #usuario;

    constructor(id, lida=false, mensagem="", dataHora, usuario){
        this.#id = id;
        if (dataHora instanceof Date){
            this.#dataHora = dataHora.toLocaleString("pt-BR");
        } else {
            this.#dataHora = new Date().toLocaleString("pt-BR");	
        }
        this.#lida = lida;
        this.#mensagem = mensagem;
        this.#usuario = usuario;
    }

    get id(){
        return this.#id;
    }

    set id(id){
        this.#id = id;
    }

    get dataHora(){
        return this.#dataHora;
    }

    set dataHora(data){
        this.#dataHora = data;
    }

    get lida(){
        return this.#lida;
    }

    set lida(lida){
        this.#lida = lida;
    }

    get mensagem(){
        return this.#mensagem;
    }

    set mensagem(mensagem){
        this.#mensagem = mensagem;
    }

    get usuario(){
        return this.#usuario;
    }

    set usuario(usuario){
        this.#usuario = usuario;
    }

    toJSON(){
        return {
            id: this.#id,
            dataHora: this.#dataHora.toLocaleString("pt-BR"),
            lida: new Boolean(this.#lida),
            mensagem: this.#mensagem,
            usuario: this.#usuario
        }
    }

    async incluir(){
        const mensagemDAO = new MensagemDAO();
        await mensagemDAO.gravar(this);
    }

    async alterar(){
        const mensagemDAO = new MensagemDAO();
        await mensagemDAO.alterar(this);
    }

    async excluir(){
        const mensagemDAO = new MensagemDAO();
        await mensagemDAO.excluir(this);
    }

    async consultar(termo){
        const mensagemDAO = new MensagemDAO();
        return await mensagemDAO.consultar(termo);
    }
}