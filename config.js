// ============================================
// CONFIGURAÇÃO - API Google Sheets
// ============================================
// Altere a URL abaixo após implantar o Web App:
// 1. Vá em: https://script.google.com
// 2. Abra o projeto criado com o gs_webapp.gs
// 3. Implante > Nova implantação > Web App
// 4. Copie a URL gerada e cole abaixo
// ============================================

const CONFIG = {
  // URL do Google Apps Script Web App (deixe vazio para usar apenas localStorage)
  WEB_APP_URL: "https://script.google.com/macros/s/AKfycbzxnZVwxxbFzMiaNvrvozy-qnZzXSfu_kc88Gm5IfMuxd1RUW8RPhUMkuAeICCj4TkkEw/exec",
  
  // Timeout para requisições (ms)
  API_TIMEOUT: 10000,
  
  // Modo de operação:
  // "auto" = tenta API, fallback localStorage
  // "api" = apenas API (requer WEB_APP_URL configurada)
  // "local" = apenas localStorage (offline)
  MODO: "api"
};