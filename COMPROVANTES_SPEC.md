# Especificação da aba Comprovantes

A nova aba se chamará **Comprovantes** e ficará imediatamente à direita de **Agendar**, antes de **Ajustes**. Ela exibirá os comprovantes salvos localmente para as notificações emitidas.

Cada notificação imediata deverá gerar um comprovante salvo sem abrir automaticamente a tela. Cada notificação agendada deverá gerar um comprovante quando for entregue e reconhecida pelo aplicativo. Registros pendentes ou cancelados não devem aparecer como comprovantes de emissão concluída.

A tela de detalhe deve reproduzir a referência visual enviada pelo usuário: fundo branco, cabeçalho com voltar, título **Comprovante** e atalho de início; círculo verde com check; título **Pix enviado**; valor no formato monetário; seção **Sobre a transação** com **Data do pagamento**, **Horário** e **ID da transação**; seção **Quem recebeu** com **Nome**, **CPF/CNPJ** e **Instituição**; botão laranja **Compartilhar comprovante** visível, porém desativado temporariamente; e botão contornado **Realizar novo Pix**.

Os rótulos e textos apresentados na referência não serão substituídos nesta etapa. A tela poderá preencher data, horário, identificador e valor a partir do registro emitido, mantendo a hierarquia e a linguagem visual do comprovante antigo. O compartilhamento ficará explicitamente inativo, sem implementação de exportação ou envio.

A persistência será derivada dos registros locais já existentes do store, evitando uma segunda fonte de verdade. A aba deve atualizar os agendamentos ao receber foco para reconhecer notificações entregues. A identidade visual aprovada do aplicativo não será alterada.

## Correção de fidelidade

O detalhe deve usar `createdAt` para notificações imediatas e `scheduledAt` para notificações agendadas, garantindo que o dia e o horário correspondam ao evento representado. O ID mostrado ao usuário deve ser determinístico, começar com `E004` e incorporar a data/hora do evento, mantendo o aspecto de identificador Pix sem expor diretamente o identificador nativo do sistema.

A composição visual utiliza o espaço horizontal de aproximadamente 16 pontos, círculo de sucesso compacto, tipografia e espaçamentos proporcionais ao print, rolagem vertical segura e botões no final do comprovante. O texto **Compartilhar comprovante** permanece visível e desativado.
