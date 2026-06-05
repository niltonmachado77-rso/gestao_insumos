# 🖨️ Gestão de Insumos e Manutenção

**Sistema para controle de insumos de impressoras e solicitações de manutenção — Secretaria de Educação de Remanso**

![Status](https://img.shields.io/badge/status-em%20produ%C3%A7%C3%A3o-green)
![License](https://img.shields.io/badge/license-MIT-blue)

---

## 📋 Funcionalidades

### 1️⃣ Entrega de Insumos
- **Histórico por escola**: visualize todos os insumos já entregues filtrando por instituição
- **Solicitações pendentes**: lista de pedidos aguardando confirmação
- **Confirmação de entrega**: autenticação da coordenação de tecnologia para registrar entregas
- **Somente coordenadores** confirmam as entregas de insumo

### 2️⃣ Solicitar Insumo
- Formulário com múltiplos itens (adicione quantos precisar)
- Selecione o modelo da impressora e os insumos específicos:
  - **Toner + Cilindro** para Pantum/Elgin
  - **Tintas 504/544** (Preto, Cyan, Magenta, Amarelo) para Epson
- Checkbox para selecionar individualmente cada insumo
- Campo de observação por item
- Lista de solicitações com status (Pendente / Entregue)

### 3️⃣ Manutenção / Suporte Técnico
- Solicitação de serviços para: Computador, Notebook, Impressora, Rede, Wi-Fi
- Tipos: Manutenção, Instalação, Configuração, Atualização, Outro
- Seletor de modelo de impressora (com opção "Outro" que memoriza o modelo digitado)
- Descrição detalhada do problema

### 🔐 Autenticação
-utilizar credenciais da sheet "Config_Usuarios" da planilha para email de coordenadores que tem permissão de confirar entreguas de insumos e finaluzar manutenções.
conteudo minino da sheets é:
"
Email	Nome	Perfil
tecnologiaremanso@gmail.com	Coord.Ti	COORDENADORES
nilton.machado77@gmail.com	Nilton	COORDENADORES
fabio.srn@gmail.com	Fabio	COORDENADORES
"
- Modal de login para coordenação de tecnologia
- Usuário: `coordenacao` | Senha: `coord2024` deve ser removido
- utilizar credenciais do gmail para acesso ao sistema.
- Necessário para confirmar entregas de insumos

---

## � Configurar Google OAuth para GitHub Pages

### ❌ Erro "invalid_client" ou "Erro 401"?

Se você receber este erro ao clicar em **"Entrar com Google"**, é porque o domínio do GitHub Pages não está autorizado.

### ✅ Solução em 5 passos:

#### 1. Abra o Google Cloud Console
- Acesse: https://console.cloud.google.com/
- Faça login com a conta que criou o projeto

#### 2. Vá para APIs & Services → Credentials
- No menu à esquerda: **APIs & Services > Credentials**

#### 3. Encontre o OAuth Client ID
- Procure por **"OAuth 2.0 Client IDs"**
- Clique no que diz **"Web Application"**
- ID: `736548641453-tj7am4m73s2kek4sqvqcfbmo3qb13o2t.apps.googleusercontent.com`

#### 4. Adicione as Origens Autorizadas
- Na seção **"Authorized JavaScript origins"**, clique **+ Add URI**
- Digite: `https://niltonmachado77-rso.github.io`

- Na seção **"Authorized redirect URIs"**, clique **+ Add URI**  
- Digite: `https://niltonmachado77-rso.github.io/gestao_insumos/`

#### 5. Salve e Aguarde
- Clique em **SAVE**
- Aguarde até 10 minutos
- Limpe cache (Ctrl+Shift+Delete) ou acesse em modo incógnito
- Tente fazer login novamente

---

## �🚀 Como usar

### Opção 1 — Apenas HTML (modo local)
1. Abra o arquivo `gestao_insumos_v3.html` no navegador
2. Os dados são salvos no **localStorage** do navegador
3. Funciona offline, mas os dados ficam apenas no computador atual
4. 

### Opção 2 — Com servidor local (recomendado para testes)
```bash
npm install
npm start
```
Acesse: http://localhost:5500

### Opção 3 — Com Google Sheets (dados compartilhados)

#### 1. Implantar o Apps Script
1. Acesse sua planilha: https://docs.google.com/spreadsheets/d/1_A7nIPyhiPU4eDPWZDM5HbNiH1WkgeAoqQQR1pmqh6A
2. Vá em **Extensões → Apps Script**
3. Copie o conteúdo do arquivo `gs_webapp.gs` e cole no editor
4. Salve (Ctrl+S) e dê um nome ao projeto
5. Clique em **Implantar → Nova implantação**
6. Tipo: **Web App**
   - Executar como: **Eu** (seu email)
   - Quem pode acessar: **Qualquer pessoa**
7. Clique em **Implantar** e **copie a URL gerada**

#### 2. Configurar o App
1. Abra o arquivo `config.js`
2. Cole a URL do Web App:
```javascript
const CONFIG = {
  WEB_APP_URL: "https://script.google.com/macros/s/SEU_ID_AQUI/exec",
  MODO: "auto"
};
```

#### 3. Estrutura esperada da planilha
O Apps Script criará automaticamente estas abas na planilha:
- `Entregas_Insumos` — registros de entregas
- `Solicitacoes_Pendentes` — solicitações pendentes e histórico (número único para cada solicitação para rastreio / log de auditoria)
- `Log_Auditoria` — log de todas as ações (quem salvou solicitação - timestamp+quem atendeu a solicitação+timestamp) para melhores efeitos cada solicitação deveria ter um número único.
- `Config_Usuarios` — usuários autorizados (obrigatório)

---

## 📁 Estrutura do Projeto

```
gestao_insumos/
├── gestao_insumos_v3.html   ← App principal (HTML + CSS + JS)
├── config.js                 ← Configuração da API
├── gs_webapp.gs              ← Google Apps Script (cópia para deploy)
├── package.json              ← Dados do projeto
├── .gitignore                ← Arquivos ignorados
└── README.md                 ← Este arquivo
```

---

## 🛠️ Tecnologias

- **HTML5 + CSS3** — Interface responsiva
- **JavaScript Vanilla** — Lógica do app
- **Tabler Icons** — Ícones da interface
- **localStorage** — Persistência local
- **Google Apps Script** — Integração com Google Sheets
- **live-server** — Servidor de desenvolvimento

---

## 👤 Credenciais de Acesso

| Campo    | Valor           |
|----------|-----------------|
| Usuário  | `coordenacao`   |
| Senha    | `coord2024`     |

---

## 📄 Licença

MIT © Secretaria de Educação de Remanso