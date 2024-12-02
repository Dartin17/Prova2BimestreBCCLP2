import { Router } from "express";
import UsuarioCTRL from "../controle/usuarioCTRL.js";

const rota = Router();
const usuarioCTRL = new UsuarioCTRL();

rota.get("/", usuarioCTRL.consultar)
.get("/:termo", usuarioCTRL.consultar)
.post("/", usuarioCTRL.gravar)
.put("/", usuarioCTRL.alterar)
.patch("/", usuarioCTRL.alterar)
.delete("/", usuarioCTRL.excluir)
.post('/verificarSenha', usuarioCTRL.verificarSenha);

export default rota;