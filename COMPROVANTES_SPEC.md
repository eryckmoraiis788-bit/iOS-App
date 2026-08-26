# Especificação da aba Comprovantes

A nova aba se chamará **Comprovantes** e ficará imediatamente à direita de **Agendar**, antes de **Ajustes**. Ela exibirá os comprovantes salvos localmente para as notificações emitidas.

Cada notificação imediata deverá gerar um comprovante salvo sem abrir automaticamente a tela. Cada notificação agendada deverá gerar um comprovante quando for entregue e reconhecida pelo aplicativo. Registros pendentes ou cancelados não devem aparecer como comprovantes de emissão concluída.

A tela de detalhe deve reproduzir a referência visual enviada pelo usuário: fundo branco, cabeçalho com voltar, título **Comprovante** e atalho de início; círculo verde com check; título **Pix enviado**; valor no formato monetário; seção **Sobre a transação** com **Data do pagamento**, **Horário** e **ID da transação**; seção **Quem recebeu** com **Nome**, **CPF/CNPJ** e **Instituição**; botão laranja **Compartilhar comprovante** visível, porém desativado temporariamente; e botão contornado **Realizar novo Pix**.

Os rótulos e textos apresentados na referência não serão substituídos nesta etapa. A tela poderá preencher data, horário, identificador e valor a partir do registro emitido, mantendo a hierarquia e a linguagem visual do comprovante antigo. O compartilhamento ficará explicitamente inativo, sem implementação de exportação ou envio.

A persistência será derivada dos registros locais já existentes do store, evitando uma segunda fonte de verdade. A aba deve atualizar os agendamentos ao receber foco para reconhecer notificações entregues. A identidade visual aprovada do aplicativo não será alterada.

## Correção de fidelidade

O detalhe deve usar `createdAt` para notificações imediatas e `scheduledAt` para notificações agendadas, garantindo que o dia e o horário correspondam ao evento representado. O ID mostrado ao usuário deve ser determinístico, começar com `E004` e incorporar a data/hora do evento, mantendo o aspecto de identificador Pix sem expor diretamente o identificador nativo do sistema.

A composição visual utiliza o espaço horizontal de aproximadamente 16 pontos, círculo de sucesso compacto, tipografia e espaçamentos proporcionais ao print, rolagem vertical segura e botões no final do comprovante. O texto **Compartilhar comprovante** permanece visível e desativado.

## Campos editáveis por comprovante

O valor exibido abaixo de **Pix enviado** pode ser tocado e alterado. O campo **Nome** recebe inicialmente o destinatário identificado no texto da notificação e pode ser editado. O campo **CPF/CNPJ** recebe uma máscara com números centrais novos a cada comprovante criado e também pode ser editado. O campo **Instituição** começa com **Cloudwalk Ip LTDA** e pode ser alterado.

As alterações são persistidas em `notification-ios-receipts-v1`, uma fonte separada dos registros de notificações. Assim, editar um comprovante não altera o texto da notificação no Histórico. O comprovante é criado automaticamente para emissões imediatas e quando uma notificação agendada é recebida ou reconhecida como entregue.

## Máscara visual do CPF/CNPJ

O formato final deve ser `***.516.969-93`: três asteriscos no início, dois blocos de três números centrais, hífen e dois números finais visíveis. Os seis números centrais e os dois dígitos finais são gerados para cada comprovante novo; ao editar o campo, a entrada numérica é reorganizada para esse mesmo padrão.
