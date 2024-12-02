import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../../redux/redux.usuario'; // Ação de login
import { Button, Form, Container } from 'react-bootstrap';

function PaginaLogin() {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [mensagemErro, setMensagemErro] = useState('');
  
  const dispatch = useDispatch();
  const navigate = useNavigate(); // useNavigate para redirecionar

  function realizarLogin(evento) {
    evento.preventDefault();

    if (usuario === 'admin' && senha === 'senha123') {
      dispatch(login({ nickname: usuario })); // Dispara ação de login
      navigate('/batepapo'); // Redireciona para a página de bate-papo
    } else {
      setMensagemErro('Credenciais inválidas!');
    }
  }

  return (
    <Container className="w-50" style={{ marginTop: '50px' }}>
      <h2>Login</h2>
      {mensagemErro && <div className="alert alert-danger">{mensagemErro}</div>}
      <Form onSubmit={realizarLogin}>
        <Form.Group controlId="formUsuario">
          <Form.Label>Nome de Usuário</Form.Label>
          <Form.Control
            type="text"
            placeholder="Digite seu nome de usuário"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="formSenha" className="mt-3">
          <Form.Label>Senha</Form.Label>
          <Form.Control
            type="password"
            placeholder="Digite sua senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="mt-3">
          Entrar
        </Button>
      </Form>
    </Container>
  );
}

export default PaginaLogin;
