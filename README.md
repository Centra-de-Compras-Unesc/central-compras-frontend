# 🎨 Central de Compras - Frontend

Interface web para gerenciar pedidos, fornecedores, lojas e cashback. Construído com **React 18 + Vite + Tailwind CSS**.

---

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js 18+** - [Download](https://nodejs.org)
- **npm** ou **yarn** (vem com Node.js)
- **Git** - [Download](https://git-scm.com)
- **Backend rodando** em `http://localhost:3000`

---

## 🔧 Instalação Passo a Passo

### 1️⃣ Configure as variáveis de ambiente

**Crie o arquivo `frontend/.env`:**

```env
VITE_API_URL=http://localhost:3000
```

**⚠️ Importante:** Certifique-se de que o backend está rodando em `http://localhost:3000`

### 2️⃣ Instale as dependências

```bash
npm install
```

### 3️⃣ Inicie o servidor

```bash
npm run dev
```

✅ Frontend rodará em `http://localhost:5173`

---

## 🛠️ Comandos Disponíveis

```bash
# Desenvolvimento (com hot reload)
npm run dev

# Build para produção
npm run build

# Visualizar build de produção
npm run preview

# Executar ESLint
npm run lint

# Fazer build e visualizar
npm run build && npm run preview
```

---

## 📁 Estrutura do Projeto

```
frontend/
├── src/
│   ├── components/           # Componentes React reutilizáveis
│   │   ├── LoginForm.jsx
│   │   └── shared/
│   │       ├── Toast.jsx
│   │       ├── ToastContainer.jsx
│   │       ├── DataCard.jsx
│   │       ├── FornecedorCard.jsx
│   │       └── ...
│   ├── contexts/             # Context API
│   │   └── AuthContext.jsx
│   ├── hooks/                # Custom hooks
│   │   └── useNotification.js
│   ├── layouts/              # Layouts por perfil
│   │   ├── AdminLayout.jsx
│   │   ├── FornecedorLayout.jsx
│   │   └── LojaLayout.jsx
│   ├── pages/                # Páginas da aplicação
│   │   ├── auth/
│   │   ├── admin/
│   │   ├── fornecedor/
│   │   └── loja/
│   ├── routes/               # Definição de rotas
│   ├── styles/               # Estilos globais
│   ├── utils/                # Funções utilitárias
│   ├── main.jsx
│   └── App.jsx
├── public/                   # Arquivos estáticos
├── .env
├── index.html
├── vite.config.js
├── tailwind.config.js
├── package.json
└── README.md
```

---

## 🔐 Autenticação

Acesse `http://localhost:5173` e faça login com:

| Perfil       | Email                   | Senha    |
| ------------ | ----------------------- | -------- |
| Admin        | `admin@teste.com`       | `123456` |
| Fornecedor 1 | `fornecedor1@teste.com` | `123456` |
| Fornecedor 2 | `fornecedor2@teste.com` | `123456` |
| Fornecedor 3 | `fornecedor3@teste.com` | `123456` |
| Lojista 1    | `loja1@teste.com`       | `123456` |
| Lojista 2    | `loja2@teste.com`       | `123456` |
| Lojista 3    | `loja3@teste.com`       | `123456` |

---

## �� Interface por Perfil

### 👨‍💼 Admin

- Dashboard com estatísticas
- Gerenciar usuários, fornecedores e lojas
- Ver todos os produtos
- Configurações do sistema

### 🏭 Fornecedor

- Dashboard de vendas
- Criar e gerenciar produtos
- Gerenciar campanhas promocionais
- Ver pedidos recebidos
- Definir condições comerciais

### 🛒 Lojista

- Dashboard de compras
- Catálogo de fornecedores e produtos
- Fazer novos pedidos
- Histórico de pedidos
- Ver cashback acumulado
- Relatórios de compra

---

## 📊 Dados Disponíveis

✅ **3 Lojas**  
✅ **3 Fornecedores**  
✅ **20 Produtos**  
✅ **6 Campanhas**  
✅ **63 Pedidos**  
✅ **63 Registros de Cashback**

---

## 🔌 Comunicação com API

O frontend usa `fetch` para comunicar com a API do backend.

### Exemplo de Uso (`src/utils/api.js`)

```javascript
// GET
const lojas = await api("/lojas");

// POST
const novaLoja = await api("/lojas", {
  method: "POST",
  body: JSON.stringify({ nome: "Loja Nova" }),
});

// PUT
await api("/lojas/1", {
  method: "PUT",
  body: JSON.stringify({ nome: "Loja Atualizada" }),
});

// DELETE
await api("/lojas/1", { method: "DELETE" });
```

---

## 🎯 Notificações (Toast)

```javascript
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

export function MinhaPage() {
  const { adicionarToast } = useContext(AuthContext);

  const handleSalvar = async () => {
    try {
      adicionarToast("Salvo com sucesso!", "success");
    } catch (error) {
      adicionarToast("Erro ao salvar", "error");
    }
  };
}
```

**Tipos:** `'success'` | `'error'` | `'warning'` | `'info'`

---

## 🛠️ Tecnologias Utilizadas

- **React 18** - Biblioteca UI
- **Vite** - Build tool
- **React Router v6** - Roteamento
- **Tailwind CSS** - Estilos
- **Recharts** - Gráficos
- **React Icons** - Ícones
- **Fetch API** - Requisições HTTP
- **Context API** - Estado global

---

## 📝 Variáveis de Ambiente

```env
VITE_API_URL=http://localhost:3000
```

---

## 🐛 Troubleshooting

### ❌ "Frontend não carrega / página em branco"

- Verifique se backend está em `http://localhost:3000`
- Abra F12 para ver erros no console
- Limpe cache: `Ctrl+Shift+Delete`
- Reinicie: `npm run dev`

### ❌ "ERRO: Falha ao conectar em localhost:3000"

- Confirme backend rodando: `npm run dev` (pasta backend)
- Verifique `.env`: `VITE_API_URL=http://localhost:3000`
- Verifique porta 3000 não está em uso

### ❌ "Login não funciona / Erro 401"

- Backend rodando?
- Credencial válida?
- Banco tem dados?
- Veja erro no console (F12)

### ❌ "Dados não carregam"

- Está logado?
- Verifique Network (F12)
- Backend retorna dados?

### ❌ "Toast não aparece"

- Importe `useContext` do React
- Use `AuthContext`
- Verifique sintaxe: `const { adicionarToast } = useContext(AuthContext);`

---

## 💡 Dicas Importantes

### Desenvolvendo Novas Páginas

1. Crie em `src/pages/[perfil]/`
2. Defina rotas em `src/routes/[Perfil]Routes.jsx`
3. Use layout apropriado
4. Importe componentes de `src/components/`
5. Use API via `src/utils/api.js`

### Adicionando Componentes

1. Crie em `src/components/`
2. Use props para dados
3. Exporte como `export default`

### Estilização

Use **Tailwind CSS**:

```jsx
<button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
  Clique
</button>
```

### Debugging

DevTools (F12):

- **Console** - Ver erros
- **Network** - Ver requisições
- **Application** - localStorage (token)
- **React DevTools** - Inspecionar componentes

---

## 🔒 Segurança

✅ Token JWT em `localStorage`  
✅ Token em todas as requisições  
✅ Validação email/senha  
✅ Proteção de rotas por autenticação  
✅ Proteção de rotas por role

---

## 📅 Última Atualização

6 de dezembro de 2025

---

## 👥 Contribuidores

Gustavo da Cunha Constante  
Eduardo Assis  
João Marcos Vieira dos Santos  
Henrique Matiola  
Bruno Luque  
Brayan Miguel Favarin

---

## 📞 Suporte

Para problemas:

1. Backend rodando?
2. Abra console (F12)
3. Limpe cache
4. Reinicie `npm run dev`
