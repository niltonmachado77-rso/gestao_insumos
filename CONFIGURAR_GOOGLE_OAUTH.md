# Configurar Google OAuth para GitHub Pages

## ❌ Problema
O erro "Erro 401: invalid_client" ocorre porque o Google OAuth Client ID não está criado ou autorizado para o domínio do GitHub Pages.

## ✅ Solução Completa

### PARTE 1️⃣ - Criar um Novo Projeto (Se não tiver)

#### 1. Acesse o Google Cloud Console
- Abra: https://console.cloud.google.com/
- Faça login com sua conta Google

#### 2. Crie um Novo Projeto
- No topo, clique em **"Select a Project"** (ou o nome do projeto atual)
- Clique em **"NEW PROJECT"**
- Digite um nome: `Gestao Insumos`
- Clique em **CREATE**

#### 3. Aguarde a criação
- Isso pode levar alguns segundos

---

### PARTE 2️⃣ - Ativar Google+ API

#### 4. Habilite a Google+ API
- No topo, clique em **"Search"** (lupa)
- Digite: `Google+ API`
- Clique no resultado
- Clique em **ENABLE**

---

### PARTE 3️⃣ - Criar OAuth 2.0 Client ID

#### 5. Vá para Credentials
- No menu à esquerda: **APIs & Services > Credentials**

#### 6. Configure a tela de consentimento
- Se aparecer um banner alertando sobre "OAuth consent screen", clique em **CONFIGURE CONSENT SCREEN**
- Selecione: **External** (para uso público)
- Clique em **CREATE**

#### 7. Preencha as informações
- **App name**: `Gestao de Insumos`
- **User support email**: (use seu email)
- **Developer contact**: (use seu email)
- Clique em **SAVE AND CONTINUE**

#### 8. Pule os "Scopes"
- Clique em **SAVE AND CONTINUE** novamente

#### 9. Adicione tester (sua conta)
- Clique em **ADD USERS**
- Digite seu email
- Clique em **ADD**
- Clique em **SAVE AND CONTINUE**

#### 10. Volte a Credentials
- No menu à esquerda: **APIs & Services > Credentials**

---

### PARTE 4️⃣ - Criar OAuth 2.0 Client ID Web

#### 11. Clique em "Create Credentials"
- Botão azul **"+ CREATE CREDENTIALS"**
- Selecione: **OAuth Client ID**

#### 12. Selecione o tipo
- **Application type**: **Web application**
- **Name**: `GitHub Pages - Gestao Insumos`

#### 13. Configure as origens autorizadas
- **Authorized JavaScript origins**:
  - Clique **+ ADD URI**
  - Digite: `https://niltonmachado77-rso.github.io`

- **Authorized redirect URIs**:
  - Clique **+ ADD URI**
  - Digite: `https://niltonmachado77-rso.github.io/gestao_insumos/`

#### 14. Clique em CREATE
- O navegador mostrará seu **Client ID** e **Client Secret**

---

### PARTE 5️⃣ - Copiar o Client ID

#### 15. Copie o Client ID
- Você verá um box com:
  - **Client ID**: `XXX...apps.googleusercontent.com`
  - **Client Secret**: (não precisa para este projeto)
  
- Clique no ícone de copiar ao lado do **Client ID**

#### 16. Atualize o arquivo HTML
- Abra: `gestao_insumos_v3.html`
- Procure por: `736548641453-tj7am4m73s2kek4sqvqcfbmo3qb13o2t.apps.googleusercontent.com`
- **Substitua por seu novo Client ID** (cole em 2 lugares)

```javascript
// Linha ~205 (initGL)
client_id:'SEU_NOVO_CLIENT_ID_AQUI.apps.googleusercontent.com',

// Linha ~228 (initTokenClient)
client_id:'SEU_NOVO_CLIENT_ID_AQUI.apps.googleusercontent.com',
```

#### 17. Salve e faça upload
- Salve o arquivo
- Execute: `git add . && git commit -m "Update OAuth Client ID" && git push`

#### 18. Teste
- Aguarde 5-10 minutos para as mudanças se propagarem
- Limpe cache: `Ctrl+Shift+Delete`
- Acesse: https://niltonmachado77-rso.github.io/gestao_insumos/
- Clique em **"Entrar com Google"**

---

## 📌 Resumo das URIs Autorizadas

**Origens JavaScript:**
```
https://niltonmachado77-rso.github.io
```

**URIs de Redirecionamento:**
```
https://niltonmachado77-rso.github.io/gestao_insumos/
```

## 🔍 Se ainda não funcionar

1. Verifique se o **Client ID foi copiado corretamente** (procure pelos dois lugares no HTML)
2. Confirme que as **origens foram salvas**
3. Aguarde **até 10 minutos** para propagação
4. Tente em **modo incógnito** (Ctrl+Shift+N) para evitar cache
5. Verifique que o projeto está em **"External"** (não production)

---

## ⚠️ Não confunda:
- **Client ID**: `XXX...apps.googleusercontent.com` ← **USE ESTE**
- **Client Secret**: `xxx...` ← **NÃO USE** (privado, nunca compartilhe)

---

## 🆘 Precisa de Ajuda?

Se tiver dúvidas em qualquer etapa:
1. Abra o **Google Cloud Console**
2. Procure pelo seu **Project**
3. Vá em **APIs & Services > Credentials**
4. Procure por **OAuth 2.0 Client IDs** - deve ter um do tipo "Web application"
5. Clique nele para ver seus dados

Seu novo **Client ID** será assim:
```
XXXXXXXXXXXX-YYYYYYYYYYYYYYYYYYYYYYYYYYYYYY.apps.googleusercontent.com
```

Este é o que você precisa copiar para o arquivo `gestao_insumos_v3.html`!
