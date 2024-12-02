import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { consultar, deletar, gravar, atualizar } from "../service/service.usuario";
import ESTADO from "./redux.estado";

// Ações assíncronas para usuários
export const consultarUsuarios = createAsyncThunk('consultarUsuarios', async () => {
  try {
    const resposta = await consultar();
    if (Array.isArray(resposta.listaUsuarios)) {
      return {
        status: true,
        listaUsuarios: resposta.listaUsuarios,
      };
    } else {
      return {
        status: false,
        mensagem: resposta.mensagem,
      };
    }
  } catch (erro) {
    return {
      status: false,
      mensagem: erro.mensagem,
    };
  }
});

// Redutores de usuários
export const gravarUsuario = createAsyncThunk('gravarUsuario', async (usuario) => {
  try {
    const resposta = await gravar(usuario);
    if (resposta.status) {
      usuario.id = resposta.id;
      return {
        status: true,
        mensagem: resposta.mensagem,
        usuario,
      };
    } else {
      return {
        status: false,
        mensagem: resposta.mensagem,
      };
    }
  } catch (erro) {
    return {
      status: false,
      mensagem: erro.mensagem,
    };
  }
});

export const deletarUsuario = createAsyncThunk('deletarUsuario', async (usuario, senha) => {
  try {
    const resposta = await deletar(usuario, senha);
    if (resposta.status) {
      return {
        status: true,
        mensagem: resposta.mensagem,
        usuario,
      };
    } else {
      return {
        status: false,
        mensagem: resposta.mensagem,
      };
    }
  } catch (erro) {
    return {
      status: false,
      mensagem: erro.mensagem,
    };
  }
});

export const atualizarUsuario = createAsyncThunk('atualizarUsuario', async (usuario) => {
  try {
    const resposta = await atualizar(usuario);
    if (resposta.status) {
      return {
        status: true,
        mensagem: resposta.mensagem,
        usuario,
      };
    } else {
      return {
        status: false,
        mensagem: resposta.mensagem,
      };
    }
  } catch (erro) {
    return {
      status: false,
      mensagem: erro.mensagem,
    };
  }
});

// Redutor de estado do usuário
const usuarioReducer = createSlice({
  name: "usuario",
  initialState: {
    estado: ESTADO.OCIOSO,
    mensagem: "",
    listaUsuarios: [],
    usuario: null, // Estado inicial de usuário autenticado
  },
  reducers: {
    // Ação para resetar a mensagem
    zerarMensagem: (state) => {
      state.mensagem = "";
    },
    // Ação para login
    login: (state, action) => {
      state.usuario = action.payload; // Define o usuário logado
      state.estado = ESTADO.OCIOSO;
      state.mensagem = "Login bem-sucedido!";
    },
    // Ação para logout
    logout: (state) => {
      state.usuario = null; // Limpa o usuário autenticado
      state.estado = ESTADO.OCIOSO;
      state.mensagem = "Você foi desconectado!";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(consultarUsuarios.pending, (state) => {
        state.estado = ESTADO.PENDENTE;
        state.mensagem = "Processando requisição...";
      })
      .addCase(consultarUsuarios.fulfilled, (state, action) => {
        state.estado = ESTADO.OCIOSO;
        state.mensagem = "";
        state.listaUsuarios = action.payload.listaUsuarios;
      })
      .addCase(consultarUsuarios.rejected, (state, action) => {
        state.estado = ESTADO.ERRO;
        state.mensagem = action.payload.mensagem;
      })
      .addCase(gravarUsuario.pending, (state) => {
        state.estado = ESTADO.PENDENTE;
        state.mensagem = "";
      })
      .addCase(gravarUsuario.fulfilled, (state, action) => {
        if (action.payload.status) {
          state.estado = ESTADO.OCIOSO;
          state.mensagem = action.payload.mensagem;
          state.listaUsuarios.push(action.payload.usuario);
        } else {
          state.estado = ESTADO.ERRO;
          state.mensagem = action.payload.mensagem;
        }
      })
      .addCase(gravarUsuario.rejected, (state, action) => {
        state.estado = ESTADO.ERRO;
        state.mensagem = action.payload.mensagem;
      })
      .addCase(deletarUsuario.pending, (state) => {
        state.estado = ESTADO.PENDENTE;
        state.mensagem = "Processando requisição deletar...";
      })
      .addCase(deletarUsuario.fulfilled, (state, action) => {
        if (action.payload.status) {
          state.estado = ESTADO.OCIOSO;
          state.mensagem = action.payload.mensagem;
          state.listaUsuarios = state.listaUsuarios.filter(
            (usuario) => usuario.id !== action.payload.usuario.id
          );
        } else {
          state.estado = ESTADO.ERRO;
          state.mensagem = action.payload.mensagem;
        }
      })
      .addCase(deletarUsuario.rejected, (state, action) => {
        state.estado = ESTADO.ERRO;
        state.mensagem = action.payload.mensagem;
      })
      .addCase(atualizarUsuario.pending, (state) => {
        state.estado = ESTADO.PENDENTE;
        state.mensagem = "Processando a requisição de atualizar...";
      })
      .addCase(atualizarUsuario.fulfilled, (state, action) => {
        if (action.payload.status) {
          state.estado = ESTADO.OCIOSO;
          state.mensagem = action.payload.mensagem;
          const indice = state.listaUsuarios.findIndex(
            (usuario) => usuario.id === action.payload.usuario.id
          );
          if (indice !== -1) {
            state.listaUsuarios[indice] = action.payload.usuario;
          }
        } else {
          state.estado = ESTADO.ERRO;
          state.mensagem = action.payload.mensagem;
        }
      })
      .addCase(atualizarUsuario.rejected, (state, action) => {
        state.estado = ESTADO.ERRO;
        state.mensagem = action.payload.mensagem;
      });
  },
});


export const { login, logout, zerarMensagem } = usuarioReducer.actions;

export default usuarioReducer.reducer;
