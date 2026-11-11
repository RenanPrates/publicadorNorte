# Guia de variáveis para HTML de eventos

Vale para **qualquer evento** (corrida, beach tennis, combo, exposição…) e para **todas as páginas**: tapume (home), praça (interna da cidade), etapa, One page e pós-evento.
Quem monta o HTML (designer ou Claude) segue este guia. O Publicador de Hotsites lê o HTML, acha as variáveis, monta o cadastro e gera uma página por cidade.

**Este é o único arquivo de regras.** Se houver outro guia antigo no canal, ignore-o. A seção 12 (preço, gratuito e status) vale acima de qualquer outro trecho.

---

## 0. Resumo: as regras que mais quebram

Leia antes de tudo. Cada uma tem a seção com o detalhe.

1. **Todo texto visível é variável**, inclusive os que o JavaScript escreve (mensagens, rótulos, opções de quiz). Nada de frase fixa no HTML nem no JS (1.1, 1.8).
2. **Um texto, um campo.** Título com destaque ou em duas linhas é uma variável só; a cor e a quebra se fazem no publicador (1.1).
3. **Nomes:** minúsculas e `_`; cada parte depois de `_` começa com letra; número de série colado na palavra (`faq1_pergunta`, nunca `faq_1_pergunta`). O `_1` no fim é reservado: quer dizer "da cidade" (2).
4. **Preço, gratuito e status só com `@se`**, na ordem da seção 12. Nunca decididos por JavaScript nem guardados em `data-` (12).
5. **"A confirmar"** é texto simples, no `@senao` do `@se` do próprio dado (4).
6. **Dentro de `@repetir cidades`, toda variável vira coluna da cidade.** Rótulos fixos ("Ver no mapa", "Gratuita", "Inscrições abertas") ficam fora do laço, num bloco de textos escondido (1.8).
7. **Toda imagem, ícone, vídeo, PDF e fonte é arquivo dentro de `_media/<pagina>/<secao>/`.** Nada de `<svg>` de ícone escrito no HTML, nada de base64, nada de caminho de arquivo montado no JavaScript (1.3, 9).
8. **Mídia opcional ou única ganha pasta própria** (ex.: `_media/pagina/curador/`). Variável sem número numa pasta com outros arquivos pega o primeiro arquivo da pasta (9).
9. **Galeria é lista, não espaços fixos:** `@repetir galeria…` com um item só; quantas galerias precisar, cada uma com nome (1.4).
10. **Valores não são lidos de novo:** um `@x` escrito dentro do valor de outro campo aparece como texto. Contagem e dado de cidade vão no HTML, fora do valor (2).
11. **Cada parte da página é uma `<section id>` de primeiro nível** e o JavaScript aguenta a seção sumir (o publicador esconde e reordena seções) (9, 13).
12. **Datas pelo nome da variável** (`@data_inicio_dia`, `@periodo`…), nunca formatadas por JavaScript (4).
13. **Não coloque no HTML** o que o publicador já faz: Tag Manager, `robots`/`canonical`, patrocinadores, `target="_blank"` (14).
14. Sem `scrollIntoView`, sem `@se` dentro de `<template>`, string JS ou atributo (12.4).
15. Entregue o **pacote completo**: HTML(s), `_media`, planilhas de textos e de cidades e o LEIA-ME (15).

---

## 1. Tudo editável, tudo conectado, tudo responsivo

O HTML é um **modelo**: quem publica precisa conseguir trocar **qualquer texto, link, imagem ou ícone** pelo publicador, sem abrir o código. O que fica escrito direto no HTML não aparece no cadastro e não pode ser corrigido por quem publica.

| Vira variável (aparece no cadastro ou no passo Mídia) | Fica no código |
|---|---|
| **Todo texto que aparece na tela**: títulos, subtítulos, parágrafos, rótulos, legendas, texto de botão, perguntas e respostas das dúvidas, avisos, mensagens de formulário, textos que o JavaScript escreve | Estrutura: tags, classes, CSS, JavaScript |
| Dados da cidade e do evento: cidade, local, datas, horários, preços, status | Setas, "+", "×", "‹ ›" e outros sinais de interface (em CSS ou como caractere, não imagem) |
| **Todos os links**: inscrição, WhatsApp, e-mail, redes sociais, vídeos, webhooks, arquivos para baixar (PDF) | |
| **Todas as imagens, ícones, ilustrações, vídeos e fontes** (como arquivos em `_media`, seção 9) | |

Não existe "texto genérico que não muda": se aparece na tela, vira variável. Uma variável a mais não atrapalha; um texto fixo errado vai para o ar e ninguém consegue corrigir sem pedir um HTML novo.

### 1.1 Textos
- Nome = `<seção>_<parte>`, sem número quando é igual em todas as páginas: `@sobre_titulo`, `@sobre_texto`, `@duvidas_titulo`, `@inscricao_botao`.
- **Um texto, um campo.** Um título em duas linhas ou com uma palavra em destaque é **uma** variável: `<h1>@hero_titulo</h1>`, não `@hero_titulo_linha1<br>@hero_titulo_linha2 <span class="hl">@hero_titulo_destaque</span>`. A quebra de linha, a cor, o negrito e o tamanho se fazem no publicador, na formatação do campo. O verificador avisa ("texto dividido").
- **Formatação dentro do valor** (seção 2.3): o publicador só guarda `<b> <strong> <i> <em> <u> <s> <br>` e `<span class="…" style="…">`. Destaque com cor própria do layout é uma **classe que funciona num `<span>`**: escreva o CSS como `.hl{color:var(--ember)}`, nunca só `mark{…}` ou `h2 em{…}`. Um `<span>` sem classe é descartado; `<mark>` e outras tags fazem o valor virar texto puro.
- Cada texto fica dentro do **seu próprio elemento** (`<h2>@x</h2>`, `<p>@y</p>`): no publicador, quem publica pode ocultar o texto (o espaço fica), ocultar o bloco (o conteúdo de baixo sobe) ou mover o bloco, e "o bloco" é o elemento em volta do texto.
- Listas de itens parecidos são **séries numeradas**, cada item dentro do seu `@se`, com mais espaços do que o necessário hoje (o que sobrar some). No publicador elas aparecem em blocos, com + e − para mostrar ou tirar um item:

```html
<ul class="qa">
  <!-- @se faq1_pergunta -->
  <li><details><summary><img src="@img_duvidas_icone1" alt=""><span>@faq1_pergunta</span></summary>
    <div class="a"><p>@faq1_resposta</p></div></details></li>
  <!-- @fim -->
  <!-- @se faq2_pergunta -->
  <li><details><summary><img src="@img_duvidas_icone2" alt=""><span>@faq2_pergunta</span></summary>
    <div class="a"><p>@faq2_resposta</p></div></details></li>
  <!-- @fim -->
  <!-- … até faq12 -->
</ul>
```
- O número da série fica **colado na palavra**: `faq1_pergunta`, `sala2_obra3_titulo`, `@img_salas_retrato4`. Nunca `faq_1_pergunta` nem `@foto_1`: `_1` no fim quer dizer "da cidade" (seção 2).
- Uma série precisa de **3 ou mais itens** (ou 2 com exatamente os mesmos campos). Dois campos parecidos, como `destaque1` e `destaque2` de coisas diferentes, não viram lista.
- **Todos os itens de uma série têm os mesmos campos** (mesmo molde). Se uma dúvida tem link, todas têm `@faqN_link` (dentro de `@se faqN_link`). O verificador acusa (`lista-desigual`).
- Texto que muda conforme o evento (gratuito, preço, em breve) é um **campo opcional que existe em todos os itens**; vazio, vale o campo normal:

```html
<!-- em TODAS as dúvidas (faq1 … faq12), igual: -->
<div class="a"><p>
  <!-- @se gratuito = sim --><!-- @se faq1_resposta_gratuito -->@faq1_resposta_gratuito<!-- @senao -->@faq1_resposta<!-- @fim -->
  <!-- @senao -->@faq1_resposta<!-- @fim -->
</p>
<!-- @se faq1_link --><a class="btn" href="#datas">@faq1_link</a><!-- @fim --></div>
```
- Resposta que mostra dado do cadastro (preço, número de cidades) põe o dado **no HTML, depois** do texto do campo: `<p>@faq_cidades_resposta @total_cidades cidades.</p>`. Escrever `@total_cidades` dentro do valor do campo não funciona (o valor não é lido de novo).
- Quantidades mínimas de espaços: dúvidas 12, equipe 8, depoimentos 8, temas/etapas 8, vídeos 6. Galeria não usa espaços fixos (1.4).
- Variável usada só em atributo (`alt`, `aria-label`, `content`), em `<title>` ou no JavaScript é "texto simples" no publicador (sem formatação nem ocultar/mover). Tudo bem.

### 1.2 Links e arquivos para baixar
- Links: `@link_inscricao` (base), `@link_whatsapp`, `@link_email`, `@link_instagram`, `@link_youtube`, `@link_mapa`… Todo `<a href>` que leva para fora usa uma variável.
- **Botões de compra** ("Garantir", "Quero aproveitar", barra fixa) levam para o carrinho (`@link_inscricao_1`) quando a cidade está aberta, não para uma âncora da página.
- **Logos** do topo e do rodapé são links para a página inicial. Na praça e na etapa, a home é `index.html` (as páginas das cidades ficam na mesma pasta: `sao-paulo.html`).
- Não escreva `target="_blank"`: o publicador abre em nova aba todo link que sai do site (âncoras `#…` e páginas do próprio site, não). Cada campo de link tem a opção "abrir na mesma aba" no publicador.
- **Arquivo para baixar (PDF)**: variável `@arquivo_<secao>_<nome>`, com o PDF em `_media/<pagina>/<secao>/`. **Cada PDF na sua própria pasta**, sem imagens junto (a variável `@arquivo_` também aceita imagem e pegaria a capa por engano). Pasta vazia = variável vazia = o botão some:

```html
<!-- @se arquivo_livrinho_pdf -->
<a class="btn" href="@arquivo_livrinho_pdf" download>@livreto_botao <small>@livreto_botao_detalhe</small></a>
<!-- @fim -->
<!-- _media/pagina/livrinho/livrinho.pdf  ·  a capa fica em outra pasta: _media/pagina/livreto/capa.webp -->
```

### 1.3 Imagens, ícones e ilustrações
- **Toda imagem é um arquivo** dentro de `_media/<pagina>/<secao>/` (seção 9), com uma variável `@img_<secao>_<nome>` quando quem publica pode querer trocar. Vale para foto, ilustração, ícone, selo e capa.
- **Ícones em SVG, como arquivo**: exporte cada ícone como um `.svg` próprio (com `viewBox`, sem `width`/`height` fixos) e use `<img src="@img_icones_preco" alt="">`. **Não escreva `<svg>…</svg>` dentro do HTML** para ícones e ilustrações: eles não podem ser trocados (o verificador avisa `svg-embutido`).
- Ícone de uma cor que muda pelo CSS: arquivo `.svg` usado como máscara, com a cor no CSS:
```css
.ic{display:inline-block;width:1em;height:1em;background:currentColor;
    -webkit-mask:var(--ic) center/contain no-repeat;mask:var(--ic) center/contain no-repeat}
```
```html
<span class="ic" style="--ic:url(_media/praca/icones/seta.svg)"></span>
```
  Ícone de várias cores fica como `<img>`.
- **Exceção aceita:** desenho **animado por partes** (rodas girando, portas abrindo, anel de progresso) pode ficar em `<svg>` no HTML. O aviso do verificador continua; registre no bloco de documentação (seção 10) que é de propósito.
- **Todo arquivo citado no HTML vai junto na pasta `_media` entregue.** Nada de imagem de exemplo com texto, print de tela ou mensagem de erro.
- Ilustrações em camadas (personagem, ingredientes, fundo) são arquivos separados, cada um com sua variável.
- Lugar de imagem que pode ficar sem arquivo: envolva em `@se` e deixe o layout se ajustar (sem moldura vazia, sem "foto a receber"):
```html
<div class="midias"><!-- @se media_obras_sala1obra1midia1 --><figure class="midia"><img src="@media_obras_sala1obra1midia1" alt="@sala1_obra1_titulo"></figure><!-- @fim --></div>
```
```css
.midias:not(:has(.midia)){display:none}                         /* sem foto, a área some */
.card--lado:not(:has(.midia)){grid-template-columns:minmax(0,1fr)} /* e o texto ocupa a largura */
```

### 1.4 Galerias (fotos sem limite, por cidade ou geral)
Galeria **não** é uma série de espaços fixos (`@img_galeria_foto1…12`, `@media_galeria_cidade1foto1…`). É uma lista: quem publica envia **quantas fotos quiser** no passo **Mídia**, várias de uma vez, e marca cada uma com a cidade do cadastro (ou "Todas as cidades"). No HTML, escreva **um item só** entre `@repetir galeria…` e `@fim`:

| Variável | O que vira |
|---|---|
| `@galeria_foto` | o arquivo da foto (use no `src`) |
| `@galeria_legenda` | a legenda (pode ficar vazia: use `@se galeria_legenda`) |
| `@galeria_cidade` | o nome da cidade da foto (vazio quando a foto é de todas) |
| `@galeria_numero` | 1, 2, 3… na ordem da galeria |

**Cada galeria tem um nome** depois de `galeria` e vira um quadro próprio no passo Mídia: `@repetir galeria_cidades`, `@repetir galeria_geral`, `@repetir galeria_bastidores`. Página com duas galerias = dois nomes = dois módulos independentes.

- **Dentro de `@repetir cidades`** (ou na página da cidade), a galeria mostra as fotos daquela cidade **e** as marcadas "Todas as cidades".
- **Fora** de `@repetir cidades` (One page, tapume), mostra **todas** as fotos daquela galeria.

**Galeria por cidade, com abas** (nomes das abas vêm do cadastro; cidade sem foto some):
```html
<section class="gal gal--cidades" id="galeria-cidades" aria-labelledby="galc-t">
  <h2 id="galc-t">@galeria_cidades_titulo</h2>
  <div class="abas" role="tablist"><!-- @repetir cidades --><button role="tab" data-gal aria-selected="false">@cidade</button><!-- @fim --></div>
  <!-- @repetir cidades --><div class="gal__painel" data-gal-painel role="tabpanel" aria-label="@cidade"><!-- @repetir galeria_cidades --><button class="gal__item" type="button"><img src="@galeria_foto" alt="@cidade" loading="lazy"></button><!-- @fim --></div><!-- @fim -->
</section>
```
```js
// casa aba e painel pela ordem; cidade sem foto sai; numera depois
const g = document.querySelector('#galeria-cidades');
if (g) {
  const abas = [...g.querySelectorAll('[data-gal]')], paineis = [...g.querySelectorAll('[data-gal-painel]')];
  paineis.forEach((p, i) => { if (!p.querySelector('.gal__item')) { p.remove(); abas[i] && abas[i].remove(); } });
  // … depois: data-gal = 1, 2, 3 nas que sobraram; clique troca o painel visível
}
```
**Galeria geral** (todas as fotos, carrossel, faixas que correm, mosaico…):
```html
<section class="gal gal--geral" id="galeria" aria-labelledby="galg-t">
  <h2 id="galg-t">@galeria_geral_titulo</h2>
  <div class="gal__grade"><!-- @repetir galeria_geral --><button class="gal__item" type="button"><img src="@galeria_foto" alt="@galeria_geral_titulo" loading="lazy"></button><!-- @fim --></div>
</section>
```
- Sem nenhuma foto, a seção some pelo CSS: `.gal:not(:has(.gal__item)){display:none}`. Prefira `:has()` a `:empty` (espaços e comentários quebram o `:empty`).
- Com uma cidade só, esconda as abas: `.abas:not(:has(button:nth-of-type(2))){display:none}`.
- O CSS funciona com qualquer quantidade de fotos (0, 1, 3, 40): `columns`, grade com `auto-fill`/`minmax`, ou faixa com rolagem. Efeitos que duplicam fotos (faixa infinita) clonam pelo JavaScript a partir dos itens gerados.
- Ampliação (lightbox) navega dentro do grupo da foto clicada (o painel da cidade ou a galeria geral).
- Link do menu para a galeria: aponte para o `id` da seção. Se a seção sumir, o publicador tira o link.
- As variáveis de foto não aparecem no cadastro: quem publica cuida das fotos no passo Mídia.

### 1.5 Tudo conectado (botões e números sincronizados)
- **A mesma ação usa a mesma variável e o mesmo `@se` em todo lugar**: o botão do topo, o botão fixo do celular, o da seção de inscrição e o do card de compartilhar. Se a inscrição está "em breve", **todos** dizem "em breve"; se está aberta, **todos** levam ao `@link_inscricao`.
- Contagens nunca são digitadas: `@total_cidades`, `@total_aberta`, `@total_breve`.
- Texto que repete um dado (ex.: "a partir de 16 anos" no FAQ e na inscrição) usa **a mesma variável** nos dois lugares.

### 1.6 Animações
- Animação de entrada começa quando o elemento **entra na tela** (`IntersectionObserver`), inclusive o que já está visível quando a página abre. Não dependa só de `load` ou `scroll`.
- Sem JavaScript, o conteúdo aparece (o estado "escondido antes de animar" é colocado pelo próprio script, com uma classe).
- Funciona dentro da prévia do publicador (a página roda num quadro, sem `sessionStorage` confiável) e quando a página abre já rolada no meio.
- Respeite `prefers-reduced-motion: reduce`: sem movimento e conteúdo visível. O botão "Sem animação" da prévia do publicador liga exatamente esse modo; tela de carregamento (loader) também precisa respeitar e nunca pode travar a página (tenha um tempo máximo).
- Imagens fora do topo com `loading="lazy"`; a do topo sem lazy.

### 1.7 Responsivo
- Monte primeiro para celular e confira em **360, 390, 768, 1024, 1280 e 1440 px** de largura. Nenhuma largura pode ter rolagem horizontal.
- Textos com `clamp()`, imagens com `max-width:100%` e `height:auto` (ou `object-fit` na classe), grades com `auto-fit`/`minmax`.
- Áreas de toque com pelo menos 44 × 44 px; botão fixo no rodapé do celular não cobre conteúdo nem o logo.
- Textos longos (nomes de cidade grandes, valores com centavos) não podem estourar cards e botões.

### 1.8 Textos que o JavaScript usa e rótulos dentro de listas
Dois casos que parecem pedir texto fixo, e não podem ter:

**a) Textos que o JavaScript escreve** (mensagens de formulário, "Copiado!", opções de um quiz, textos desenhados num canvas, nome do arquivo baixado, frases do carregamento). Ponha cada um como variável num **bloco escondido** e o script lê de lá. Nunca escreva a frase dentro do `<script>`:
```html
<div hidden data-textos>
  <span data-t="aviso_ok">@aviso_ok</span>
  <span data-t="aviso_erro">@aviso_erro</span>
  <span data-t="carteira_msg">@carteira_msg</span>   <!-- valor: "Parabéns, {nome}!" -->
</div>
```
```js
const TX = k => (document.querySelector(`[data-textos] [data-t="${k}"]`) || {}).textContent || '';
msg.textContent = TX('carteira_msg').replace('{nome}', nome);
```
Marcadores como `{nome}` dentro do valor são trocados pelo JavaScript; registre-os no bloco de documentação para quem publica não apagar.

**b) Rótulos repetidos dentro de `@repetir cidades`** ("Ver no mapa", "Gratuita", "Horários", "Inscrições abertas", "Realizado"). Toda variável dentro do laço vira **coluna da cidade**: o rótulo apareceria vazio em cada cidade nova. Deixe o rótulo no bloco escondido (fora do laço) e marque o lugar com `data-r`; o script preenche:
```html
<!-- @repetir cidades -->
<li class="parada"><b>@cidade</b> <span class="selo" data-r="rotulo_gratuita"></span> <a href="@link_mapa" data-r="rotulo_mapa"></a></li>
<!-- @fim -->
```
```js
document.querySelectorAll('[data-r]').forEach(el => { el.textContent = TX(el.dataset.r); });
```
Texto que só existe numa condição da cidade (ex.: o selo "Gratuita") fica dentro do `@se` da cidade, mas o **texto** continua vindo do bloco escondido.

---

## 2. Como escrever

| Regra | Exemplo |
|---|---|
| Começa com `@`, nome em minúsculas, palavras separadas por `_` | `@data_inicio_1` |
| Só letras, números e `_`. Nada de acento, `-`, `$` ou espaço | `@desconto_em_reais_1`, **não** `@desconto-em-R$` |
| Cada parte depois de `_` começa com **letra**; número de série colado na palavra | `@sala2_obra1_titulo`, **não** `@sala_2_obra_1` |
| `_1` no fim = "desta cidade" (praça e etapa). Não use `_1`, `_2` para outra coisa | `@cidade_1`, `@preco_vista_1` |
| Variável igual em todas as páginas não tem número | `@evento`, `@ano` |
| Num `@se` fora de `@repetir`, vale o que o texto usa: `<!-- @se faq1_pergunta -->@faq1_pergunta…` é igual em todas; com `@x_1` (ou sem texto, como `@se noturna = sim`), muda em cada cidade. Nomes da base (`status`, `gratuito`, preços) são sempre da cidade | `<!-- @se compra_item1 -->@compra_item1<!-- @fim -->` |
| Texto colado logo depois da variável: use chaves | `@{parcelamento_1}x` → "12x" |
| Unidade e símbolo ficam no HTML; a variável leva só o valor | `R$@preco_vista_1`, `@porcentagem_desconto_1% OFF` |
| Trecho que só aparece se houver valor: comentários `@se` e `@fim` | ver seção 4 |
| `@se` / `@senao` / `@fim` / `@repetir` só como comentário HTML no corpo da página: nunca dentro de atributo, de tag, de `<template>` ou de string JS | |
| Comentários (`<!-- -->`, `/* */`) não são lidos como variável: use para documentar | |

### 2.1 Quando um `@` não é lido como variável
O publicador só reconhece `@nome` quando o `@` **não** vem colado depois de letra, número, `.`, `-` ou outro `@`. Por isso:
- e-mail escrito no texto (`contato@site.com`) não vira variável (e deveria ser uma variável `@link_email`);
- `24.@data_inicio_mes_1` ou `g-@galeria_numero` **não funcionam**. Separe com uma tag: `@data_inicio_dia_1<span>.</span>@data_inicio_mes_1`; classes numeradas se fazem pelo JavaScript.
- `@media`, `@font-face`, `@keyframes` dentro de `<style>` são CSS, não variáveis.

### 2.2 Valores não são lidos de novo
O valor de um campo entra na página como está. Se alguém digitar `@total_cidades` ou `@cidade` dentro de um texto, aparece literalmente "@total_cidades". O dado vai no HTML, ao lado do campo:
```html
<p>@faq_cidades_resposta <!-- @se total_cidades -->@total_cidades cidades.<!-- @fim --></p>
```

### 2.3 Formatação que o valor pode ter
Quem publica formata o texto no publicador (negrito, itálico, sublinhado, maiúsculas, cor, tamanho, espaçamento). O valor guardado só aceita:
- tags `<b>`, `<strong>`, `<i>`, `<em>`, `<u>`, `<s>`, `<br>` e `<span>`;
- `<span>` com `class` e/ou `style` só com: `color`, `background-color`, `font-size`, `font-weight`, `font-style`, `letter-spacing`, `line-height`, `text-transform`, `text-decoration`.

O CSS do HTML deve deixar a formatação funcionar: destaques por **classe** (`.hl`, `.marca`, `.l2`), não por tag (`mark`, `h1 em`). Se o layout tem um destaque, crie a classe e use-a também no valor de exemplo: `@sobre_titulo` = `Futuros <span class="hl">sustentáveis</span>`.

---

## 3. Variáveis base (nomes obrigatórios)

Sempre que o dado existir no evento, use **exatamente** estes nomes. É o que mantém as colunas do cadastro, as contas automáticas e os preços do Odoo funcionando. Nunca crie outro nome para o mesmo dado (`@valor`, `@preco`, `@data`, `@municipio`, `@gratis`, `@link`: o verificador acusa `nome-fora-da-base`).

### Gerais (sem número)
| Variável | O que é |
|---|---|
| `@evento` | Nome do evento |
| `@ano` | Ano da edição |

### Da cidade
| Variável | O que é | Valor digitado |
|---|---|---|
| `@cidade_1` | Nome da cidade | São Paulo |
| `@uf_1` | Estado | SP |
| `@regiao_1` | Região (agrupa os cards no tapume) | Sudeste |
| `@status_1` | Situação da inscrição | `em breve` (padrão), `aberta`, `realizado`, `esgotado` (seção 12) |
| `@local_1` | Onde acontece | Parque Villa-Lobos |
| `@data_inicio_1` | Primeiro dia | 13/10/2026 (calendário; o formato na página é do HTML, seção 4) |
| `@data_fim_1` | Último dia (vazio se for um dia só) | 23/10/2026 |
| `@link_inscricao_1` | Link do botão de inscrição | https://… |

### Preço

**Antes de escrever o HTML, defina como o evento cobra.** O que muda é a forma:

| Forma de cobrança | Variáveis que o HTML usa | Não crie |
|---|---|---|
| **À vista** (sem parcelamento) | `@preco_vista_1` | `@parcelamento`, `@valor_parcelado` |
| **Parcelado** (com opção à vista) | `@preco_vista_1`, `@parcelamento_1`, `@valor_parcelado_1` | — |
| **Gratuito** em alguma cidade | `@gratuito_1` (além das de cima) | — |
| **Com desconto** em relação ao preço cheio | `@porcentagem_desconto_1`, `@preco_comum_1`, `@desconto_em_reais_1` | — |

Se o briefing não diz que o evento é parcelado, ele é **à vista**. Se não deixa claro, pergunte antes de montar.

| Variável | O que é | Preenchimento |
|---|---|---|
| `@preco_vista_1` | Preço da inscrição (à vista), só número | digitado. Se o evento for parcelado, pode ser **automático**: parcelamento × valor_parcelado |
| `@parcelamento_1` | Número de parcelas | 12 |
| `@valor_parcelado_1` | Valor de cada parcela, só número | digitado ou **automático**: preco_vista ÷ parcelamento |
| `@gratuito_1` | Evento gratuito nesta cidade | `sim` ou vazio |
| `@porcentagem_desconto_1` | Desconto, só número | 30 |
| `@preco_comum_1` | Preço sem desconto | **automático**: preco_vista ÷ (1 − desconto/100) |
| `@desconto_em_reais_1` | Quanto economiza | **automático**: preco_comum − preco_vista |

- `@preco_comum_1` só é calculado se o HTML também usar `@porcentagem_desconto` (é assim que a coluna de desconto aparece no cadastro). Mostre o preço riscado dentro de `<!-- @se porcentagem_desconto -->`.
- **Nunca escreva o preço como texto fixo** ("A confirmar", "R$ 150"). "A confirmar" só aparece como o caso de preço vazio (seção 4).

### Módulo O2 Prime (só se o evento tiver)
| Variável | O que é | Preenchimento |
|---|---|---|
| `@preco_prime_1` | Preço com O2 Prime (de assinante) | digitado ou Odoo |
| `@preco_prime_parcelado_1` | Parcela com O2 Prime | **automático** |
| `@valor_adicional_prime_1` | Quanto o Prime soma (só no modelo "Prime é adicional") | **automático** |
| `@link_inscricao_prime_1` | Link do checkout com Prime | digitado |

Com os **preços do Odoo** ligados (passo Cadastro), o O2 Prime é desconto de assinante: `@preco_prime_1` é o preço do combo para assinante e `@porcentagem_desconto_prime_1` o desconto. Nesse caso, não use `@valor_adicional_prime_1`. O Odoo também preenche o desconto (`@preco_comum_1`, `@porcentagem_desconto_1`, `@desconto_em_reais_1`), o link e `@etapa1_distancias_1`… ("5, 10, 13"). Valor que o Odoo **não** tem (ex.: preço da assinatura do Prime) é uma coluna própria do evento, digitada (`@preco_assinatura_prime_1`).

Padrão com Prime em destaque e o preço normal embaixo:
```html
<!-- @se gratuito = sim --><b>@kit_gratuito</b><!-- @senao --><!-- @se preco_vista -->
  <!-- @se preco_prime -->
    <p><small>@kit_por</small> <b class="preco preco--prime">R$@preco_prime_1</b> <img src="@img_kit_selo" alt="@kit_prime"></p>
    <p>@kit_nao_socio <b>R$@preco_vista_1</b></p>
  <!-- @senao -->
    <p><small>@kit_por</small> <b class="preco">R$@preco_vista_1</b></p>
  <!-- @fim -->
<!-- @senao --><b>A confirmar</b><!-- @fim --><!-- @fim -->
```

### Automáticas (o publicador preenche)
| Variável | O que vira |
|---|---|
| `@url` / `@url_1` | Nome do arquivo da página daquela cidade (para links) |
| `@total_cidades` | Quantas cidades (dentro da região, se estiver num grupo) |
| `@total_aberta`, `@total_breve`, `@total_realizado`, `@total_esgotado` | Quantas cidades têm esse status |
| `@<variavel>_abrev` | 3 primeiras letras (ex.: `@mes_outono_abrev` → "Mai") |
| Datas | variações de formato pelo nome (seção 4) |

---

## 4. Padrões prontos (copiar e colar)

### Preço — evento à vista
```html
<!-- @se gratuito = sim -->
  <b>Evento gratuito</b>
<!-- @senao --><!-- @se preco_vista -->
  <b>R$@preco_vista_1</b>
<!-- @senao -->
  <b>A confirmar</b>
<!-- @fim --><!-- @fim -->
```

### Preço — evento parcelado
```html
<!-- @se gratuito = sim -->
  <b>Evento gratuito</b>
<!-- @senao --><!-- @se preco_vista -->
  <!-- @se parcelamento -->
    <b>@{parcelamento_1}x R$@valor_parcelado_1</b>
    <span>ou R$@preco_vista_1 à vista</span>
  <!-- @senao -->
    <b>R$@preco_vista_1</b>
  <!-- @fim -->
<!-- @senao -->
  <b>A confirmar</b>
<!-- @fim --><!-- @fim -->
```
- "Evento gratuito" sai sem "R$". Nas cidades gratuitas, deixe os campos de preço vazios.
- Use **o mesmo padrão** em todo lugar onde o preço aparece (card do kit, barra fixa, FAQ, card do tapume).
- Os textos fixos desses exemplos ("Evento gratuito") também podem ser variáveis (`@kit_gratuito`); o que não muda é a estrutura.

### Datas: o cadastro guarda, o HTML escolhe o formato
Toda variável de data se chama `data` ou começa com `data_` (`@data_inicio`, `@data_fim`, `@data_etapa`…). No publicador ela é um **campo de data com calendário** (13/10/2026). **Como a data aparece é escolha do HTML**, pelo fim do nome. **Não formate data com JavaScript.**

| No HTML | Sai (data 13/10/2026) |
|---|---|
| `@data_inicio` | 13/10/2026 |
| `@data_inicio_curta` | 13/10 |
| `@data_inicio_dia` | 13 |
| `@data_inicio_mes` | 10 |
| `@data_inicio_mes_abrev` | out |
| `@data_inicio_mes_nome` | outubro |
| `@data_inicio_ano` | 2026 |
| `@data_inicio_semana` | terça-feira |
| `@data_inicio_semana_abrev` | ter |
| `@data_inicio_extenso` | 13 de outubro de 2026 |
| `@periodo` | 13 a 23 out 2026 (de `data_inicio` a `data_fim`) |
| `@periodo_extenso` | 13 a 23 de outubro de 2026 |

- Na página da cidade, com `_1` no fim: `@data_inicio_dia_1`, `@periodo_1`. No card do tapume e dentro de `@repetir cidades`, sem número.
- `@periodo` não repete mês e ano; um dia só (sem data de fim): "13 out 2026".
- Usar só `@data_inicio_dia` ou `@periodo` já cria a coluna de data no cadastro.
- Formato com ponto (24.01.2027): `@data_inicio_dia_1<span>.</span>@data_inicio_mes_1<span>.</span>@data_inicio_ano_1` (seção 2.1).
- Contagem regressiva é permitida no JavaScript (não decide nada): leia a data de um atributo e trate o horário vazio com `@se`:
```html
<!-- @se horario_largada --><div class="contagem" data-largada="@data_inicio_1 @horario_largada_1">…</div>
<!-- @senao --><div class="contagem" data-largada="@data_inicio_1">…</div><!-- @fim -->
```
  O script lê "dd/mm/aaaa" e "6h30" e calcula no horário de Brasília (UTC−3).

### Desconto
```html
<!-- @se porcentagem_desconto --><span class="badge">@porcentagem_desconto_1% OFF</span>
<s>R$@preco_comum_1</s> — economize R$@desconto_em_reais_1<!-- @fim -->
```

### Trecho opcional (some inteiro se não houver valor)
```html
Combo<!-- @se valor_adicional_prime --> + R$@valor_adicional_prime_1<!-- @fim -->
```

### Valor ainda não definido ("A confirmar")
Cada "A confirmar" pertence a **um dado específico**: fica no `@senao` do `@se` daquele dado.
```html
<dd><!-- @se horario -->@horario_1<!-- @senao -->A confirmar<!-- @fim --></dd>
```
Dentro de `@repetir cidades` (tapume, One page), o mesmo sem `_1`.

- **Um `@se` por dado**, com o nome do próprio dado. Na prévia do publicador, clicar no "A confirmar" preenche aquele dado daquela cidade.
- **É só texto**, com o mesmo estilo do valor que substitui. Proibido: borda, contorno ou tracejado; bolinha, ícone ou símbolo; selo, fundo colorido, colchetes ou caixa alta forçada. No máximo uma cor mais suave (`.tbc{opacity:.7}`).
- Não use uma variável única para todos (`@a_confirmar`).

### Link de inscrição (com status)
```html
<!-- @se status = realizado --><span class="cta cta--off">@inscricao_realizado</span>
<!-- @senao --><!-- @se status = aberta --><a class="cta" href="@link_inscricao_1">@inscricao_botao</a>
<!-- @senao --><span class="cta cta--off">@inscricao_breve</span><!-- @fim --><!-- @fim -->
```

### Partes que podem sumir (`@se`) e o CSS
Quando um `@se` tira um elemento, o publicador apaga o elemento do HTML. O CSS que arruma o que sobrou precisa enxergar isso **pelo tipo do elemento ou pelo conteúdo**, não pela posição:

- Use `:only-of-type`, **nunca** `:only-child` (quase sempre existe outro filho no pai: `<legend>`, título, `<span>` para leitor de tela).
- Use `:first-of-type`, `:last-of-type` e `:nth-of-type()` em vez de `:first-child`, `:last-child` e `:nth-child()` em itens opcionais.
- Use `:has()` para o recipiente se ajustar ao que sobrou: `.lista:not(:has(li)){display:none}`, `.grade:not(:has(.lado)){grid-template-columns:1fr}`.

```css
.cp-opts { display: grid; grid-template-columns: 1fr 1fr; }
.cp-opts > .cp-opt:only-of-type { grid-column: 1 / -1; max-width: 560px; justify-self: center; width: 100%; }
```
Alternativa sem seletor: grade que se ajusta sozinha, `grid-template-columns: repeat(auto-fit, minmax(280px, 1fr))`.

---

## 5. Variáveis próprias do evento

Cada evento pode ter dados que só ele tem (beach tennis: categorias, formato, premiação; corrida: horário de largada, retirada de kit). Para criar:

1. **Confira se já existe uma base** (seção 3). Se existir, use a base.
2. **Dê um nome que explica o dado**: `@categorias_1`, `@horario_largada_1`, `@retirada_kit_local_1`.
3. **Não reaproveite nomes da base com outro sentido** (`@status_quadra_1`, não `@status`). Não comece com `total_`.
4. **Siga as mesmas regras**: `_1` se muda por cidade, sem número se é igual para todas; unidade fora da variável.
5. **Registre no bloco de documentação** (seção 10).

O publicador lê qualquer `@nome` como variável e cria a coluna ou o campo sozinho.

---

## 6. Página de cidade (praça) e One page

### Praça
- Um HTML só para todas as cidades. Toda variável da cidade termina em `_1`.
- O publicador gera um arquivo por cidade (`sao-paulo.html`, `recife.html`…), na mesma pasta do `index.html` (a home).

### One page (página única, sem tapume)
- **Todo o cadastro é geral**: cada variável fora de `@repetir` vira um campo único. Não use `_1`.
- Lista de cidades (agenda, roteiro, mapa, abas da galeria): `@repetir cidades` com um item só. Tudo que estiver dentro vira coluna da tabela de cidades. **Rótulos ficam fora do laço** (seção 1.8b).
- Uma "cidade em destaque" (a parada atual) é uma coluna própria (`@destaque` = `sim`), testada com `<!-- @se destaque = sim -->` dentro do laço. Não decida pela data no JavaScript.
- Blocos numerados (temas, salas, equipe, FAQ): `@tema1_titulo`, `@tema2_titulo`… cada um no seu `@se`.
- Sai um `index.html`. As imagens ficam em `_media/pagina/`.

---

## 7. Tapume (home com os cards das cidades)

**Nunca escreva um card para cada cidade.** Escreva **um card só**, entre `@repetir cidades` e `@fim`. Dentro do card, as variáveis **não têm número**.

```html
<p class="contagem">@total_aberta com inscrição aberta · @total_breve em breve</p>

<!-- @agrupar por regiao -->
<section class="regiao" data-regiao="@regiao">
  <h3>@regiao <span>@total_cidades</span></h3>
  <div class="grade">
<!-- @repetir cidades -->
<!-- @se status = realizado -->
    <div class="card card--realizado"><h3>@cidade <span>@uf</span></h3><span class="tag" data-r="tapume_realizado"></span></div>
<!-- @senao --><!-- @se status = aberta -->
    <a class="card aberta" href="@url">
      <h3>@cidade <span>@uf</span></h3>
      <p>@periodo · @local</p>
      <p><!-- @se gratuito = sim -->Evento gratuito<!-- @senao --><!-- @se preco_vista -->R$@preco_vista<!-- @senao -->A confirmar<!-- @fim --><!-- @fim --></p>
      <span class="tag" data-r="tapume_aberta"></span>
    </a>
<!-- @senao -->
    <div class="card breve" aria-disabled="true"><h3>@cidade <span>@uf</span></h3><span class="tag" data-r="tapume_breve"></span></div>
<!-- @fim --><!-- @fim -->
<!-- @fim -->
  </div>
</section>
<!-- @fim -->
```
- As etiquetas dos cards ("inscrições abertas", "em breve", "realizado") vêm do bloco de textos escondido (seção 1.8b), não de variáveis dentro do laço.
- As variáveis do card têm os **mesmos nomes** da praça (sem `_1`). Uma coluna serve as duas páginas.
- Sem agrupamento por região: tire as linhas `@agrupar` e o `@fim` correspondente.
- Formulário "avise-me" por cidade: seção 11b.

---

## 8. Formato com etapas (home → cidade → etapa)

- **Tapume:** lista as cidades (seção 7).
- **Praça:** página da cidade; para listar as etapas, `@repetir etapas` com um card só.
- **Etapa:** página de cada etapa. Variáveis que só existem nela viram colunas da tabela de etapas.

---

## 9. Imagens, vídeos, PDFs e fontes (pasta `_media`)

Tudo fica na pasta `_media`, organizado por **página** e **seção**. Cada arquivo que pode ser trocado tem **uma variável**. No passo **Mídia**, cada variável só aceita os arquivos da pasta da sua seção.

### Pastas
```
_media/
  tapume/            ← home
  praca/             ← página da cidade
    hero/  desktop.webp  mobile.mp4
    kit/   foto.webp  selo.svg
    infos/ regulamento.pdf
    fontes/ titulo.woff2
  etapa/             ← só no formato com etapas
  pagina/            ← só no formato One page
  pos/               ← só no HTML de pós-evento
```
- Primeiro nível: a página (`tapume`, `praca`, `etapa`, `pagina` ou `pos`).
- Segundo nível: a **seção**, em uma palavra, minúsculas, sem acento e **sem `_`** (`hero`, `kit`, `curador`, `livrinho`).
- Imagem em `.webp`/`.svg`, vídeo em `.mp4`, fonte em `.woff2`.
- **Nada embutido em base64** (imagem, vídeo **ou fonte**): página pesada estoura o limite do servidor na publicação. Fontes ficam em `_media/<pagina>/fontes/` e entram pelo `@font-face { src: url(_media/praca/fontes/titulo.woff2) }`.
- Nada de pastas soltas (`video/`, `assets/`, `images/`).

### Variáveis
| Tipo | Formato | Opções no passo Mídia |
|---|---|---|
| **Imagem ou vídeo** | `@media_<secao>_<nome>` | imagens e vídeos da pasta da seção |
| Só imagem | `@img_<secao>_<nome>` | só imagens da pasta da seção |
| Só vídeo | `@video_<secao>_<nome>` | só vídeos da pasta da seção |
| Arquivo para baixar | `@arquivo_<secao>_<nome>` | qualquer arquivo da pasta (PDF e também imagens) |

Use `@media_` onde pode ter foto **ou** vídeo (topo, banners, obras). Use `@img_` onde vídeo não faz sentido (ícone, selo, logo, foto de produto).

### Qual arquivo entra (importante)
1. O arquivo com o **mesmo nome** do fim da variável (`@img_kit_selo` → `kit/selo.svg`).
2. Se não existir e o nome da variável **termina em número** (`@media_obras_sala1obra1midia2`), a variável fica **vazia** (e o `@se` esconde o lugar).
3. Se não existir e o nome **não** termina em número, entra a **primeira imagem** da pasta (ou o primeiro arquivo).

Consequências:
- Espaços numerados que podem sobrar: nomes terminando em número, e cada lugar dentro do seu `@se`.
- **Mídia opcional ou que não pode ser confundida** (vídeo do curador, PDF, selo opcional): **pasta própria**, só com ela. Se o vídeo do curador ficar em `videos/` junto com `sala1.mp4`, sem arquivo próprio ele pega o vídeo da sala.

### Desktop e mobile
| Variável | Mostra só os arquivos de |
|---|---|
| `@media_hero_desktop` | `desktop.webp`, `desktop.mp4` ou a subpasta `desktop/` |
| `@media_hero_mobile` | `mobile.webp`, `mobile.mp4` ou a subpasta `mobile/` |

Arquivos sem `desktop`/`mobile` no nome aparecem nas duas. Variável sem `desktop`/`mobile` no fim vê todos.

### Igual em todas ou por cidade
- **Igual em todas as páginas:** sem número (`@media_hero_desktop`).
- **Muda em cada cidade:** `_1` na praça (`@media_hero_desktop_1`) ou sem número dentro do card do tapume. O publicador procura antes na subpasta da cidade (`_media/praca/hero/sao-paulo/`).

### Como escrever no HTML
Escreva uma tag `<img>` com a variável. Se for escolhido um vídeo, o publicador troca sozinho por `<video autoplay muted loop playsinline>`, mantendo `class`, `id` e `style`:
```html
<img class="hero__bg hero__bg--desk" src="@media_hero_desktop_1" alt="Largada em @cidade_1">
<img class="hero__bg hero__bg--mob"  src="@media_hero_mobile_1"  alt="Largada em @cidade_1">
```
- Desktop e mobile em **duas tags**; o CSS mostra uma ou outra pela largura. Não escolha arquivo pelo JavaScript.
- Não use `<picture>`/`<source srcset>` com `@media_`/`@video_` (o verificador acusa `midia-em-picture`).
- O CSS mira a **classe** (`.hero__bg{width:100%;height:100%;object-fit:cover}`), nunca `img` ou `.hero img`, senão o vídeo perde o tamanho.
- Fundo por CSS (`background-image:url(@img_kit_foto)` ou `style="--img:url(@img_salas_retrato1)"`) só aceita imagem: use `@img_`.
- Caminho direto sem variável, só para o que nunca será trocado, e sempre dentro de `_media` (`<img src="_media/praca/marca/logo.svg">`). O publicador acha caminhos `_media/...` no HTML, no CSS e em `url(...)` de variáveis CSS.
- **Não monte caminho de arquivo no JavaScript** (`'_media/' + nome + '.png'`): o publicador não enxerga o arquivo e não o publica. Liste os arquivos no HTML (com variável) e o script lê do DOM.

### Vídeo que a pessoa assiste (com som)
O `<video>` gerado vem com `autoplay muted loop`. Vídeo de apresentação, entrevista ou trailer precisa de controles e som. O script ajusta:
```js
document.querySelectorAll('.sala__video, .modal-video video').forEach(v => {
  v.controls = true; v.loop = false; v.autoplay = false; v.removeAttribute('autoplay'); v.muted = false; v.pause();
});
```
Padrão de vídeo em janela (botão abre o modal e o vídeo toca; sem vídeo, o botão não aparece):
```html
<!-- @se media_curador_video --><button class="play" type="button" data-video-abrir aria-label="@curadoria_video_legenda"></button><!-- @fim -->
<!-- @se media_curador_video --><div class="modal" id="modal-video" role="dialog" aria-modal="true" aria-label="@curadoria_video_legenda" hidden>
  <img class="modal__video" src="@media_curador_video" alt="@curadoria_video_legenda">
  <button class="modal__fechar" type="button" aria-label="@menu_fechar">✕</button>
</div><!-- @fim -->
```
No script: abrir (`hidden = false`, `video.play()`), fechar no ✕, no Esc e clicando fora (pausa o vídeo), travar a rolagem da página enquanto aberto e devolver o foco ao botão.

### No publicador
- Passo **Páginas**: envie os HTMLs e a pasta `_media` (dá para arrastar a pasta). Enviar a pasta de novo não apaga o que foi acrescentado depois: arquivos de mesmo nome são listados para escolher.
- Passo **Mídia**: cada lugar mostra as opções da sua pasta; dá para enviar, trocar, esconder ou excluir.

### Patrocinadores
Montados pelo publicador (banco geral de logos), entram sozinhos antes do rodapé, **só nas páginas internas** (One page, praça, etapa). **Não monte seção nem régua de patrocinadores no HTML.** Entregue os logos numa pasta `patrocinadores/` à parte, para cadastro.

### Rodapé
O publicador tem um **rodapé padrão** e quem publica pode esconder o do HTML. Se o HTML tiver rodapé, ele fica num `<footer>` **fora** das seções, no fim do `<body>`, sem conteúdo essencial só nele.

### Seções que podem ser escondidas ou mudar de ordem
No passo **Seções**, quem publica esconde partes da página (no evento todo ou numa cidade), muda a ordem e acrescenta módulos de imagem entre elas. Para funcionar:
- Cada parte fica numa `<section id="nome">` **de primeiro nível** (filha do `<body>` ou do `<main>`, não dentro de outra `<section>`).
- Nome claro: `aria-label` na `<section>` ou um `<h2>` dentro dela.
- Links para a seção usam `href="#nome"`; quando ela é escondida, o publicador tira os links junto.
- Cada seção se sustenta sozinha (fundo, cor, espaçamento) e o layout fica bonito sem ela e em outra ordem.
- Duas versões de um mesmo módulo (ex.: "Visite · roteiro" e "Visite · uma cidade") podem vir as duas: quem publica esconde a que não usar.

---

## 9b. Pós-evento (HTML opcional)

Depois do evento, a página pode trocar de HTML **no mesmo endereço** (resultados, fotos, agradecimento), enviado no passo **Pós-evento**:

| Formato | HTML de pós-evento | Entra no lugar de |
|---|---|---|
| One page | um (`pos_unica`) | o index.html |
| Tapume + praça | um (`pos_praca`), usado em cada praça | a página de cada cidade em que for ligado |
| Tapume + praça + etapa | `pos_praca` e/ou `pos_etapa` | a página da cidade e/ou da etapa |

- Segue **o mesmo guia**. As variáveis da base vêm do Cadastro.
- As variáveis **próprias** começam com `pos_`: `@pos_titulo`, `@pos_texto`, `@link_pos_resultados` (aparecem no passo Pós-evento).
- Imagens em `_media/pos/<secao>/`. Fotos do evento: `<!-- @repetir galeria_pos -->…<!-- @fim -->` (seção 1.4).
- Entregue como `pos-evento.html`. Passo a passo completo: `POS_EVENTO.md` (enviado junto com este guia).

---

## 10. Bloco de documentação (obrigatório no fim de cada HTML)

```html
<!--
  VARIÁVEIS — [nome do evento] — [tapume | praça | etapa | One page]
  Gerais: @evento, @ano
  Base usadas: @cidade, @uf, @status, @data_inicio, @data_fim, @local, @gratuito, @preco_vista, @link_inscricao
  Próprias deste evento:
    @horario_largada — "6h30"; vazio = "A confirmar" e contagem só pela data
    @destaque        — "sim" na cidade atual (One page)
  Textos (planilha de textos): seções e quantidades (faq1…12, sala1…6, tema1…8)
  Textos lidos pelo JavaScript (bloco data-textos): aviso_ok, aviso_erro, carteira_msg (mantém {nome})
  Imagens e vídeos:
    @img_kit_selo          — _media/praca/kit/selo.svg
    @media_hero_desktop_1  — _media/praca/hero/, imagem ou vídeo, muda em cada cidade
    @media_curador_video   — _media/pagina/curador/ (pasta própria; vazia = sem vídeo)
    @arquivo_infos_regulamento — _media/praca/infos/ (só o PDF)
  Galerias: galeria_cidades (por cidade, abas), galeria_geral (todas)
  Webhooks: @webhook_aviso (avise-me), campos enviados: email, whatsapp, cidade, aceite
  Avisos esperados do verificador: svg-embutido (rodas animadas da carreta, de propósito)
  Opcionais: O2 Prime não usado neste evento.
-->
```

---

## 11. Formulários e webhooks

Formulários (avise-me, quiz, carta, inscrição em lista) enviam para um endereço que fica numa variável (`@webhook_aviso`, `@webhook_carta`), cadastrada no publicador:
- Envie com `fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(dados) })`. **Nunca** coloque e-mail, telefone ou nome na URL (sem GET com dados pessoais).
- Guarde a URL num atributo do formulário (`<form data-webhook="@webhook_aviso">`) e leia no script.
- Envie junto o contexto: `evento`, `ano`, `cidade`, `uf`; com consentimento, `aceite: true` e `aceiteEm` (data/hora ISO).
- E-mail e WhatsApp validados no navegador (WhatsApp com 10 ou 11 dígitos, máscara opcional); o botão só envia com os campos obrigatórios e o aceite marcados.
- Todos os textos (rótulos, exemplos, erros, "enviado!", "não deu para enviar") são variáveis (seção 1.8a).
- No tapume, o avise-me é **por cidade**: o formulário abre dentro do card depois de clicar no botão, e envia a cidade daquele card. Use `[hidden]{display:none !important}` se o CSS do formulário define `display`.
- O webhook precisa aceitar POST com CORS (isso é do lado de quem mantém o n8n/servidor).

---

## 12. Regras obrigatórias: preço, gratuito e status

Esta seção vale acima de qualquer outro trecho do guia. O publicador só entende preço, gratuito e status escritos **exatamente** nos modelos abaixo.

### 12.1 Como o publicador decide
Os blocos são comentários HTML lidos **antes** de a página existir. O navegador e o JavaScript não participam.
```
<!-- @se gratuito = sim -->  …mostra se a cidade é gratuita…
<!-- @senao -->              …mostra nos outros casos…
<!-- @fim -->
```
- `@se coluna = valor`: compara com o valor da coluna (sem diferenciar maiúsculas e acentos). `@se coluna`: verdadeiro se preenchida. `@se coluna != valor` também existe.
- Todo `@se` termina com um `@fim`. O `@senao` é opcional.
- Dentro do `@se`, o nome **sem** `_1` e sem `@`: `@se gratuito = sim`.

### 12.2 Preço com gratuito: copie exatamente
**Ordem obrigatória: primeiro o gratuito, depois o preço, por último "A confirmar".**
```html
<!-- @se gratuito = sim -->Evento gratuito<!-- @senao --><!-- @se preco_vista -->R$@preco_vista_1<!-- @senao -->A confirmar<!-- @fim --><!-- @fim -->
```
Frase de apoio:
```html
<!-- @se gratuito = sim -->Sem custo de inscrição.<!-- @senao --><!-- @se preco_vista -->À vista, com o kit incluso.<!-- @senao -->Valor divulgado na abertura das inscrições.<!-- @fim --><!-- @fim -->
```
Você pode mudar os **textos** (e torná-los variáveis). Não mude a **estrutura**. Parcelado: troque só o miolo (`<!-- @se valor_parcelado -->@{parcelamento_1}x R$@valor_parcelado_1<!-- @senao -->A confirmar<!-- @fim -->`).

### 12.3 Status da cidade
| Valor | Significado |
|---|---|
| `em breve` (padrão) | Inscrições ainda não abertas |
| `aberta` | Inscrições abertas |
| `realizado` | A etapa já aconteceu |
| `esgotado` | As vendas acabaram depois de abertas (preços do Odoo). Página e botões continuam abertos; só o preço muda |

No **modo automático** (Cadastro → "Status pelas datas"), a cidade vira `realizado` sozinha depois do último dia mais as horas configuradas. Cidade "em breve" não abre no site publicado (leva para a home).

Trate os casos com `realizado` primeiro:
```html
<!-- @se status = realizado -->
  <div class="card card--realizado">…</div>
<!-- @senao --><!-- @se status = aberta -->
  <a class="card" href="@url">…</a>
<!-- @senao -->
  <div class="card card--breve">…</div>
<!-- @fim --><!-- @fim -->
```
- **Não calcule status, "próxima parada", "acontecendo agora" ou "realizado" por JavaScript.**
- **Esgotado:** onde o HTML testa `@se status = aberta`, a cidade esgotada entra no bloco da aberta. Para mostrar o esgotado, teste-o **antes**, só onde muda (preço, etiqueta do card):
```html
<!-- @se status = esgotado --><b class="preco">@preco_esgotado</b><!-- @senao -->… preço normal …<!-- @fim -->
```
- Contagens: `@total_aberta`, `@total_breve`, `@total_realizado`, `@total_esgotado`, `@total_cidades`. Não crie variável começando com `total_`.

### 12.4 Proibido
| Não faça | Por quê |
|---|---|
| Testar `preco_vista` antes de `gratuito` | Cidade gratuita com preço preenchido mostraria o preço |
| Montar preço, gratuito ou status em JavaScript, ou escrever "gratuito"/"a confirmar" dentro de `<script>` | O publicador não roda JS (verificador: `decisao-em-script`) |
| Guardar a decisão em atributo (`data-gratuito="@gratuito_1"`, `data-status`) e esconder com CSS/JS | Use `@se` (`decisao-em-atributo`) |
| "A confirmar", "R$ 150" ou "Gratuito" fixo fora dos blocos | Não muda por cidade |
| "A confirmar" fora do `@senao` do próprio dado, ou enfeitado | Texto simples no `@senao` do dado |
| `@se gratuito_1`, `@se @gratuito`, `@se gratuito == "sim"` | Escreva `@se gratuito = sim` (`sintaxe-se`) |
| `@se` dentro de string JS, `<template>`, atributo ou tag | Só vale como comentário HTML no corpo |
| Outro nome para dado da base (`gratis`, `valor`, `preco`, `data`, `link`) | `nome-fora-da-base` |
| Status `aberto`, `abertas`, `open` | O valor é `aberta` (`status-invalido`) |
| `scrollIntoView(…)` | O site abre no meio. Role só a barra: `barra.scrollTo({ left: aba.offsetLeft - 16 })` |
| Texto visível direto no HTML ou no JavaScript | Não aparece no cadastro (`texto-fixo`) |
| `<svg>` de ícone/ilustração estática no HTML | Não pode ser trocado (`svg-embutido`) |
| Imagem, vídeo ou fonte em base64 | Página pesada demais (`base64`) |
| Arquivo fora de `_media` ou caminho montado no JS | O publicador não publica (`midia-fora-da-pasta`) |
| `@media_` dentro de `<picture>` | `midia-em-picture` |
| Título dividido em vários campos | `texto-dividido` |
| Itens de uma série com campos diferentes | `lista-desigual` |
| Rótulo fixo como variável dentro de `@repetir cidades` | Vira coluna vazia em cada cidade (1.8b) |
| Mídia sem número numa pasta compartilhada | Pega o arquivo de outro lugar (seção 9) |
| `@var` colado depois de `.` ou `-` | Não é lido (2.1) |
| "2 cidades", "3 etapas" escritos | Use `@total_cidades`, `@total_etapas` |

### 12.5 Conferência antes de entregar o HTML
- [ ] Toda ocorrência de `@preco_vista_1` ou `@valor_parcelado_1` está dentro de um `<!-- @se gratuito = sim -->…<!-- @senao -->`
- [ ] Nenhum `<!-- @se preco_vista -->` antes do `<!-- @se gratuito = sim -->` do mesmo trecho
- [ ] As palavras `gratuito`/`gratuita` e "a confirmar" não aparecem em nenhum `<script>`
- [ ] "A confirmar" só aparece depois de um `<!-- @senao -->`
- [ ] Número de `<!-- @se` + `<!-- @repetir` + `<!-- @agrupar` = número de `<!-- @fim`
- [ ] Status testado com `@se status = realizado` / `aberta` (sem JavaScript)
- [ ] Nenhuma variável própria começa com `total_`
- [ ] Nenhum `scrollIntoView`

---

## 13. JavaScript que convive com o publicador

O publicador mexe na página depois que o HTML é escrito: esconde seções, muda a ordem, tira itens vazios, troca `<img>` por `<video>`, junta um módulo de imagem entre seções e roda a página dentro de um quadro na prévia. O script precisa aguentar tudo isso:
- **Nada é garantido na página.** Antes de usar um elemento, confira: `const s = document.querySelector('#galeria'); if (!s) return;`. Seção escondida = seção inexistente.
- **Escopo por componente.** Ouça cliques só dentro do componente: `document.querySelectorAll('.sala .abas button')`, não `'.abas button'` (abas de outro módulo com a mesma classe disparavam o código errado e quebravam a página).
- Conte itens pelo DOM (`querySelectorAll('.item').length`), nunca por número fixo.
- Use classes e `data-` próprios para o script; não dependa de posição (`children[2]`).
- Não leia dados pelo `id` de seção que pode mudar de ordem; não assuma a seção de cima.
- Bibliotecas por CDN com versão fixa (`lenis@1.1.20`, `gsap@3.12.5`); a página funciona se a biblioteca não carregar.
- Sem `localStorage`/`sessionStorage` para nada essencial (a prévia não guarda).
- Sem `scrollIntoView`; sem formatar datas ou decidir status/preço.

---

## 14. O que o publicador já faz (não coloque no HTML)

| Não coloque | Quem faz |
|---|---|
| Google Tag Manager, Analytics, pixels | Passo **SEO** (o código do GTM entra só no site publicado, nunca no teste) |
| `<meta name="robots">`, `<link rel="canonical">`, sitemap | O publicador: teste sem indexação, produção com canonical, `robots.txt` e `sitemap.xml` |
| Favicon, `og:image`, `og:title`, `twitter:*` fixos | Passo **SEO** (por página, com herança); o HTML pode ter `<title>` e `<meta name="description">` com variáveis, que servem de padrão |
| Seção de patrocinadores | Passo **Patrocínios** |
| `target="_blank"` / `rel="noopener"` | Automático para links externos |
| `?v=123` em imagens para limpar cache | Automático a cada publicação |
| Redirecionar cidade "em breve" | Automático no site publicado |
| Rodapé institucional da Norte | Rodapé padrão (passo **Seções**) |

---

## 15. Entrega (pacote para o publicador)

Entregue uma pasta (ou `.zip`) com:
```
index.html            ← One page, ou tapume.html + praca.html (+ etapa.html), (+ pos-evento.html)
_media/               ← tudo o que o HTML usa, em _media/<pagina>/<secao>/
<evento>-textos.csv   ← os textos gerais: variavel;valor
<evento>-cidades.csv  ← as cidades: cidade;uf;status;local;data_inicio;… (colunas da base + próprias)
galeria-fotos/        ← fotos das galerias, por cidade (com legendas.txt, se houver)
patrocinadores/       ← logos, para cadastrar no passo Patrocínios
seo/                  ← imagem de compartilhar e favicon
LEIA-ME.txt           ← passo a passo e o que muda em cada campo
```
**Planilhas** (UTF-8, separador `;`, primeira linha com os nomes):
- Textos: duas colunas, `variavel;valor`, uma linha por variável **geral**, com o valor de exemplo/real (o texto do layout). Valor com `;`, aspas ou quebra de linha vai entre aspas, com aspas dobradas (`"Ele disse ""oi"""`). Formatação no valor só com as tags da seção 2.3.
- Cidades: uma coluna por variável da cidade, **com os nomes da base sem `_1` nem `@`** (`cidade`, `status`, `preco_vista`), datas em `dd/mm/aaaa`, `gratuito` = `sim` ou vazio, `status` = `aberta`, `em breve`, `realizado` ou `esgotado`.
- Também vale um `.xlsx` com as abas **Gerais** (`campo`/`valor`) e **Cidades**.

**Ordem no publicador:** 1) passo Páginas: os HTMLs e a pasta `_media`; 2) Cadastro → Importar planilha: cidades, depois textos (campos que não existem no HTML são ignorados, por isso o HTML vai antes); 3) Mídia: galerias, vídeos e PDFs; 4) Patrocínios, Seções, SEO; 5) Conferir e Publicar (sempre no teste antes da produção).

O passo Páginas roda o **verificador** e lista os problemas com a linha. Entregue com zero problemas, ou explique no bloco de documentação o aviso que ficou de propósito.

---

## 16. Checklist antes de entregar

- [ ] **Todo texto visível é variável**, inclusive os do JavaScript (bloco `data-textos`) (1, 1.8)
- [ ] Um texto = um campo; destaques por classe que funciona em `<span>` (1.1, 2.3)
- [ ] Nomes: minúsculas, partes começando com letra, número de série colado na palavra, `_1` só para "da cidade" (2)
- [ ] Nenhum `@var` depois de `.` ou `-`; nenhum `@var` esperado dentro de valor de outro campo (2.1, 2.2)
- [ ] Séries numeradas com `@se`, espaços sobrando e **os mesmos campos** em todos os itens (1.1)
- [ ] Rótulos fixos fora de `@repetir cidades` (bloco escondido + `data-r`) (1.8b)
- [ ] Todo link usa variável; PDF com `@arquivo_` na **sua própria pasta** (1.2)
- [ ] Ícones e ilustrações como arquivo em `_media`; `<svg>` só para desenho animado, registrado na documentação (1.3)
- [ ] Lugar de imagem opcional some sem moldura vazia (`@se` + `:has`) (1.3)
- [ ] Galerias com `@repetir galeria_<nome>` (um item só), uma por módulo; seção some sem foto (1.4)
- [ ] Botões da mesma ação sincronizados; contagens com `@total_…` (1.5)
- [ ] Animações com `IntersectionObserver` e `prefers-reduced-motion`; loader nunca trava (1.6)
- [ ] Conferido em 360, 390, 768, 1024, 1280 e 1440 px, sem rolagem horizontal (1.7)
- [ ] Nomes da base sem variação; preço com "R$" no HTML e variável só com número (3)
- [ ] Preço, gratuito, status e "A confirmar" pelos padrões das seções 4 e 12
- [ ] Datas pelas variações do nome, nunca formatadas por JavaScript (4)
- [ ] Tapume com **um card só** entre `@repetir cidades` e `@fim`, com realizado, aberta e em breve (7)
- [ ] Todo `@se`, `@repetir` e `@agrupar` tem o seu `@fim`
- [ ] CSS de partes opcionais com `:only-of-type` / `:nth-of-type` / `:has()` (4)
- [ ] Mídia em `_media/<pagina>/<secao>/`; sem base64 (nem fontes); nenhum caminho montado no JS (9)
- [ ] Mídia opcional ou única em pasta própria; espaços que sobram com nome terminado em número (9)
- [ ] Vídeo para assistir com controles e som pelo script; desktop/mobile em duas tags (9)
- [ ] Cada parte numa `<section id>` de primeiro nível; JavaScript aguenta seção escondida e cliques com escopo (9, 13)
- [ ] Formulários com POST JSON para `@webhook_…`, sem dado pessoal na URL (11)
- [ ] Nada do que o publicador já faz: GTM, robots, canonical, patrocinadores, `target="_blank"` (14)
- [ ] Bloco de documentação no fim do HTML (10)
- [ ] Pacote completo com planilhas e LEIA-ME (15); verificador sem problemas
- [ ] Conferência da seção 12.5 feita
