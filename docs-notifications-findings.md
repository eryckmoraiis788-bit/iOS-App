# Expo SDK 54 — notificações locais

Fonte local: `/home/ubuntu/notificacao-ios_helper/docs/background/notifications/DOCS.md`.

A documentação recomenda usar `expo-notifications` para agendar e cancelar notificações locais. Para emitir imediatamente, `Notifications.scheduleNotificationAsync` deve receber `trigger: null`. Para agendar por intervalo, deve usar um trigger de intervalo; para uma data específica, um trigger de data. A API de consulta é `Notifications.getAllScheduledNotificationsAsync()`, e o cancelamento individual usa `Notifications.cancelScheduledNotificationAsync(identifier)`. Para limpar todos os agendamentos, usa-se `Notifications.cancelAllScheduledNotificationsAsync()`.

A documentação também orienta manter um `Notifications.setNotificationHandler` configurado para apresentação em primeiro plano com `shouldShowBanner` e `shouldShowList`, solicitar permissões com `getPermissionsAsync`/`requestPermissionsAsync` e testar notificações em dispositivo físico. Notificações locais permanecem disponíveis no Expo Go, mas o comportamento final deve ser validado na IPA do iPhone.

Referência: Expo SDK 54 Notifications DOCS.md, linhas 344-367 e API de agendamento/cancelamento na mesma documentação.

## APIs confirmadas

Na documentação do Expo SDK 54: `cancelAllScheduledNotificationsAsync(): Promise<void>` está na linha 772; `cancelScheduledNotificationAsync(identifier: string): Promise<void>` está na linha 782; e `getAllScheduledNotificationsAsync(): Promise<NotificationRequest[]>` está na linha 907. Essas APIs serão usadas para sincronizar a lista nativa, cancelar um item e limpar todos os agendamentos.
