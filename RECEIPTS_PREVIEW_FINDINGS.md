
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
