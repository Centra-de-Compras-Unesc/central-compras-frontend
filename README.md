# Central de Compras - Frontend

Sistema web de gerenciamento de pedidos e cashback para lojistas e fornecedores, construído com React 18 + Vite.

## 🚀 Características

- **Dashboard Dinâmico**: Visualização em tempo real de pedidos, vendas e métricas
- **Gráficos Interativos**: Charts responsivos com Recharts (LineChart, BarChart, AreaChart, PieChart)
- **Filtros por Período**: Análise de dados últimos 7 dias, 30 dias, 90 dias ou 12 meses
- **Autenticação JWT**: Sistema seguro de login com tokens
- **Responsivo**: Design mobile-first com TailwindCSS
- **Notificações**: Sistema de toasts para feedback do usuário
- **Modo Escuro**: Interface com tema escuro moderno

## 📋 Pré-requisitos

- Node.js 16+
- npm ou yarn
- Backend rodando em `http://localhost:3000`

## 🔧 Instalação

```bash
cd frontend
npm install
```

## 🏃 Executar

**Modo Desenvolvimento:**

```bash
npm run dev
```

Acesse em `http://localhost:5173`

**Build para Produção:**

```bash
npm run build
```

**Preview da Build:**

```bash
npm run preview
```

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   └── shared/         # Toast, Notificações
├── contexts/           # React Context (Auth)
├── hooks/              # Custom hooks
├── layouts/            # Layouts por role (Admin, Lojista, Fornecedor)
├── pages/              # Páginas por rota
│   ├── admin/          # Dashboard Admin
│   ├── fornecedor/     # Páginas Fornecedor
│   ├── loja/           # Dashboard Lojista
│   └── auth/           # Login
├── routes/             # Configuração de rotas
├── styles/             # TailwindCSS global
├── utils/              # Funções utilitárias
└── main.jsx            # Entrada principal
```

## 🎨 Tecnologias

| Tecnologia   | Versão | Uso          |
| ------------ | ------ | ------------ |
| React        | 18+    | Framework UI |
| Vite         | Latest | Build tool   |
| TailwindCSS  | Latest | Styling      |
| Recharts     | Latest | Gráficos     |
| React Router | 6+     | Roteamento   |
| Axios        | Latest | HTTP Client  |

## 🔐 Autenticação

A autenticação é feita via JWT token armazenado no localStorage:

```javascript
// Login retorna token
POST /auth/login
{
  "email": "user@example.com",
  "senha": "password"
}

// Token é armazenado e enviado em toda requisição
Authorization: Bearer <token>
```

## 📊 Dashboards

### 1. Dashboard Admin

- Total de lojas, fornecedores, pedidos
- Últimos 7 dias de vendas
- Top 5 lojas por valor

### 2. Dashboard Lojista

- Pedidos do período (7d/30d/90d/12m)
- Crescimento de vendas
- Cashback acumulado
- Quantidade de pedidos por período

### 3. Dashboard Fornecedor

- Últimos 7 dias de vendas
- Status dos pedidos
- Produtos mais vendidos

## 🔌 Endpoints API

Base URL: `http://localhost:3000`

### Autenticação

- `POST /auth/login` - Login
- `GET /usuarios/:id` - Dados do usuário

### Pedidos

- `GET /pedidos` - Listar todos os pedidos
- `GET /pedidos/:id` - Detalhe do pedido
- `POST /pedidos` - Criar pedido
- `PUT /pedidos/:id` - Atualizar pedido

### Lojas

- `GET /lojas` - Listar lojas
- `GET /lojas/:id` - Detalhe da loja

### Fornecedores

- `GET /fornecedores` - Listar fornecedores
- `GET /fornecedores/:id` - Detalhe do fornecedor

## 📈 Período de Dados

Os gráficos suportam 4 períodos:

- **7d**: Últimos 7 dias
- **30d**: Últimos 30 dias
- **90d**: Últimos 90 dias
- **12m**: Últimos 12 meses

## 🎯 Valores para Testes

Pedidos são gerados com valores entre **R$ 50 e R$ 800** para melhor visualização dos gráficos.

## 🐛 Troubleshooting

**Gráficos não aparecem?**

- Verifique se o backend está rodando
- Limpe o cache do navegador (Ctrl+Shift+Delete)
- Verifique o console para erros de CORS

**Erro 401 Não Autorizado?**

- Token expirado, faça login novamente
- Verifique se o token está sendo enviado corretamente

**Valores não aparecem?**

- Verifique se há pedidos no banco de dados
- Execute o seed: `node scripts/seedHistoricoVendas.js`

## 📝 Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do frontend:

```env
VITE_API_URL=http://localhost:3000
```

## 🚢 Deploy

### Vercel (Recomendado)

```bash
npm install -g vercel
vercel
```

### Netlify

```bash
npm run build
# Deploy a pasta 'dist' no Netlify
```

**Última atualização:** 28 de Novembro de 2025

## Trabalho desenvolvido por:

Gustavo da Cunha Constante,
Eduardo Assis,
João Marcos Vieira dos Santos,
Henrique Matiola,
Bruno Luque,
Brayan Miguel Favarin.
