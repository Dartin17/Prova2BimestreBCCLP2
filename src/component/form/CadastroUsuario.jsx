import { Form, Button, Spinner, Col, Row, Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import { gravarUsuario, zerarMensagem } from "../../redux/redux.usuario";
import ESTADO from "../../redux/redux.estado";

export default function FormCadastroUsuario(props) {
    let { estado, mensagem } = useSelector((state) => state.usuarios);
    const dispatch = useDispatch();
    const [carregando, setCarregando] = useState(false);
    const [formValidado, setFormValidado] = useState(false);
    const [usuarioReseta] = useState({
        id: "",
        nickname: "",
        urlAvatar: "",
        dataIngresso: "",
        senha: ""
    });
    const [usuario, setUsuario] = useState(usuarioReseta);

    useEffect(() => {
        const agora = new Date();
        const dataHoraIngresso = agora.toISOString().slice(0, 19).replace('T', ' ');
        setUsuario((prevState) => ({
            ...prevState,
            dataIngresso: dataHoraIngresso,
        }));
    }, [usuario.dataIngresso]);

    useEffect(() => {
        if (estado === ESTADO.OCIOSO && mensagem) {
            setCarregando(false);
            window.alert(mensagem);
            dispatch(zerarMensagem());
            setUsuario(usuarioReseta);
        }
        else if (estado === ESTADO.ERRO && mensagem) {
            setCarregando(false);
            window.alert(mensagem);
            dispatch(zerarMensagem());
        }
    }, [estado, mensagem, props, usuarioReseta, dispatch]);

    function manipularSubmissao(evento) {
        evento.preventDefault();
        evento.stopPropagation();

        const form = evento.currentTarget;
        if (form.checkValidity()) {
            setFormValidado(false);
            setCarregando(true);
            const agora = new Date();
            const dataHoraIngresso = agora.toISOString().slice(0, 19).replace('T', ' ');
            const usuarioComDataHora = { ...usuario, dataIngresso: dataHoraIngresso };
            dispatch(gravarUsuario(usuarioComDataHora));
        } else {
            setFormValidado(true);
        }
    }
    function manipularMudanca(evento) {
        const elemento = evento.target.name;
        const valor = evento.target.value;
        setUsuario({ ...usuario, [elemento]: valor });
    }

    return (
        <Container className="w-50">
            <Form className="mb-4" noValidate validated={formValidado} onSubmit={manipularSubmissao}>
                <Form.Group className="mb-3">
                    <Form.Label>Nome de Usuário</Form.Label>
                    <Form.Control
                        required
                        id="nickname"
                        name="nickname"
                        value={usuario.nickname}
                        onChange={manipularMudanca}
                        type="text"
                        placeholder="Nome de Usuário"
                    />
                    <Form.Control.Feedback type="invalid">
                        Por favor, informe seu nome de usuário!
                    </Form.Control.Feedback>
                </Form.Group>


                <Form.Group className="mb-3">
                    <Form.Label>Url da Imagem</Form.Label>
                    <Form.Control
                        required
                        id="urlAvatar"
                        name="urlAvatar"
                        value={usuario.urlAvatar}
                        onChange={manipularMudanca}
                        type="url"
                        placeholder="URL do avatar"
                    />
                    <Form.Control.Feedback type="invalid">
                        Por favor, informe a Url do seu avatar.
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Control
                    type="hidden"
                    name="dataIngresso"
                    value={usuario.dataIngresso}
                />

                <Form.Group className="mb-3">
                    <Form.Label>Senha</Form.Label>
                    <Form.Control
                        required
                        id="senha"
                        name="senha"
                        value={usuario.senha}
                        onChange={manipularMudanca}
                        type="password"
                        placeholder="Senha"
                    />
                    <Form.Control.Feedback type="invalid">
                        Por favor, informe sua senha!
                    </Form.Control.Feedback>
                </Form.Group>


                <Row className="mt-2 mb-2">
                    <Col md={2}>
                        <Button disabled={carregando} type="submit" variant="success">
                            {carregando ? (
                                <>
                                    Carregando...
                                </>
                            ) : (
                                "Confirmar"
                            )}
                        </Button>
                    </Col>
                    <Col>
                        <Button disabled={carregando} type="button" variant="success"
                            onClick={() => {
                                setUsuario(usuarioReseta);
                                props.setExibirUsuarios(true);
                            }}
                        >
                            Voltar
                        </Button>
                    </Col>
                </Row>
            </Form>
        </Container>
    );
}
