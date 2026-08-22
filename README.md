# 🎯 Job Classifier — Frontend React

> Dashboard de vagas de emprego com filtros inteligentes, scoring de compatibilidade e ações por vaga.

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite)](https://vitejs.dev)

---

## 📸 Preview

Dashboard completo com filtros, estatísticas e cards de vagas.

---

## 🚀 Funcionalidades

- **Dashboard** com estatísticas em tempo real
- **Filtros combináveis**: período, plataforma, tipo, status, busca textual
- **Score de compatibilidade** (0-100) baseado no perfil do usuário
- **Ações por vaga**: favoritar, ignorar, restaurar, cambiar status
- **Paginação** com 20 vagas por página
- **Layout responsivo** com design profissional
- **Fallback offline** via JSONs quando a API está indisponível

---

## 🛠️ Stack Tecnológica

| Tecnologia | Versão | Uso |
|---|---|---|
| React | 19 | UI Library |
| TypeScript | 5.6 | Type Safety |
| Vite | 6 | Build Tool |
| Axios | 1.7 | HTTP Client |
| CSS Modules | — | Estilos |

---

## 📁 Estrutura do Projeto

```
src/
├── components/
│   ├── Header/          ← Logo e título
│   ├── StatsBar/        ← Cards de estatísticas
│   ├── Filters/         ← Barra de filtros
│   ├── JobCard/         ← Card individual de vaga
│   ├── JobList/         ← Lista de vagas
│   └── Pagination/      ← Controle de páginas
├── hooks/
│   ├── useJobs.ts       ← Gerenciamento de vagas
│   ├── useStats.ts      ← Estatísticas
│   └── useFilters.ts    ← Estado dos filtros
├── services/
│   └── api.ts           ← Comunicação com a API
├── types/
│   └── index.ts         ← Interfaces TypeScript
├── utils/
│   └── score.ts         ← Lógica de scoring
├── App.tsx              ← Componente principal
├── App.css              ← Estilos globais
├── main.tsx             ← Entry point
└── index.css            ← Reset CSS
```

---

## ⚙️ Configuração

### Pré-requisitos
- Node.js 20+
- npm ou yarn

### Instalação

```bash
# Clonar o repositório
git clone https://github.com/masilvaarcs/job-classifier-react.git
cd job-classifier-react

# Instalar dependências
npm install

# Copiar variáveis de ambiente
cp .env.example .env

# Iniciar servidor de desenvolvimento
npm run dev
```

Acessar: `http://localhost:5173`

---

## 🔌 Comunicação com a API

O frontend se comunica com a API Node.js (`job-classifier-api`) via proxy configurado no Vite:

```typescript
// vite.config.ts
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8000',
      changeOrigin: true,
    },
  },
}
```

### Endpoints Utilizados

| Endpoint | Método | Uso |
|---|---|---|
| `/api/vagas` | GET | Listar vagas com filtros |
| `/api/stats` | GET | Estatísticas gerais |
| `/api/status` | GET | Status de buscas |
| `/api/vagas/:id/status` | PUT | Atualizar status |
| `/api/vagas/:id/ignorar` | POST | Ignorar vaga |
| `/api/vagas/:id/restaurar` | POST | Restaurar vaga |
| `/api/vagas/:id/favoritar` | POST | Toggle favorito |

---

## 📦 Build para Produção

```bash
npm run build
```

O build será gerado na pasta `dist/`.

---

## 🧪 Scripts Disponíveis

| Script | Descrição |
|---|---|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run preview` | Preview do build |
| `npm run lint` | Verificação de código |

---

## 📋 Projeto Completo

Este repositório faz parte do projeto **Job Classifier**, composto por:

| Repositório | Tecnologia | Descrição |
|---|---|---|
| [job-classifier-react](https://github.com/masilvaarcs/job-classifier-react) | React + TypeScript | Frontend (este repositório) |
| [job-classifier-api](https://github.com/masilvaarcs/job-classifier-api) | Node.js + Express | API REST |
| [job-classifier-python](https://github.com/masilvaarcs/job-classifier-python) | Python + FastAPI | Microserviço de scraping |

---

## 👤 Autor

**Marcos Santos da Silva**
- Desenvolvedor Full Stack Sênior
- [GitHub](https://github.com/masilvaarcs)
- [LinkedIn](https://linkedin.com/in/marcosprogramador)

---

## 📄 Licença

MIT
