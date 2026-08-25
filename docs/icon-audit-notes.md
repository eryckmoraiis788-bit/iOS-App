# Auditoria visual dos assets do Inter

Os arquivos `icon.png` e `android-icon-foreground.png` são imagens quadradas de 1920 × 1920 px. O objetivo é manter o fundo escuro em preenchimento total e o símbolo laranja com geometria limpa, sem borda branca ou halo.

## Comparação com IMG_0059

A análise do screenshot confirmou que o tamanho do símbolo da IPA estava praticamente igual ao da referência. O símbolo da IPA foi mantido dominante, com leve redução anterior e bounding box alinhado ao quadro de referência.

## Comparação final com IMG_0060

A medição do screenshot mais recente encontrou o símbolo esquerdo em aproximadamente 109 × 107 px e o símbolo direito em aproximadamente 110 × 107 px. Portanto, tamanho e proporção da versão atual já estavam corretos e foram preservados.

O bounding box final do asset permanece `421,441,1510,1510` em um canvas de 1920 × 1920 px. A posição foi mantida nesta etapa; a correção aplicada agora é exclusivamente cromática.

As áreas internas dos fundos apresentaram valores próximos de `(45,45,45)` no ícone esquerdo e `(46,46,46)` no ícone direito. O fundo final usa `#2E2E2E`, correspondendo ao tom carvão da referência. O laranja mais frequente no símbolo direito ficou próximo de `(234,112,45)`, portanto o asset final usa `#EA702D`, um laranja mais profundo e menos amarelado que o anterior `#F07800`.

## Estado final

Os quatro assets full-color — `icon.png`, `android-icon-foreground.png`, `favicon.png` e `splash-icon.png` — foram sincronizados com a mesma imagem final. O asset monocromático do Android não foi alterado por ser uma variante específica de plataforma.

A geometria, o número de raios, a espessura, o tamanho e a posição do símbolo foram preservados. O fundo ocupa 100% do quadrado, sem transparência, borda branca, halo, gradiente, sombra ou cantos arredondados embutidos. A confirmação definitiva deve ser feita no iPhone após instalar a nova IPA, pois o SpringBoard aplica sua própria máscara e pode manter cache de versões anteriores.
