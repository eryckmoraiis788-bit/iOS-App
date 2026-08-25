# Auditoria visual dos assets atuais

Os arquivos `icon.png` e `android-icon-foreground.png` são imagens quadradas de 1920 × 1920 px e apresentam o mesmo desenho atual: fundo quase preto em preenchimento total e símbolo laranja grande, deslocado para a região inferior direita, com o leque ocupando a maior parte do quadro.

Comparação com a referência fornecida em `IMG_0058.PNG`: o símbolo atual está visualmente maior e mais aberto do que o ícone de referência à direita. A versão desejada mantém o fundo escuro full-bleed, mas reduz o símbolo laranja, aumenta a margem preta ao redor e deixa o conjunto mais compacto e centralizado. A alteração deve preservar o desenho, a cor laranja e a ausência de borda ou halo branco.

Assets que precisam permanecer sincronizados: `icon.png`, `android-icon-foreground.png`, `favicon.png` e `splash-icon.png`. O `app.config.js` usa `icon.png` no iOS, `android-icon-foreground.png` no Android, `favicon.png` na web e `splash-icon.png` na tela de abertura.

## Validação da proposta corrigida

A proposta `icon-corrected-precise.png` mantém o fundo escuro ocupando todo o canvas, sem cantos arredondados embutidos, e reduz o símbolo laranja de forma moderada, mantendo-o dominante e ancorado no canto inferior direito. A geometria permanece nítida e sem halo branco. Esta proposta é preferível às versões generativas intermediárias, que reduziram o símbolo excessivamente ou alteraram mais a composição.
