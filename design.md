# Plano de design — Notificação iOS

## Direção visual

A interface será reconstruída para manter a aparência do aplicativo fornecido: orientação retrato, fundo azul-claro acinzentado, cartões brancos com cantos amplamente arredondados, tipografia escura de alto contraste, verde-petróleo como cor de ação e navegação inferior fixa com cinco áreas. O design seguirá padrões de interface do iOS e será otimizado para uso com uma mão, mantendo os controles principais na metade inferior da tela quando possível.

## Paleta específica

| Função | Cor | Uso |
|---|---|---|
| Fundo | `#EAF4F8` | Fundo principal das telas |
| Verde-petróleo | `#0E8278` | Botões primários, aba ativa e estados selecionados |
| Verde suave | `#A9D7D4` | Botões desabilitados e cartões informativos |
| Azul-marinho | `#102F49` | Cartão de destaque e pré-visualização |
| Texto principal | `#121B24` | Títulos e conteúdo principal |
| Texto secundário | `#667580` | Descrições e legendas |
| Superfície | `#FFFFFF` | Campos, cartões e seções |
| Borda | `#D4E0E5` | Divisores e contornos |
| Sucesso | `#3CA77A` | Permissão ativa e confirmações |

## Lista de telas

### 1. Compor

Tela inicial para criar uma notificação. Exibe o cabeçalho “Criar notificação”, o cartão de destaque, os campos “Nome exibido”, “Subtítulo (Opcional)” e “Mensagem”, contadores de caracteres, acesso à imagem da notificação, pré-visualização fiel ao cartão nativo do iOS e o botão “Emitir notificação”. O botão envia a notificação imediatamente, registra o evento no histórico e fornece feedback tátil e visual.

### 2. Histórico

Lista cronológica das notificações emitidas imediatamente ou entregues por agendamento. Cada item apresenta título, subtítulo, mensagem, imagem quando disponível, tipo de envio e data/hora local. A tela deve distinguir itens emitidos e agendados e apresentar estado vazio quando ainda não houver registros.

### 3. Agendar

Formulário simplificado para programar uma notificação. Inclui título, subtítulo opcional, corpo, imagem opcional e opções de intervalo: 1 minuto, 5 minutos, 10 minutos e 30 minutos. “Agendar agora” cria uma notificação local no iOS, salva o agendamento pendente e registra a ação. A tela também contém uma seção para visualizar agendamentos pendentes, com ações de cancelar e excluir.

### 4. Ícone

Tela para escolher uma imagem quadrada usada na pré-visualização e como anexo da notificação. Apresenta a imagem atual, botão “Escolher imagem” e uma explicação de que o pequeno ícone nativo exibido pelo iOS é o ícone do aplicativo, enquanto a imagem escolhida é o anexo e o conteúdo de pré-visualização.

### 5. Ajustes

Tela com status da permissão de notificações, acesso para abrir os Ajustes do iOS, alternância de feedback tátil ao emitir, cartão informativo sobre notificações locais e versão do aplicativo.

## Navegação principal

A barra inferior terá cinco abas: **Compor**, **Histórico**, **Agendar**, **Ícone** e **Ajustes**. A aba ativa será marcada em verde-petróleo, com ícone e rótulo destacados. O cabeçalho de cada tela permanecerá consistente com os prints fornecidos.

## Fluxos principais

1. O usuário abre o aplicativo e concede a permissão de notificações quando solicitado.
2. Na tela Compor, informa nome exibido, subtítulo e mensagem.
3. Opcionalmente escolhe uma imagem e verifica a pré-visualização.
4. Toca em “Emitir notificação”.
5. O iOS exibe a notificação local imediatamente; o registro é salvo no Histórico.
6. Na tela Agendar, o usuário preenche o conteúdo e escolhe 1, 5, 10 ou 30 minutos.
7. Ao tocar em “Agendar agora”, o aplicativo agenda a entrega local e exibe o item entre os pendentes.
8. O usuário pode visualizar, cancelar ou excluir o agendamento pendente.
9. Após a entrega, o evento permanece disponível no Histórico.

## Regras de comportamento

As notificações serão locais e funcionarão sem servidor ou conta. O horário de entrega será calculado pelo sistema operacional. A indicação relativa exibida na tela bloqueada, como “há 6m” ou “há 1h”, será gerada pelo próprio iOS e não será desenhada manualmente pelo aplicativo. A imagem escolhida será copiada para uma localização local compatível com anexo de notificação e usada na pré-visualização.

Os modelos predefinidos não farão parte da primeira versão e ficarão registrados como melhoria futura.
