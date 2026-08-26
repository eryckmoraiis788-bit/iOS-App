
## Correção de fidelidade temporal e visual

A nova revisão reduziu a escala do círculo, do check e dos elementos do detalhe para proporções mais próximas do print do iPhone, manteve o cabeçalho e os dois botões na mesma hierarquia e conservou o botão de compartilhamento desativado.

O ID exibido agora é determinístico, começa com `E004`, incorpora a data e o horário do evento e não expõe diretamente o identificador nativo. Para notificações imediatas, o comprovante usa `createdAt`; para notificações agendadas, usa `scheduledAt` quando disponível. O preview confirmou a exibição de `25/08/2026` e `19h07` no registro imediato e foi preparado para validar o horário programado no registro agendado.

## Campos editáveis persistentes

O preview confirmou que o detalhe exibe o valor como ação editável e os campos Nome, CPF/CNPJ e Instituição como ações independentes, com indicador de edição. O registro de teste mostrou o nome extraído da notificação e um documento mascarado com números centrais gerados para aquele comprovante.

## Edição no detalhe

O preview confirmou que tocar no valor abre um editor modal com campo numérico e ações Cancelar/Salvar. O campo aceitou `123,45`; a validação do salvamento ainda precisa ser concluída, seguida de verificações equivalentes para Nome, CPF/CNPJ e Instituição.

O valor foi salvo como `R$ 123,45` e permaneceu após recarregar a rota do comprovante. Os campos Nome, CPF/CNPJ e Instituição continuaram tocáveis e editáveis, confirmando o comportamento persistente no preview web.

## Fonte e máscara na correção 1.2.69

O preview mostrou o comprovante com pesos tipográficos reduzidos para o padrão de negrito do sistema usado na referência antiga. O documento passou a aparecer no formato `***.182.515-06`, com três asteriscos iniciais, seis números centrais e dois dígitos finais visíveis, em vez do formato incorreto com asteriscos no final.

O editor de CPF/CNPJ também abre com o mesmo formato corrigido, permitindo manter a máscara ao salvar.

A edição de teste `123456789` foi salva e exibida como `***.234.567-89`, confirmando três asteriscos iniciais, seis números centrais, ponto entre blocos e dois dígitos finais visíveis, exatamente no padrão da referência antiga.

## Referência superior definitiva

A imagem enviada pelo usuário passa a ser a referência visual principal para o topo do comprovante. A composição deve manter o cabeçalho com voltar à esquerda, título centralizado e início à direita; o círculo verde grande com check centralizado; a sequência vertical com espaçamento amplo entre círculo, `Pix enviado` e o valor; e o peso tipográfico uniforme da referência antiga. O bloco de referência mostra o círculo ocupando aproximadamente 64 pontos lógicos em um iPhone de 393 pontos de largura, com o título e o valor centralizados e sem deslocamento horizontal.

## Revisão do topo após o ajuste definitivo

O preview atualizado mostra o cabeçalho, círculo verde de 64 pontos, check ampliado, `Pix enviado` e valor centralizados. O padding superior extra foi removido para aproximar o círculo da posição da referência. A máscara exibida continua no padrão `***.234.567-89`.

## Captura física da build 1.2.71/build 191 — diagnóstico confirmado

A captura enviada pelo usuário após instalar a build 191 mostrou que a seta de voltar, o atalho de início e o check continuavam como ícones de interrogação laranja/branco. A causa foi confirmada no código: o iOS resolve `components/ui/icon-symbol.ios.tsx`, que não havia recebido os aliases `arrow-back`, `house.fill`, `check` e `receipt`; nomes ausentes eram convertidos para `help-outline`.

A mesma captura mostrou a área do status bar em cinza-claro, enquanto o corpo do comprovante permanecia branco. O `StatusBar backgroundColor` isolado não é suficiente para controlar a área segura no iOS. A próxima build aplica branco explicitamente ao container externo e à `SafeAreaView` da tela.

A captura também confirma que a build 191 manteve os dados de data, horário, ID, nome, CPF/CNPJ e instituição, além de não exibir os lápis extras. Esses pontos não devem ser tratados como equivalência visual completa: a build 191 não foi aprovada, porque os ícones principais e a faixa superior ainda divergiam da referência.

A build 1.2.72/build 192 foi criada exclusivamente para corrigir o caminho nativo real dos ícones e o fundo da área segura, mantendo a persistência e a edição por toque sem alterar a identidade visual geral.

## Comparativo lado a lado — IPA 1.2.72 versus projeto antigo

A captura lado a lado confirma que os ícones principais já foram corrigidos, mas a tipografia da IPA ainda está maior e mais pesada do que a referência antiga. A diferença é mais evidente em `Comprovante`, `Pix enviado`, o valor e `Sobre a transação`. A referência usa uma escala visual menor e mais compacta, com títulos fortes porém menos volumosos.

A referência antiga usa conteúdo com margem horizontal maior: os rótulos começam mais para dentro e os valores terminam antes da borda. Na IPA, os rótulos estão próximos demais das laterais. O ID também quebra em duas linhas na IPA, enquanto aparece em uma linha na referência; isso é consequência combinada da fonte/tamanho e da largura interna disponível.

A distância vertical na IPA fica excessiva após o círculo e entre o bloco da transação e o bloco `Quem recebeu`. A referência mostra o círculo, `Pix enviado` e o valor em uma composição mais compacta. A linha divisória tracejada da referência também precisa permanecer visível entre as duas seções. Como consequência do conteúdo mais alto e do ID quebrado, os botões inferiores não aparecem na captura da IPA, enquanto aparecem na referência.

O ícone de início ainda difere na forma: a IPA usa casa preenchida e a referência usa casa contornada. Isso é uma diferença de ícone, não de fonte, e deve ser corrigido sem alterar a seta e o check já aprovados na build 192. O nome, documento, instituição, valor, data, horário e ID podem variar conforme o comprovante emitido; a comparação tipográfica deve usar a hierarquia visual, não substituir esses dados por valores fixos.

Medidas-alvo controladas para a próxima revisão: cabeçalho menor, título/valor do Pix em torno de 25 pt, título de seção em torno de 20 pt, dados em torno de 15–16 pt, margem horizontal em torno de 24 pt, ID em uma linha quando possível e redução dos intervalos verticais sem remover edição, persistência, compartilhamento desativado ou o botão de novo Pix.

## Comparativo inferior — IPA 1.2.73/build 193 versus projeto antigo

A captura lado a lado confirmou quatro divergências principais na parte inferior: o divisor tracejado não ficava visível na IPA; a seção `Quem recebeu` e seus campos estavam deslocados em relação à referência; os valores inferiores precisavam permanecer em uma linha para reproduzir o alinhamento; e os botões não correspondiam ao bloco antigo. Na IPA, `Compartilhar comprovante` aparecia desbotado porque o `Pressable` nativo estava com `disabled`, e `Realizar novo Pix` aparecia sem o contorno e sem a largura da referência.

A build 1.2.74/build 194 aplica altura e cor explícitas ao divisor, compacta as linhas da seção inferior, força os valores a uma linha e faz os dois botões ocuparem toda a largura interna. O compartilhamento continua sem ação funcional, mas agora mantém a aparência laranja da referência; o novo Pix conserva fundo branco, borda laranja clara e texto centralizado.

A diferença entre `Eryck` na IPA e `Eryck Darlisson dos Santos Morais` no projeto antigo é conteúdo do destinatário, não uma fonte fixa: a implementação continua usando o nome extraído da notificação e não deve inserir um nome hardcoded. A diferença entre `***.059.644-80` e `***.484.813-**` também é intencional nesta versão: o projeto atual segue o requisito definido anteriormente de gerar números variáveis e manter dois dígitos finais visíveis.

## Máscara e botões — IPA 1.2.76/build 196

A captura física confirmou que a IPA ainda mostrava `***.059.644-80`, enquanto o projeto antigo mostra três asteriscos iniciais, seis números centrais e dois asteriscos finais, como `***.484.813-**`. A normalização foi alterada para ocultar sempre os dois dígitos finais, inclusive ao carregar comprovantes antigos ou salvar uma edição.

A captura também confirmou que `Compartilhar comprovante` estava visualmente esmaecido e que `Realizar novo Pix` não aparecia como o bloco contornado da referência. O compartilhamento passou a ser um bloco visual laranja, acessível como indisponível e sem ação funcional; o novo Pix passou a usar fundo branco, contorno laranja claro, largura total interna e texto centralizado.

A Action 32986610649 compilou a build 1.2.76/196 a partir do commit 003c12d. A auditoria encontrou `***.000.000-**`, `Compartilhar comprovante`, `Realizar novo Pix`, `EA7900` e `F2B16E` no `main.jsbundle`, confirmando que a correção entrou no bundle e não ficou apenas no código-fonte.

## Revisão fina inferior — IPA 1.2.77/build 197

A nova captura física confirmou que a máscara já estava correta na build 196, mas a parte inferior ainda divergía: as linhas de `Nome`, `CPF/CNPJ` e `Instituição` estavam mais espaçadas na IPA, o bloco de ações começava mais abaixo e o quadro do `Realizar novo Pix` não permanecia visível como contorno completo.

A revisão 197 reduz o intervalo das linhas da seção de recebedor para 6 pontos e cria uma superfície interna explícita no botão `Realizar novo Pix`, com altura mínima, contorno de 1,5 ponto, fundo branco, largura total e recorte de conteúdo. O compartilhamento permanece laranja, visível e sem função.

A auditoria da Action 32988945980 confirmou no `main.jsbundle` os marcadores `recipientRow`, `newPixButtonSurface`, `F2B16E`, `EA7900`, `Compartilhar comprovante` e `Realizar novo Pix`, demonstrando que essa correção foi incorporada à IPA nativa.

## Nova captura física — build 199 e grade inferior ainda desalinhada

A captura mais recente confirma que a build 199 centralizou o texto do botão `Realizar novo Pix`, mas não corrigiu a grade de recebedor. O erro persistente está entre o rótulo e o valor de cada linha: a implementação continua usando `justifyContent: space-between` com uma composição de linhas que não fixa uma coluna de valor única, e o espaçamento vertical não reproduz a cadência do print antigo.

A próxima correção deve separar a grade em duas colunas estáveis. Os rótulos devem ocupar uma coluna fixa à esquerda; os valores devem ocupar uma coluna fixa à direita, com cada linha tendo a mesma altura e o mesmo alinhamento vertical. Não se deve alterar o texto real recebido da notificação nem o botão já validado.

## Preview da grade determinística — build 200 em preparação

O preview da revisão atual mostra os rótulos em coluna fixa à esquerda e os valores em coluna única alinhada à direita. As três linhas de recebedor agora compartilham a mesma cadência, sem o `marginBottom` adicional de 6 pontos. O botão `Realizar novo Pix` permaneceu com quadro e texto centralizados.

A confirmação física continua necessária porque o iOS pode aplicar diferenças próprias de métrica e safe area; por isso a próxima IPA será nativa e versionada, sem reutilizar o bundle anterior.

## Preview da correção linha a linha — build 201 em preparação

Após separar o `Pressable` da linha visual, o preview mostra `Nome` e o respectivo valor na mesma linha, `CPF/CNPJ` e sua máscara na mesma linha, e `Instituição` e seu valor na mesma linha. O contêiner de cada par tem altura fixa de 21 pontos, direção horizontal e alinhamento vertical central; a área de toque ocupa a linha inteira sem participar do layout.

A próxima etapa é confirmar essa mesma estrutura no bundle nativo e no iPhone. O botão `Realizar novo Pix` continua intacto.

## Refinamento visual — build 202 em preparação

A rodada seguinte à comparação com as capturas antigas aplicou `marginBottom: 8` apenas nas duas primeiras linhas de `Quem recebeu`, preservando a linha visual horizontal e o overlay absoluto de toque. O divisor foi alterado de contínuo para `borderStyle: "dashed"`. O preview recarregado em 26/08/2026 exibiu Nome, CPF/CNPJ e Instituição na mesma linha de seus valores, com cadência vertical mais aberta e o divisor segmentado. O botão `Compartilhar comprovante` e o botão `Realizar novo Pix` permaneceram abaixo da seção, sem alteração estrutural.
