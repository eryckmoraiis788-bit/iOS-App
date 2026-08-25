# Auditoria visual dos assets do Inter

Os arquivos `icon.png` e `android-icon-foreground.png` são imagens quadradas de 1920 × 1920 px. O objetivo é manter o fundo escuro em preenchimento total e o símbolo laranja com geometria limpa, sem borda branca ou halo.

## Comparação inicial

A comparação com `IMG_0058.PNG` indicou que a versão anterior tinha o símbolo laranja visualmente grande e aberto demais. A primeira correção reduziu o símbolo moderadamente e manteve a geometria original.

## Comparação objetiva com IMG_0059

A análise do screenshot confirmou que o tamanho do símbolo da IPA já estava praticamente igual ao da referência. No screenshot, o símbolo esquerdo mediu aproximadamente 112 × 109 px e o símbolo direito aproximadamente 110 × 108 px, dentro de ícones com dimensões equivalentes. Por isso, a correção final não faz uma redução agressiva.

A diferença principal era horizontal: no screenshot, o bounding box do símbolo esquerdo começa em aproximadamente `x=85` e o da referência direita em `x=346`, considerando os limites dos dois ícones. Normalizando cada quadrado, a referência direita deixa uma margem esquerda ligeiramente maior. O símbolo foi reposicionado no canvas de 1920 px usando bounding box final `421,441,1510,1510`, mantendo a escala praticamente igual à versão anterior.

A área interna dos dois fundos no screenshot apresentou mediana aproximada de `(45,45,45)`, equivalente a `#2D2D2D`. O laranja da referência direita apresentou mediana aproximada de `(231,113,46)` após a redução do screenshot; a cor de marca aplicada ao asset foi normalizada para `#F07800`, um laranja vivo e dourado sem transparência.

## Estado final da proposta

A proposta final mantém o símbolo dominante, reduz apenas cerca de 2,4% a largura e 2,4% a altura em relação ao asset 1.2.59, reposiciona-o para as coordenadas medidas da referência, usa fundo sólido `#2D2D2D` e usa laranja `#F07800`. Os quatro assets full-color — `icon.png`, `android-icon-foreground.png`, `favicon.png` e `splash-icon.png` — devem permanecer idênticos. O asset monocromático do Android não foi alterado porque é uma variante específica de plataforma.

A versão final foi visualizada em canvas 1:1 e não apresenta borda branca, halo, transparência, gradiente, sombra ou cantos arredondados embutidos. A confirmação definitiva da equivalência deve ser feita no ícone renderizado pelo iOS após a instalação da IPA no iPhone, pois o SpringBoard aplica sua própria máscara e pode manter cache de versões anteriores.
