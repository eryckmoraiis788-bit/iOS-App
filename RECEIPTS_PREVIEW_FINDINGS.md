
## Correção de fidelidade temporal e visual

A nova revisão reduziu a escala do círculo, do check e dos elementos do detalhe para proporções mais próximas do print do iPhone, manteve o cabeçalho e os dois botões na mesma hierarquia e conservou o botão de compartilhamento desativado.

O ID exibido agora é determinístico, começa com `E004`, incorpora a data e o horário do evento e não expõe diretamente o identificador nativo. Para notificações imediatas, o comprovante usa `createdAt`; para notificações agendadas, usa `scheduledAt` quando disponível. O preview confirmou a exibição de `25/08/2026` e `19h07` no registro imediato e foi preparado para validar o horário programado no registro agendado.
