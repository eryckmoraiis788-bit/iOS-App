# Diagnóstico do preview — revisão inferior

O preview local foi aberto a partir do commit atual. A tentativa inicial de emitir sem preencher dados falhou corretamente; depois, com nome `Teste` e valor `3000`, o formulário gerou a mensagem `Você fez um Pix no valor de R$ 3.000,00 para Teste.` e entrou em estado `Enviando…`.

A inspeção do código atual confirma:

- `EditableInfoRow` usa `styles.infoRow` e `styles.recipientRow`, com `marginBottom: 6` na revisão 197.
- `styles.actions` usa `marginTop: 24` e `paddingBottom: 12`.
- `shareButton` é um `View` laranja sólido com 48 pontos de altura.
- `newPixButton` é um `Pressable` de 48 pontos com borda de 1,5 ponto, fundo branco, `overflow: hidden`, e contém `newPixButtonSurface` com `flex: 1`.
- A revisão 197 está no commit `784c267`, versão `1.2.77`, build `197`.

A próxima inspeção deve abrir a aba Comprovantes e o detalhe recém-gerado no preview. Não considerar a aparência final comprovada até observar a tela de detalhe renderizada, incluindo a região abaixo da instituição e os dois botões.

## Estado da emissão no preview

Após preencher `Teste` e `3000` e tocar em `Emitir Pix enviado`, o preview permaneceu em `Enviando…` por mais de um minuto. A aba `Comprovantes` continuou visível, mas o fluxo não criou um registro navegável nesta sessão web. Portanto, não foi possível usar o preview para observar o detalhe final nesta tentativa; a aparência física informada pelo usuário continua sendo a evidência principal.

## Semeadura sintética do preview

A primeira tentativa de executar a semeadura via console falhou por sintaxe; a segunda foi corrigida e gravou um registro sintético em `notification-ios-records-v1` e um comprovante em `notification-ios-receipts-v1`, ambos apenas no navegador local, redirecionando para `/comprovante?recordId=preview-record`. O registro usa nome `Teste`, valor `3.000,00`, documento `***.020.296-**` e instituição `Cloudwalk Ip LTDA` para facilitar a inspeção da região inferior.

## Evidência adicional do preview

Após semear um registro sintético, a tela `/comprovante?recordId=preview-record` renderizou o botão `Realizar novo Pix` com contorno completo no navegador. O preview também mostra o divisor, embora muito discreto. Como a captura física reportada pelo usuário continua sem o quadro do botão e sem um divisor claramente visível, a próxima correção deve retirar esses elementos de qualquer dependência do `Pressable` e do `borderStyle: dashed`: usar um contêiner visual externo para o botão e um divisor desenhado de modo explícito. A IPA 197 não deve ser considerada resolvida apenas porque o preview web está correto.
