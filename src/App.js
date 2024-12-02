import { BrowserRouter, Route, Routes } from "react-router-dom";
import Tela404 from "./component/tela/Tela.404";
import TelaHome from "./component/tela/Tela.Home";
import TelaBatePapo from "./component/tela/Tela.Bate-Papo";
import TelaCadastroUsuario from "./component/tela/Tela.Cadastro-Usuario";
import PaginaLogin from "./component/tela/Tela.Login";  // Importa a tela de login

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TelaHome />} />
        <Route path="/usuario" element={<TelaCadastroUsuario />} />
        <Route path="/login" element={<PaginaLogin />} /> {/* Rota para a página de login */}
        <Route path="/chat" element={<TelaBatePapo />} />
        <Route path="*" element={<Tela404 />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
