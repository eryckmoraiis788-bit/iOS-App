
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
