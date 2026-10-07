// Motor do Publicador de Hotsites: HTML-modelo + cadastro + mídia → páginas + avisos.
// Puro: sem banco, rede, DOM do navegador ou relógio. Data/hora entram como parâmetro.

export * from './tipos.js';
export { slug, slugValor, esc, numBR, fmtBR, abreviar } from './texto.js';
export { RX_VAR, ehMidia, varsDoTexto } from './variaveis.js';
export { lerBlocos, RX_MARCA, type No, type NoSe, type ErroBloco } from './blocos.js';
export {
  acharVars, detectar, inferirDono, inferirDonos, sincronizarVars, colunas, ehContagem, raizAbrev,
  FORMULAS_PADRAO, ORDEM_PADRAO, STATUS_CONHECIDOS,
  type Deteccao, type VarDetectada, type Ocorrencia,
} from './detectar.js';
export { avaliar, nomesFormula } from './formulas.js';
export { Cadastro, novaLinha, COLUNAS_NOME, type DadosCadastro } from './cadastro.js';
export {
  ajustarTagsMidia, refsDeArquivo, acharArquivo, normRef, opcoesMidia, padraoMidia, valorMidia, pastasMidia,
  versaoTela, caminhoMidia, arquivoAceito, tipoArquivo, TIPOS_ARQUIVO, CSS_MIDIA, type OpcaoMidia,
} from './midia.js';
export { gerar, type EntradaGerar, type PaginaGerada, type ResultadoGerar } from './gerar.js';
export { temCardsFixos, converterCardsFixos, type ResultadoConversao, type CardPreenchido } from './conversor.js';
export { verificarHtml, SINONIMOS, type Problema, type CodigoProblema } from './verificador.js';
