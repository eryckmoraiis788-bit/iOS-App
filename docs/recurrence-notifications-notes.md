# Expo SDK 54 — recorrência de notificações locais

Fonte consultada: `/home/ubuntu/notificacao-ios_helper/docs/background/notifications/DOCS.md`.

A documentação descreve o gatilho diário com `hour`, `minute` e `repeats: true`. Para o gatilho semanal, os componentes são `weekday`, `hour`, `minute` e `type: SchedulableTriggerInputTypes.WEEKLY`; os dias usam valores de 1 a 7, sendo 1 domingo. Os gatilhos de calendário não são suportados na web e devem ser validados em IPA/dispositivo físico. A documentação também recomenda conferir permissões e informa que os componentes são validados pelo módulo nativo.

Referência externa: https://docs.expo.dev/versions/latest/sdk/notifications/
