# Pacote de entrega para o Claude Code

## O que tem aqui

| Arquivo | Para quê |
|---|---|
| `CLAUDE.md` | Regras do projeto. O Claude Code lê sozinho a cada sessão. |
| `docs/ESPECIFICACAO.md` | Tudo o que o publicador faz hoje, em detalhe. |
| `docs/ROADMAP.md` | Fases, arquitetura, modelo de dados e decisões em aberto. |
| `docs/CASOS_DE_TESTE.md` | Comportamentos que não podem quebrar (viram testes). |
| `docs/GUIA_VARIAVEIS_HTML.md` | O guia que o canal de geração de HTML usa. |
| `referencia/publicador-atual.html` | O protótipo que funciona. Abra no navegador para comparar comportamento. |
| `exemplos/` | HTMLs reais (Makai e Combo) para testes. Inclua também uma pasta `_media` real, se puder. |

## Como começar

1. Crie uma pasta vazia para o projeto, copie este pacote para dentro e abra o Claude Code nela.
2. Antes da fase 1, resolva as decisões D1 e D2 do ROADMAP (domínio e hospedagem). As outras podem esperar.
3. Cole o prompt abaixo.

### Prompt da fase 0

```
Leia CLAUDE.md e todos os arquivos de docs/. Depois:

1. Monte o monorepo (pnpm) com packages/motor em TypeScript e Vitest.
2. Escreva primeiro os testes de docs/CASOS_DE_TESTE.md (seções A a J).
3. Implemente o motor até todos passarem, usando referencia/publicador-atual.html
   como referência de comportamento (não de estrutura de código).
4. Gere as saídas golden dos exemplos e me mostre um resumo para eu aprovar.

Não comece a interface nem a fase 1 ainda. Ao terminar, liste o que ficou
diferente do protótipo e por quê.
```

### Prompt da fase 1 (depois de aprovar a fase 0)

```
Fase 1 do docs/ROADMAP.md. Domínio: <preencher>. Hospedagem: <preencher>.
Antes de codar, me mostre o plano: telas, rotas, tabelas e como a publicação
vai funcionar. Só implemente depois que eu aprovar.
```

## Dicas

- Uma fase por vez. Peça o plano antes do código em cada fase.
- Quando algo der errado no uso, transforme em caso de teste antes de pedir a correção.
- Mudou uma regra do HTML? Peça para atualizar o guia, o verificador e os testes juntos.
