/**
 * Instituto Januário (IJ-CEP) — recebedor das fichas de pré-matrícula.
 *
 * Este arquivo é uma cópia de segurança. O código que roda de verdade
 * fica no editor do Apps Script, dentro da planilha.
 * Passo a passo para instalar: LEIA-ME-BACKEND.txt
 */

const SHEET_ID = 'COLE_AQUI_O_ID_DA_PLANILHA';
const ABA = 'Leads';

const COLUNAS = [
  'Data e hora', 'Curso', 'Horário', 'Turma (idade)',
  'Nome do aluno', 'Nascimento', 'CPF do aluno', 'RG do aluno', 'Sexo',
  'WhatsApp', 'E-mail', 'Instagram',
  'Rua', 'Bairro', 'Cidade', 'Estado',
  'Como soube', 'Detalhe do "outro"',
  'Vendedor', 'Código do vendedor', 'Código que veio no link',
  'Responsável', 'Parentesco', 'CPF do responsável', 'WhatsApp do responsável',
  'Autorizou contato', 'Autorizou uso dos dados', 'Responsável autorizou',
  'Endereço da página'
];

function doPost(e) {
  try {
    const p = (e && e.parameter) || {};

    // Campo-armadilha: só robô preenche. Responde ok para não dar pista.
    if (p.campoWebsite) return json({ ok: true });

    const aba = pegarAba();
    aba.appendRow([
      new Date(),
      p.curso, p.turno, p.faixaEtaria,
      p.nome, p.nascimento, p.cpf, p.rg, p.sexo,
      p.telefone, p.email, p.instagram,
      p.rua, p.bairro, p.cidade, p.estado,
      p.comoSoube, p.comoSoubeOutro,
      p.vendedor, p.vendedorCodigo, p.vendedorCodigoLink,
      p.responsavelNome, p.responsavelParentesco, p.responsavelCPF, p.responsavelTelefone,
      p.consenteContato, p.consenteDados, p.consenteResponsavel,
      p.paginaOrigem
    ].map(function (v) { return v == null ? '' : v; }));

    return json({ ok: true });
  } catch (erro) {
    return json({ ok: false, erro: String(erro) });
  }
}

function doGet() {
  return ContentService.createTextOutput('Recebedor de fichas do IJ-CEP está no ar.');
}

/** Cria a aba e o cabeçalho na primeira vez, para não depender de setup manual. */
function pegarAba() {
  const planilha = SpreadsheetApp.openById(SHEET_ID);
  let aba = planilha.getSheetByName(ABA);

  if (!aba) {
    aba = planilha.insertSheet(ABA);
  }
  if (aba.getLastRow() === 0) {
    aba.appendRow(COLUNAS);
    aba.getRange(1, 1, 1, COLUNAS.length).setFontWeight('bold');
    aba.setFrozenRows(1);
  }
  return aba;
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/** Rode uma vez pelo editor para conferir se a planilha responde. */
function testar() {
  doPost({ parameter: { nome: 'Teste', curso: 'Teste', vendedor: 'Teste' } });
}
