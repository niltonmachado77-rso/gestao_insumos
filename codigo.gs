// ============================================
// APPS SCRIPT PARA PLANILHA DE CONTROLE DE INSUMOS
// Secretaria de Educação de Remanso
// ============================================
// COMO USAR:
// 1. Abra sua planilha: https://docs.google.com/spreadsheets/d/1_A7nIPyhiPU4eDPWZDM5HbNiH1WkgeAoqQQR1pmqh6A
// 2. Vá em Extensões > Apps Script
// 3. Cole este código inteiro e salve (Ctrl+S)
// 4. Implante > Nova implantação > Tipo: Web App
// 5. Execute como: "Eu" (seu email)
// 6. Quem pode acessar: "Qualquer pessoa"
// 7. Clique em "Implantar" e copie a URL gerada
// 8. Cole a URL no arquivo config.js (substitua SUA_URL_DO_WEB_APP)

const SPREADSHEET_ID = "1_A7nIPyhiPU4eDPWZDM5HbNiH1WkgeAoqQQR1pmqh6A";

function doGet(e) {
  const action = e?.parameter?.action || "";
  
  if (action === "getEscolas") {
    return jsonOutput(getEscolas(), e);
  } else if (action === "getConfig") {
    return jsonOutput(getConfiguracoes(), e);
  } else if (action === "getPendentes") {
    return jsonOutput(getSolicitacoesPendentes(), e);
  } else if (action === "getEntregas") {
    const escola = e?.parameter?.escola || "";
    return jsonOutput(getEntregasPorEscola(escola), e);
  } else if (action === "getEstoque") {
    return jsonOutput(getEstoqueInsumos(), e);
  } else if (action === "getLogs") {
    return jsonOutput(getLogs(), e);
  } else {
    return HtmlService.createHtmlOutput(
      '<h2>Sistema de Gestão de Insumos - API</h2><p>Use os parâmetros: ?action=getEscolas, getConfig, getPendentes, getEntregas&escola=NOME, getEstoque, getLogs</p>'
    ).setTitle('API - Gestão de Insumos');
  }
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action || "";
    
    const actions = {
      "registrarEntrega": () => registrarEntrega(data.payload),
      "solicitarInsumo": () => solicitarInsumo(data.payload),
      "marcarEntregue": () => marcarEntregue(data.payload),
      "solicitarManutencao": () => solicitarManutencao(data.payload)
    };
    
    if (actions[action]) {
      return jsonOutput(actions[action]());
    }
    
    return jsonOutput({ success: false, error: "Ação não reconhecida: " + action });
  } catch (error) {
    return jsonOutput({ success: false, error: error.toString() });
  }
}

function jsonOutput(data, e) {
  const callback = e?.parameter?.callback || "";
  if (callback) {
    return ContentService
      .createTextOutput(callback + "(" + JSON.stringify(data) + ")")
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// ============================================
// FUNÇÕES DE LEITURA DA PLANILHA
// ============================================

function getEscolas() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const aba = ss.getSheetByName("Principal");
  if (!aba) return [];
  
  const dados = aba.getDataRange().getValues();
  const escolas = [];
  
  for (let i = 1; i < dados.length; i++) {
    if (dados[i][0] && dados[i][0].toString().trim()) {
      escolas.push({
        nome: dados[i][0].toString().trim(),
        bm5100: Number(dados[i][1]) || 0,
        bm5110: Number(dados[i][2]) || 0,
        elgin: Number(dados[i][3]) || 0,
        l5590: Number(dados[i][4]) || 0,
        l4260: Number(dados[i][5]) || 0
      });
    }
  }
  return escolas;
}

function getConfiguracoes() {
  return {
    modelosInsumos: {
      "BM5100ADW": { tipo: "toner_cilindro", insumos: [{id:"toner",nome:"Toner"},{id:"cilindro",nome:"Cilindro (Drum)"}] },
      "BM5110ADW": { tipo: "toner_cilindro", insumos: [{id:"toner",nome:"Toner"},{id:"cilindro",nome:"Cilindro (Drum)"}] },
      "elgin_M6550": { tipo: "toner_cilindro", insumos: [{id:"toner",nome:"Toner"},{id:"cilindro",nome:"Cilindro (Drum)"}] },
      "L5590": { tipo: "tinta_544", insumos: [{id:"preto",nome:"Tinta Preta 544"},{id:"cyan",nome:"Tinta Cyan 544"},{id:"magenta",nome:"Tinta Magenta 544"},{id:"amarelo",nome:"Tinta Amarelo 544"}] },
      "L4260": { tipo: "tinta_504", insumos: [{id:"preto",nome:"Tinta Preta 504"},{id:"cyan",nome:"Tinta Cyan 504"},{id:"magenta",nome:"Tinta Magenta 504"},{id:"amarelo",nome:"Tinta Amarelo 504"}] }
    },
    tiposManutencao: ["Manutenção", "Instalação", "Configuração", "Atualização", "Outro"],
    equipamentos: ["Computador", "Notebook", "Impressora", "Rede", "Wi-Fi"],
    modelosImpressora: ["Epson L3150","Epson L3250","Epson L4260","Epson L5590","Pantum BM5100ADW","Pantum BM5110ADW","Kyocera ECOSYS N2040DN/L","Kyocera ECOSYS N2035DN/L"]
  };
}

function getSolicitacoesPendentes() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let aba = ss.getSheetByName("Solicitacoes_Pendentes");
  if (!aba) return [];
  
  const dados = aba.getDataRange().getValues();
  const solicitacoes = [];
  
  for (let i = 1; i < dados.length; i++) {
    if (!dados[i][0]) continue;
    solicitacoes.push({
      id: dados[i][0].toString(),
      data: dados[i][1] ? dados[i][1].toString() : "",
      solicitante: dados[i][2] ? dados[i][2].toString() : "",
      escola: dados[i][3] ? dados[i][3].toString() : "",
      tipo: dados[i][4] ? dados[i][4].toString() : "",
      itens: dados[i][5] ? dados[i][5].toString() : "",
      status: dados[i][6] ? dados[i][6].toString().toUpperCase() : "PENDENTE",
      observacoes: dados[i][7] ? dados[i][7].toString() : ""
    });
  }
  
  return solicitacoes.filter(s => s.status === "PENDENTE");
}

function getEntregasPorEscola(escola) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const aba = ss.getSheetByName("Entregas_Insumos");
  if (!aba) return [];
  
  const dados = aba.getDataRange().getValues();
  const entregas = [];
  
  for (let i = 1; i < dados.length; i++) {
    if (!dados[i][0]) continue;
    const escolaRow = dados[i][2] ? dados[i][2].toString().trim() : "";
    if (escola && escolaRow !== escola) continue;
    
    entregas.push({
      data: dados[i][0] ? dados[i][0].toString() : "",
      responsavel: dados[i][1] ? dados[i][1].toString() : "",
      escola: escolaRow,
      impressora: dados[i][3] ? dados[i][3].toString() : "",
      insumo: dados[i][4] ? dados[i][4].toString() : "",
      quantidade: Number(dados[i][5]) || 0,
      tipo: dados[i][6] ? dados[i][6].toString() : ""
    });
  }
  return entregas;
}

function getEstoqueInsumos() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const aba = ss.getSheetByName("Controle_Estoque");
  if (!aba) return [];
  
  const dados = aba.getDataRange().getValues();
  const estoque = [];
  
  for (let i = 1; i < dados.length; i++) {
    if (!dados[i][0]) continue;
    estoque.push({
      insumo: dados[i][0].toString(),
      modelo: dados[i][1] ? dados[i][1].toString() : "",
      quantidade: Number(dados[i][2]) || 0,
      estoqueMinimo: Number(dados[i][3]) || 0,
      observacao: dados[i][4] ? dados[i][4].toString() : ""
    });
  }
  return estoque;
}

function getLogs() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const aba = ss.getSheetByName("Log_Auditoria");
  if (!aba) return [];
  
  const dados = aba.getDataRange().getValues();
  const logs = [];
  
  for (let i = 1; i < dados.length; i++) {
    if (!dados[i][0]) continue;
    logs.push({
      dataHora: dados[i][0] ? dados[i][0].toString() : "",
      usuario: dados[i][1] ? dados[i][1].toString() : "",
      acao: dados[i][2] ? dados[i][2].toString() : "",
      detalhes: dados[i][3] ? dados[i][3].toString() : ""
    });
  }
  return logs;
}

// ============================================
// FUNÇÕES DE ESCRITA NA PLANILHA
// ============================================

function registrarEntrega(payload) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let aba = ss.getSheetByName("Entregas_Insumos");
  
  if (!aba) {
    aba = ss.insertSheet("Entregas_Insumos");
    aba.getRange(1, 1, 1, 8).setValues([["Data", "Responsável", "Escola", "Impressora", "Insumo", "Quantidade", "Tipo", "Observação"]]);
    aba.getRange(1, 1, 1, 8).setFontWeight("bold").setBackground("#f3f3f3");
  }
  
  for (const insumo of payload.insumos) {
    aba.appendRow([
      payload.data,
      payload.responsavel,
      payload.escola,
      payload.modelo,
      insumo.nome,
      insumo.quantidade,
      payload.tipoInsumo || "toner_cilindro",
      payload.observacao || ""
    ]);
  }
  
  registrarLog(payload.responsavel || "sistema", "ENTREGA", 
    `Escola: ${payload.escola}, Modelo: ${payload.modelo}, ${payload.insumos.length} insumo(s)`);
  
  return { success: true, message: "Entrega registrada na planilha!" };
}

function solicitarInsumo(payload) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let aba = ss.getSheetByName("Solicitacoes_Pendentes");
  
  if (!aba) {
    aba = ss.insertSheet("Solicitacoes_Pendentes");
    aba.getRange(1, 1, 1, 8).setValues([["ID", "Data", "Solicitante", "Escola", "Tipo", "Itens", "Status", "Observacoes"]]);
    aba.getRange(1, 1, 1, 8).setFontWeight("bold").setBackground("#f3f3f3");
  }
  
  const id = "SOL_" + Date.now() + "_" + Math.random().toString(36).substr(2, 6).toUpperCase();
  const itensStr = payload.itens.map(i => `${i.printer}: ${i.insumos.map(s => `${s.label} x${s.qty}`).join(", ")}`).join(" | ");
  
  aba.appendRow([
    id,
    payload.data,
    payload.solicitante,
    payload.escola,
    "INSUMO",
    itensStr,
    "PENDENTE",
    payload.observacoes || ""
  ]);
  
  registrarLog(payload.solicitante, "SOLICITACAO_INSUMO", `Escola: ${payload.escola}, Itens: ${payload.itens.length}`);
  
  return { success: true, message: "Solicitação registrada na planilha!", id: id };
}

function marcarEntregue(payload) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const aba = ss.getSheetByName("Solicitacoes_Pendentes");
  
  if (!aba) return { success: false, error: "Aba Solicitacoes_Pendentes não encontrada" };
  
  const dados = aba.getDataRange().getValues();
  
  for (let i = 1; i < dados.length; i++) {
    if (dados[i][0] && dados[i][0].toString() === payload.id) {
      aba.getRange(i + 1, 7).setValue("ENTREGUE");
      const obsAtual = dados[i][7] ? dados[i][7].toString() : "";
      aba.getRange(i + 1, 8).setValue(
        (obsAtual ? obsAtual + " | " : "") + 
        `Entregue por: ${payload.entreguePor} em ${new Date().toLocaleDateString('pt-BR')}`
      );
      
      registrarLog(payload.entreguePor, "CONFIRMAR_ENTREGA", `Solicitação ${payload.id} marcada como entregue`);
      
      return { success: true, message: "Solicitação marcada como entregue!" };
    }
  }
  
  return { success: false, error: "Solicitação não encontrada na planilha" };
}

function solicitarManutencao(payload) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let aba = ss.getSheetByName("Solicitacoes_Pendentes");
  
  if (!aba) {
    aba = ss.insertSheet("Solicitacoes_Pendentes");
    aba.getRange(1, 1, 1, 8).setValues([["ID", "Data", "Solicitante", "Escola", "Tipo", "Itens", "Status", "Observacoes"]]);
    aba.getRange(1, 1, 1, 8).setFontWeight("bold").setBackground("#f3f3f3");
  }
  
  const id = "MAN_" + Date.now() + "_" + Math.random().toString(36).substr(2, 6).toUpperCase();
  const itensStr = payload.itens.map((it, i) => 
    `${i+1}. ${it.tipo} de ${it.equip} (qtd: ${it.qty})${it.modelo ? ' - '+it.modelo : ''}: ${it.desc}`
  ).join(" | ");
  
  aba.appendRow([
    id,
    payload.data,
    payload.solicitante,
    payload.escola,
    "MANUTENCAO",
    itensStr,
    "PENDENTE",
    payload.observacoes || ""
  ]);
  
  registrarLog(payload.solicitante, "SOLICITACAO_MANUTENCAO", `${payload.itens.length} item(ns) de manutenção`);
  
  return { success: true, message: "Solicitação de manutenção registrada!", id: id };
}

function registrarLog(usuario, acao, detalhes) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let aba = ss.getSheetByName("Log_Auditoria");
  
  if (!aba) {
    aba = ss.insertSheet("Log_Auditoria");
    aba.getRange(1, 1, 1, 4).setValues([["Data/Hora", "Usuário", "Ação", "Detalhes"]]);
    aba.getRange(1, 1, 1, 4).setFontWeight("bold").setBackground("#f3f3f3");
  }
  
  aba.appendRow([new Date(), usuario, acao, detalhes]);
}

function verificarPermissao(email) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const aba = ss.getSheetByName("Config_Usuarios");
  if (!aba) return false;
  
  const dados = aba.getDataRange().getValues();
  for (let i = 1; i < dados.length; i++) {
    if (dados[i][0] && dados[i][0].toString().trim() === email && 
        dados[i][2] && dados[i][2].toString().trim() === "coord_tecnologia") {
      return true;
    }
  }
  return false;
}