# Auditoria do cache de imagens do Inter

A única utilização ativa de `expo-file-system/legacy` está em `lib/notification-store.tsx`, na função `prepareAttachment`. Quando uma notificação contém `imageUri`, o aplicativo copia a imagem original para `FileSystem.cacheDirectory` com o prefixo `notification-attachment-` e usa a cópia como anexo nativo. Atualmente não existe rotina de limpeza dessas cópias.

A URI persistida em cada `NotificationRecord.imageUri` é a URI original selecionada pelo usuário, não a URI da cópia criada no cache. A imagem escolhida globalmente também é persistida em `notification-ios-image-v1` e exibida diretamente no preview da tela de personalização. O Histórico encaminha `imageUri` para reagendamento, e o fluxo de edição de agendamento também reutiliza a URI original.

A política de baixo risco definida para a próxima etapa deve, portanto, limpar apenas arquivos criados pelo próprio aplicativo com o prefixo conhecido, preservar URIs atualmente referenciadas por `selectedImage` ou pelos registros, e evitar a remoção de cópias antigas enquanto existir uma notificação agendada pendente que use imagem, porque os registros atuais não guardam a URI da cópia nativa. Arquivos recentes devem permanecer intocados por uma janela de retenção; arquivos fora do prefixo, diretórios e entradas sem metadados confiáveis nunca devem ser removidos.

A limpeza deve ser assíncrona, tolerante a falhas e não bloquear a abertura do aplicativo. Não haverá alteração visual nem remoção de imagens selecionadas pelo usuário.

## Política implementada

A implementação cria nomes de cópia com timestamp e sufixo aleatório para reduzir colisões em ações rápidas. Na abertura do aplicativo e após operações que cancelam, removem ou sincronizam agendamentos, o store enumera somente arquivos com o prefixo `notification-attachment-`.

Um arquivo só pode ser removido quando está fora da janela de retenção de sete dias, possui data de modificação confiável, não é diretório e não corresponde a uma URI protegida. A rotina protege a imagem selecionada e todas as URIs de imagem dos registros. Além disso, quando existe qualquer registro pendente com imagem, a limpeza inteira é adiada, pois o modelo atual não persiste a URI da cópia nativa usada no anexo.

A rotina captura falhas de leitura, metadados e exclusão sem interromper o boot ou o fluxo de notificações. O utilitário puro possui testes para arquivos antigos removíveis, arquivos recentes, diretórios, entradas sem data, arquivos fora do prefixo e URIs protegidas.
