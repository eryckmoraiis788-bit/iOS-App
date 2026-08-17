# Project TODO

- [x] Inspeção inicial do IPA fornecido
- [x] Definição da reconstrução em Expo SDK 54 e React Native
- [x] Plano de interface fiel aos prints e orientação retrato
- [x] Tela Compor com título, subtítulo e mensagem
- [x] Emissão imediata de notificação local
- [x] Tela Agendar com intervalos de 1, 5, 10 e 30 minutos
- [x] Entrega automática da notificação agendada pelo iOS
- [x] Tela Histórico para notificações emitidas e agendadas
- [x] Tela de agendamentos pendentes
- [x] Cancelamento de agendamento pendente
- [x] Exclusão de agendamento pendente
- [x] Solicitação e estado da permissão de notificações
- [x] Tela Ícone com escolha de imagem
- [x] Pré-visualização da imagem escolhida
- [x] Anexo da imagem à notificação local
- [x] Tela Ajustes com feedback tátil e acesso aos Ajustes do iOS
- [x] Manter modelos predefinidos fora da primeira versão
- [x] Receber e incorporar a imagem final fornecida pelo usuário
- [ ] Receber e analisar o áudio com funções adicionais
- [x] Gerar identidade de aplicativo e atualizar ícones de produção
- [x] Implementar navegação e interface visual
- [x] Implementar armazenamento local e modelo de dados
- [x] Implementar notificações locais com anexos no iOS
- [x] Implementar histórico e gerenciamento de agendamentos
- [ ] Validar fluxos no iOS em dispositivo ou build de desenvolvimento
- [ ] Confirmar a tela Compor na IPA do commit `92051c8` — continua branca
- [x] Isolar a tela Compor em uma implementação mínima para iOS
- [ ] Publicar e gerar IPA mínima de diagnóstico para teste no iPhone
- [ ] Reintroduzir os recursos da tela Compor gradualmente após validar a base
- [ ] Corrigir tela Compor em branco na IPA iOS instalada — IPA final com `ScrollView` e `useState` aguardando teste
- [ ] Criar checkpoint da primeira versão concluída

- [x] Substituir o ícone de sino pela imagem de marca enviada em todos os assets
- [x] Atualizar a marca das pré-visualizações internas do aplicativo
- [ ] Validar compilação e salvar checkpoint da versão com a nova marca

- [x] Ajustar a configuração de build standalone para instalação via SideStore
- [ ] Validar permissões e notificações locais em uma IPA assinada para SideStore
- [ ] Preparar instruções de instalação da IPA pelo SideStore

- [x] Adicionar limpeza individual de notificações no Histórico
- [x] Adicionar limpeza de todas as notificações com confirmação
- [x] Garantir que a limpeza do Histórico não cancele agendamentos pendentes

- [x] Corrigir a rolagem vertical da aba Compor até o botão Emitir notificação
- [x] Garantir espaçamento seguro acima da barra de abas

- [x] Investigar bloqueio real da rolagem da aba Compor no iPhone
- [x] Corrigir sobreposição da barra de abas e área segura
- [x] Validar acesso ao conteúdo inferior com gesto de rolagem

- [x] Isolar a causa persistente do gesto de rolagem bloqueado
- [x] Reestruturar a aba Compor com uma área rolável confiável no iPhone
- [x] Testar novamente a rolagem real e a interação com a barra inferior

- [ ] Diferenciar o comportamento da pré-visualização web do app nativo
- [ ] Gerar uma IPA standalone compatível com SideStore
- [ ] Confirmar assinatura e requisitos do SideStore
- [ ] Documentar instalação e atualização no iPhone

- [ ] Confirmar computador disponível para o build (Windows ou Linux)
- [ ] Confirmar que o SideStore já está instalado e funcional no iPhone
- [ ] Definir estratégia de build iOS sem Mac e sem Apple Developer pago
- [ ] Gerar IPA para assinatura/instalação pelo SideStore

- [x] Confirmar computador Windows disponível
- [x] Confirmar SideStore instalado e funcional no iPhone

- [x] Corrigir erro `Cannot read properties of undefined (reading CommonJS)` no app.config.ts
- [x] Configurar `eas.projectId` após a configuração Expo ser corrigida
- [x] Validar `npx expo config` e a configuração iOS antes do novo build
- [x] Repetir o build iOS em nuvem para gerar a IPA
- [x] Vincular o projeto ao EAS usando o projectId `82e285d9-9e2f-4027-9d15-6cd6841339de`
- [x] Repetir o build iOS após gravar `eas.projectId`
- [x] Resolver permissão de edição da sessão GitHub no repositório para publicar a Action (repositório antigo sem acesso)
- [x] Criar e fornecer um novo repositório GitHub pertencente à conta disponível
- [x] Publicar o projeto e o workflow SideStore no novo repositório
- [x] Publicar o projeto e o workflow no repositório `Notificacao-iOS`
- [ ] Configurar o segredo `EXPO_TOKEN` no repositório GitHub
- [x] Adaptar a GitHub Action para o fluxo de build compatível com SideStore (preparada localmente)
- [x] Validar a geração da IPA pelo novo workflow SideStore
- [x] Corrigir o runner macOS do workflow para usar Xcode 16.1 ou superior
- [x] Aplicar fallback de renderização nativa para a aba Compor
- [x] Corrigir import ausente de `useState` que causava falha de renderização — não resolveu a IPA testada
- [x] Confirmar se a IPA instalada corresponde ao commit corrigido
- [x] Publicar a correção final de `index.tsx` e gerar nova IPA
- [x] Diagnosticar e corrigir a aba Compor ainda branca no IPA mínimo `87e1cb3`, investigando rota, layout raiz e montagem inicial no iOS — rota mínima confirmada no iPhone.
- [ ] Gerar e validar uma nova IPA após a correção da tela Compor.
- [x] Publicar a tela mínima nativa no GitHub após a reautorização e disparar nova GitHub Action.
- [x] Baixar e entregar a IPA mínima gerada para teste no SideStore.
- [x] Restaurar o layout visual da tela Compor sem dependências nativas.
- [x] Reintroduzir campos e pré-visualização com validação no iOS.
- [x] Reconstruir a aba Compor fielmente aos prints: cabeçalho, logo laranja, sino, Conteúdo, campos, imagem, modelos, pré-visualização e botão.
- [x] Adicionar rolagem vertical nativa ao layout visual e reservar espaço inferior para a barra de abas.
- [ ] Reintroduzir imagem, estado local e emissão/agendamento de notificações.
- [x] Corrigir emissão no iOS quando a permissão já está autorizada, removendo a mensagem genérica de falha e expondo o erro real — correção publicada na IPA 1.0.2.
- [x] Corrigir contraste do botão Emitir notificação e conectar seu toque à emissão local — correção robusta publicada na IPA 1.0.1; validação física pendente.
- [x] Atualizar o nome exibido do aplicativo para Inter, mantendo appSlug e Bundle ID inalterados.
- [x] Gerar IPA limpa e validar emissão real no iPhone após a instalação.
- [x] Gerar IPA incremental 1.0.2 e validar configuração/compilação; teste final no SideStore pendente.
- [ ] Instalar a IPA 1.0.2 no iPhone e confirmar emissão com permissão já autorizada.
- [x] Ajustar o botão Emitir notificação exatamente como o print circulado: teal claro com texto/ícone brancos quando indisponível e cor forte somente quando habilitado; remover o disabled nativo para evitar aparência apagada.
- [ ] Confirmar a versão efetivamente instalada no iPhone e evitar confusão entre artefatos antigos.
- [x] Preparar IPA visualmente identificável, com versão incrementada para 1.0.4; geração no GitHub Actions pendente.
- [x] Corrigir falha nativa `Cannot cast 'nil' to String` removendo `subtitle` quando vazio.
- [x] Gerar IPA 1.0.3 após a sanitização dos campos opcionais; validação física sem subtítulo pendente.
- [x] Gerar IPA 1.0.4 pelo GitHub Actions no commit `347873a`.
- [ ] Instalar a IPA 1.0.4 após remover a versão antiga e confirmar visualmente o botão no iPhone.

- [x] Corrigir novamente o estado vazio do botão Emitir notificação: teal-claro mais saturado (`#7ECBC4`), texto/ícone brancos em opacidade total e teal forte somente quando título e mensagem estiverem preenchidos.
- [x] Gerar a IPA incremental 1.0.5 após a nova correção visual; confirmação física no iPhone pendente.

- [x] Corrigir definitivamente a aparência desabilitada do botão Emitir notificação: renderizar a camada visual fora do Pressable, sem `disabled`, sem `accessibilityState` desabilitado e sem opacity nativa; controlar o bloqueio somente em `handleEmit`.
- [x] Gerar IPA incremental 1.0.6 após remover a aparência desabilitada; confirmação visual física no iPhone pendente antes de prosseguir para outras opções.

- [x] Criar aba própria de Modelos predefinidos com visual consistente com o Inter.
- [x] Implementar criação e salvamento local de modelos com nome, título, subtítulo e mensagem.
- [x] Implementar uso de modelo para preencher a aba Compor, além de edição e exclusão.
- [x] Validar os fluxos da aba Modelos no preview; IPA 1.0.7 gerada no GitHub Actions e confirmação de instalação no iPhone pendente.

- [x] Corrigir o salvamento dos modelos predefinidos e garantir atualização imediata da lista, usando a lista mais recente em memória para evitar condição de corrida.
- [ ] Validar no iPhone que os modelos permanecem após fechar e reabrir o aplicativo.
- [ ] Gerar e instalar a IPA 1.0.8 com a correção do salvamento antes de prosseguir.

- [x] Ajustar a validação do formulário de modelos: Nome e Mensagem são obrigatórios; Título separado é opcional e usa o Nome como fallback.
- [x] Validar a regra do formulário com TypeScript; teste físico do salvamento na IPA 1.0.9 permanece pendente.
- [x] Gerar nova IPA 1.0.9 após a correção da validação do formulário; instalação no iPhone pendente.

- [x] Remover da aba Compor o cartão duplicado “Modelos predefinidos”, incluindo campo de nome e botão Salvar.
- [x] Manter a aba Modelos como local único para criar, listar, editar e excluir modelos.
- [x] Vincular a seleção de um modelo salvo ao preenchimento da aba Compor e adicionar atalho de Compor para a aba Modelos.
- [x] Validar o visual da aba Compor após a remoção e gerar nova IPA; geração no GitHub Actions pendente.

- [x] Restaurar na aba Compor o cartão de salvar predefinições, mantendo a mesma coleção compartilhada com a aba Modelos.
- [x] Fazer uma predefinição salva em Compor aparecer na lista da aba Modelos via NotificationStore compartilhado.
- [x] Validar a integração no código e no preview; teste físico do fluxo Compor → Salvar → Modelos → Usar/Editar/Excluir permanece pendente.

- [x] Remover da aba Modelos o formulário Novo modelo e todos os campos de criação.
- [x] Manter na aba Modelos somente a lista compartilhada de predefinições salvas em Compor.
- [x] Preservar as ações Usar, Editar e Excluir, com confirmação antes da exclusão.
- [x] Validar a nova aba Modelos com TypeScript e preview; IPA 1.1.2 gerada no GitHub Actions e teste físico pendente.

- [x] Corrigir o fluxo assíncrono de salvar modelo antes de navegar para a aba Modelos; `saveTemplate` agora aguarda a hidratação e conclui a persistência.
- [x] Recarregar a lista de modelos ao entrar em foco usando `refreshTemplates`.
- [ ] Validar no iPhone o fluxo Compor → Salvar → Modelos sem perder o modelo após instalar a IPA 1.1.3.

- [x] Rastrear por que o handler de Salvar não conclui o modelo no iPhone, incluindo validação, persistência e navegação.
- [x] Implementar confirmação visível de persistência em Compor e verificar a gravação no armazenamento antes de concluir o fluxo.
- [ ] Validar no dispositivo que o item salvo aparece e permanece após reabrir.
- [ ] Gerar nova IPA somente após confirmar a correção no projeto.

- [x] Corrigir o toque do ícone de excluir modelo no preview e no iPhone usando confirmação visual própria, sem depender de Alert nativo.
- [x] Garantir confirmação antes da exclusão e atualização imediata da lista após confirmar.
- [x] Validar no preview o fluxo de abertura da lista e preparar os botões Cancelar/Excluir; teste físico no iPhone permanece pendente.

- [x] Gerar a IPA atualizada com a correção da exclusão de modelos; Action 32044176467 concluída com sucesso.
- [ ] Instalar a IPA no SideStore e testar cancelar/confirmar a exclusão no iPhone.

- [x] Investigar e corrigir o fechamento do aplicativo ao salvar um modelo ou abrir a aba Modelos; endurecer o armazenamento, remover Alert nativo do salvamento e gerar a IPA 1.1.6 na Action 32045361681.
- [x] Corrigir novamente o salvamento de modelos após a IPA 1.1.6; remover a recarga de foco que sobrescrevia a lista compartilhada e gerar a IPA 1.1.7 na Action 32046632441.
- [x] Simplificar o gerenciamento de predefinições: remover a aba Modelos da navegação e manter salvar, listar, usar e excluir diretamente na tela Compor; IPA 1.2.0 gerada na Action 32048150700.
- [x] Ajustar o Compor para reproduzir o print enviado: Modelos predefinidos com campo opcional e botão Salvar, Pré-visualização e Emitir notificação no mesmo bloco; manter as cinco abas inferiores sem a aba Modelos; IPA 1.2.1 gerada na Action 32049831768.
- [x] Disponibilizar para teste a IPA 1.2.1, que já contém a versão atual do layout do Compor; Action 32049831768 concluída com sucesso.
- [x] Corrigir o salvamento de modelos após a nova gravação e reduzir a fonte do cabeçalho superior; IPA 1.2.2 gerada na Action 32051796495; teste físico pendente.
- [x] Usar o print IMG_0457 como referência visual: reduzir a fonte do cabeçalho superior e manter a proporção do Compor; correção publicada na IPA 1.2.2.
- [x] Auditar por que a IPA instalada ainda mostra “Notificação iOS” e o layout antigo; gerar IPA 1.2.3 com `CFBundleDisplayName=Inter`, versão 1.2.3 e build number 123 confirmados no Info.plist.
- [x] Tornar o botão Salvar independente da emissão de notificação e reduzir novamente a fonte do cabeçalho superior; IPA 1.2.4/build 124 gerada e verificada no Info.plist.
- [x] Corrigir o bloco de Modelos conforme as imagens: exibir claramente a ação Salvar, persistir antes da emissão e reduzir mais a fonte circulada no topo; marcador e botão salvam diretamente na IPA 1.2.5/build 125.
- [x] Ajustar fonte, pesos, tamanhos e espaçamentos do Compor conforme o print IMG_0457, sem regressão no salvamento de modelos.
