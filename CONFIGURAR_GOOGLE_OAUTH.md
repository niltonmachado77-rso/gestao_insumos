# Configurar Google OAuth para GitHub Pages

## ❌ Problema
O erro "Erro 401: invalid_client" ocorre porque o Google OAuth Client ID não está autorizado para o domínio do GitHub Pages.

## ✅ Solução

Siga estes passos para autorizar o domínio:

### 1. Acesse o Google Cloud Console
- Abra: https://console.cloud.google.com/
- Faça login com sua conta Google

### 2. Selecione o Projeto
- Procure pelo projeto de OAuth (geralmente contém as credenciais do app)
- Se não encontrar, você pode acessar: **APIs & Services > Credentials**

### 3. Edite o OAuth 2.0 Client ID
- Vá para: **APIs & Services > Credentials**
- Procure pela seção **OAuth 2.0 Client IDs**
- Clique no client ID que começa com `736548641453` (Web Application)
- Clique em **Editar**

### 4. Adicione a Origem Autorizada
- Procure por **Origens JavaScript autorizadas** (JavaScript origins)
- Clique em **+ Adicionar URI**
- Adicione: `https://niltonmachado77-rso.github.io`
- **Não** adicione caminho completo, apenas o domínio

### 5. Adicione URI de Redirecionamento Autorizada (se necessário)
- Procure por **URIs de redirecionamento autorizado** (Authorized redirect URIs)
- Se houver, clique em **+ Adicionar URI**
- Adicione: `https://niltonmachado77-rso.github.io/gestao_insumos/`

### 6. Salve as Mudanças
- Clique em **SALVAR** no canto superior direito
- Aguarde a atualização (pode levar alguns minutos)

### 7. Teste o Login
- Aguarde ~2 minutos para as mudanças se propagarem
- Acesse: https://niltonmachado77-rso.github.io/gestao_insumos/
- Limpe o cache do navegador (Ctrl+Shift+Delete)
- Clique em **"Entrar com Google"** novamente

## 📌 URIs que devem estar autorizadas

**Origens JavaScript:**
```
https://niltonmachado77-rso.github.io
```

**URIs de Redirecionamento:**
```
https://niltonmachado77-rso.github.io/gestao_insumos/
```

## 🔍 Se ainda não funcionar

1. Verifique se o client_id `736548641453-tj7am4m73s2kek4sqvqcfbmo3qb13o2t.apps.googleusercontent.com` é o correto
2. Confirme que as origens foram salvas corretamente
3. Espere mais alguns minutos (às vezes leva até 10 minutos)
4. Tente em modo incógnito (Ctrl+Shift+N) para evitar cache

## ⚙️ Client ID em uso
`736548641453-tj7am4m73s2kek4sqvqcfbmo3qb13o2t.apps.googleusercontent.com`
