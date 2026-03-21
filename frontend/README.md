# Wemov WMS Frontend

Sistema de Gestão de Armazém (WMS) desenvolvido em **Vue 2** com arquitetura modular e UI premium.

## Tecnologias

| Camada | Tecnologia |
|---|---|
| Framework | Vue 2.7 |
| Build Tool | Vite |
| UI Library | Element UI |
| State Management | Vuex 3 |
| Routing | Vue Router 3 |
| i18n | Vue I18n 8 |
| Charts | ECharts 5 |
| Export | XLSX (SheetJS) |

## Executando o projeto

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Build de produção
npm run build
```

## Estrutura

```
src/
├── lang/           # Traduções (pt-BR, en-US, es-ES)
├── layout/         # Layout principal (sidebar, topbar)
├── router/         # Rotas da aplicação
├── services/       # mockData (API), i18n
├── store/          # Vuex (auth, theme, language)
├── styles/         # CSS global e design system
└── views/
    ├── auth/           # Login, recuperação de senha
    ├── dashboard/      # Dashboard com gráficos ECharts
    ├── products/       # Catálogo de produtos (CRUD)
    ├── profile/        # Perfil do usuário
    ├── settings/       # Usuários, Roles, Configs, Reports
    └── wms/            # Inbound, Outbound, Inventário, Movimentações
```

## Módulos

- **Dashboard** — KPIs, gráfico de movimentações, atalhos rápidos
- **Produtos** — CRUD completo com categorias e unidades integradas
- **Inbound** — Recebimento físico com serialização de lotes e putaway
- **Outbound** — Expedição FEFO com validação de estoque disponível
- **Inventário** — Visão unificada de lotes vs reservas vs disponível
- **Movimentações** — Histórico rastreável de todas as operações
- **Relatórios** — Posição de estoque, histórico, vencimentos + exportação XLSX
- **Configurações** — Master data: categorias, unidades de medida
- **Usuários / RBAC** — Gestão de usuários e permissões por perfil
- **Localização** — Português (BR), Inglês (US), Espanhol (ES)
- **Tema** — Modo claro e escuro persistido via localStorage