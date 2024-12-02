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
        <Route path="/Prova2BimestreBCCLP2" element={<TelaHome />} />
        <Route path="/Prova2BimestreBCCLP2/usuario" element={<TelaCadastroUsuario />} />
        <Route path="/Prova2BimestreBCCLP2/login" element={<PaginaLogin />} /> {/* Rota para a página de login */}
        <Route path="/Prova2BimestreBCCLP2/chat" element={<TelaBatePapo />} />
        <Route path="*" element={<Tela404 />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
