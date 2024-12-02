import UsuarioDAO from "../persistencia/UsuarioDAO.js";

export default class Usuario{
    #id;
    #nickname;
    #urlAvatar;
    #dataIngresso;
    #senha;
    #mensagens = [];

    constructor(id, nickname, urlAvatar, dataIngresso, senha, mensagens=[]){
        this.#id = id;
        this.#nickname = nickname;
        this.#urlAvatar = urlAvatar;
        this.#dataIngresso = dataIngresso;
        this.#senha = senha;
        this.#mensagens = mensagens;
    }

    get id(){
        return this.#id;
    }

    set id(id){
        this.#id = id;
    }

    get nickname(){
        return this.#nickname;
    }

    set nickname(nickname){
        this.#nickname = nickname;
    }

    get urlAvatar(){
        return this.#urlAvatar;
    }

    set urlAvatar(urlAvatar){
        this.#urlAvatar = urlAvatar;
    }

    get dataIngresso(){
        return this.#dataIngresso;
    }

    set dataIngresso(dataIngresso){
        this.#dataIngresso = dataIngresso;
    }

    get senha(){
        return this.#senha;
    }

    set senha(senha){
        this.#senha = senha;
    }

    get mensagens(){
        return this.#mensagens;
    }

    set mensagens(mensagens){
        this.#mensagens = mensagens;
    }

    adicionarMensagem(mensagem){
        this.#mensagens.push(mensagem);
    }

    toJSON(){
        return {
            id: this.#id,
            nickname: this.#nickname,
            urlAvatar: this.#urlAvatar,
            dataIngresso: this.#dataIngresso.toLocaleDateString("pt-BR"),
            mensagens: this.#mensagens
        }
    }

    async incluir(){
        const usuarioDAO = new UsuarioDAO();
        await usuarioDAO.gravar(this);
    }

    async alterar(){
        const usuarioDAO = new UsuarioDAO();
        await usuarioDAO.alterar(this);
    }

    async excluir(){
        const usuarioDAO = new UsuarioDAO();
        await usuarioDAO.excluir(this);
    }

    async consultar(termo){
        const usuarioDAO = new UsuarioDAO();
        return await usuarioDAO.consultar(termo);
    }

    async verificarSenha(){
        const usuarioDAO = new UsuarioDAO();
        return await usuarioDAO.verificarSenha(this.nickname, this.senha);
    }
}