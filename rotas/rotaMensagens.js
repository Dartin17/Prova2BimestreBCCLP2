import { Router } from "express";
import  MensagemCTRL from "../controle/mensagemCTRL.js";

const rota = Router();
const mensagemCTRL = new MensagemCTRL();
rota.get("/", mensagemCTRL.consultar)
.get("/:termo", mensagemCTRL.consultar)
.post("/", mensagemCTRL.gravar)
.put("/", mensagemCTRL.alterar)
.patch("/", mensagemCTRL.alterar)
.delete("/", mensagemCTRL.excluir);

export default rota;

