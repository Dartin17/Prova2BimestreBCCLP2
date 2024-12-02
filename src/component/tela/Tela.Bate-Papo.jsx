import React, { useEffect, useState } from 'react';
import { Form, Button, ListGroup, Image, Alert } from 'react-bootstrap';
import Pagina from "../layouts/Pagina";
import { useDispatch, useSelector } from 'react-redux';
import ESTADO from '../../redux/redux.estado';
import { consultarUsuarios } from '../../redux/redux.usuario';
import { consultarChats, deletarChat, gravarChat, zerarMensagem } from '../../redux/redux.chat';
import { parse, differenceInMinutes } from 'date-fns';
import { logout } from '../../redux/redux.usuario'; // Importando a ação de logout
import { useNavigate } from 'react-router-dom'; // Importando useNavigate

export default function TelaBatePapo() {
    let { listaUsuarios } = useSelector((state) => state.usuarios);
    let { estado, mensagem, listaChats } = useSelector((state) => state.chats);
    const despachante = useDispatch();
    const navigate = useNavigate(); // Inicializa o useNavigate

    const [formValidado, setFormValidado] = useState(false);

    const [recadoReseta] = useState({
        usuario: {},
        mensagem: ""
    });
    const [recado, setRecado] = useState(recadoReseta);

    useEffect(() => {
        despachante(consultarUsuarios());
        despachante(consultarChats());
    }, [despachante]);

    useEffect(() => {
        if (estado === ESTADO.OCIOSO && mensagem) {
            window.alert(mensagem);
            despachante(consultarChats());
            despachante(zerarMensagem());
            setRecado(recadoReseta);
        }
        else if (estado === ESTADO.ERRO && mensagem) {
            window.alert(mensagem);
            despachante(zerarMensagem());
        }
    }, [estado, mensagem, recadoReseta, despachante]);

    function calcularTempo(dataHora) {
        if (dataHora) {
            const dataInformada = parse(dataHora, 'dd/MM/yyyy, HH:mm:ss', new Date());
            const dataAtual = new Date();
            const diferenca = differenceInMinutes(dataAtual + 3, dataInformada);
            return diferenca < 5;
        }
        return false;
    }

    function deletar(chat) {
        if (calcularTempo(chat.usuario.dataHora)) {
            despachante(deletarChat(chat));
        }
        else {
            { <Alert> não é possível excluir</Alert> }
        }
    }

    function manipularSubmissao(evento) {
        const form = evento.currentTarget;
        if (form.checkValidity()) {
            setFormValidado(false);
            despachante(gravarChat(recado));
        }
        else
            setFormValidado(true);
        evento.preventDefault();
        evento.stopPropagation();
    }

    function manipularMudanca(evento) {
        const elemento = evento.target.name;
        const valor = evento.target.value;
        if (elemento === "usuario" && valor !== "") {
            const novo = JSON.parse(valor); // converte de volta para objeto
            setRecado({ ...recado, [elemento]: novo });
        }
        else {
            setRecado({ ...recado, [elemento]: valor });
        }
    }

    // Função de Logout
    function handleLogout() {
        despachante(logout());
        navigate('/login');

        return (
            <Pagina>

                <Button variant="danger" onClick={handleLogout} className="mb-3">
                    Logout
                </Button>

                {/* Formulário de mensagens */}
                <Form className="mt-4" noValidate validated={formValidado} onSubmit={manipularSubmissao}>
                    <Form.Group className="mb-3">
                        <Form.Label>Usuario</Form.Label>
                        <Form.Select
                            required
                            id="usuario"
                            name="usuario"
                            value={JSON.stringify(recado.usuario)}
                            onChange={manipularMudanca}
                        >
                            <option value="">Escolha o Usuario</option>
                            {listaUsuarios?.map((usuario) => (
                                <option key={usuario.id} value={JSON.stringify(usuario)}>
                                    {usuario.nickname}
                                </option>
                            ))}
                        </Form.Select>
                        <Form.Control.Feedback type="invalid">
                            Por favor, informe o usuario!
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mt-3">
                        <Form.Label>Mensagem:</Form.Label>
                        <Form.Control
                            required
                            id="mensagem"
                            name="mensagem"
                            as="textarea"
                            rows={3}
                            value={recado.mensagem}
                            onChange={manipularMudanca}
                            placeholder="Digite sua Mensagem"
                        />
                    </Form.Group>

                    <Button variant="success" onClick={manipularSubmissao} className="mt-2">
                        Enviar
                    </Button>
                </Form>

                <div className="mt-5">
                    <ListGroup>
                        {listaChats?.map((item) => (
                            <ListGroup.Item key={item.id} className="d-flex align-items-center">
                                <div className="flex-grow-1">
                                    <Image
                                        style={{ width: "100px" }}
                                        src={item.usuario.urlAvatar}
                                        thumbnail
                                        alt="avatar"
                                        className="me-3"
                                    />
                                    <strong>{item.usuario.nickname}</strong>: {item.mensagem} <br />
                                    <small>postado em: {item.dataHora}</small>
                                </div>
                                {calcularTempo(item?.dataHora) && (
                                    <Button onClick={() => { deletar(item) }} variant="danger" type="button" className="ms-auto">
                                        Excluir
                                    </Button>
                                )}
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </div>
            </Pagina>
        );
    }
}
