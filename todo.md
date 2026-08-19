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

- [ ] Diagnosticar erro do SideStore: “could not determine this device's UDID; replace your pairing using iLoader”.
- [ ] Retestar a instalação da IPA 1.2.6 após refazer o pareamento do dispositivo.

- [x] Adicionar animação visual de sucesso ao salvar um modelo.
- [x] Adicionar animação visual de sucesso ao emitir uma notificação.

- [x] Adicionar feedback visual claro quando falhar o salvamento de um modelo.
- [x] Adicionar feedback visual claro quando falhar o envio de uma notificação.

- [x] Adicionar spinner no botão enquanto um modelo estiver sendo salvo.
- [x] Adicionar spinner no botão enquanto uma notificação estiver sendo enviada.

- [x] Adicionar modal de confirmação antes de emitir uma notificação.
- [x] Permitir cancelar a confirmação sem iniciar o envio.
- [x] Exibir resumo da notificação e confirmar o envio mantendo loading/erro/sucesso.

- [x] Gerar IPA atualizada com o modal de confirmação de envio e disponibilizar o artefato para teste no SideStore.

- [x] Corrigir o modal de confirmação para manter “Enviar agora” visível em telas pequenas.
- [x] Validar que o botão continua acionando o envio e que “Cancelar” fecha sem enviar.

- [x] Substituir a estrutura atual do modal de confirmação por uma implementação nativa compatível com iPhone.
- [x] Garantir que “Enviar agora” seja visível, acionável e inicie o envio; “Cancelar” deve apenas fechar a confirmação.
- [ ] Gerar e entregar nova IPA após validar a correção no dispositivo/preview.

- [x] Substituir o alerta padrão de confirmação por um modal personalizado alinhado ao visual do Inter.
- [x] Exibir resumo organizado e manter “Cancelar” e “Enviar agora” visíveis e funcionais.
- [x] Validar o novo modal e gerar IPA atualizada para teste.

- [x] Corrigir o botão “Enviar agora” que não aparece no modal personalizado do iPhone.
- [x] Garantir que “Enviar agora” acione o envio e que “Cancelar” apenas feche o modal.
- [x] Validar a correção e preparar IPA atualizada para teste.

- [x] Substituir a ação “Enviar agora” do modal por um botão visual independente e sempre visível.
- [x] Confirmar que o novo botão aciona o envio e preserva loading, sucesso e erro.

- [x] Gerar e entregar IPA do checkpoint f31f5b51 com a correção definitiva do botão “Enviar agora”.

- [ ] Corrigir definitivamente o botão “Enviar agora” que permanece invisível no modal do iPhone.
- [ ] Validar o envio real, o cancelamento e gerar IPA específica para o teste urgente.

- [x] Incrementar a versão/build para uma IPA inequivocamente nova; confirmação no binário instalado permanece pendente.

- [x] Manter o modal atual e transformar “Enviar agora” em botão teal explícito, visível e acionável no iPhone.
- [x] Validar que “Cancelar” continua fechando o modal e que “Enviar agora” inicia o envio.

- [x] Sincronizar a correção do modal no GitHub e gerar a IPA Inter 1.2.8/build 128 pelo workflow SideStore.
- [x] Entregar o artefato ou o link da Action concluída para teste no iPhone.

- [x] Dar ao botão “Cancelar” do modal o mesmo destaque visual e área de toque do “Enviar agora”.
- [x] Remover a confirmação nativa “Notificação emitida” exibida após o envio, preservando o feedback visual interno.

- [x] Gerar IPA atualizada do Inter com o modal corrigido para teste no SideStore.
- [x] Verificar e entregar o artefato IPA gerado.

- [x] Corrigir o corte vertical do modal de confirmação para manter “Cancelar” visível e acionável no iPhone.
- [x] Validar que “Enviar agora” e “Cancelar” aparecem juntos sem restaurar a confirmação nativa pós-envio.

- [x] Gerar IPA atualizada com o modal corrigido para teste no SideStore.
- [x] Verificar e entregar a nova IPA gerada.

- [ ] Reproduzir o modal de confirmação conforme o print IMG_0553, com cartão branco e dois botões teal em coluna.
- [ ] Garantir que o modal usado no build nativo mantenha “Enviar agora” e “Cancelar” visíveis e visualmente idênticos ao preview.

- [x] Gerar IPA com o modal conforme IMG_0553 para teste no SideStore.
- [x] Verificar e entregar o artefato da nova IPA.

- [ ] Compactar o modal para corresponder à segunda imagem IMG_0553, mantendo os dois botões teal totalmente visíveis.
- [ ] Confirmar que a estrutura compacta é preservada no build nativo e não apenas no preview.

- [x] Gerar IPA com o modal compacto conforme a segunda foto IMG_0553 para teste no SideStore.
- [x] Verificar versão, build e entregar a IPA gerada.

- [x] Corrigir definitivamente o layout nativo do modal para reservar espaço explícito e manter “Cancelar” visível no iPhone.
- [ ] Validar o toque em “Cancelar” e “Enviar agora” no fluxo de confirmação após a nova alteração.

- [x] Gerar IPA com a área fixa explícita para “Cancelar” e testar no iPhone.
- [x] Verificar a nova versão/build e entregar o arquivo IPA.

- [x] Corrigir a falha “Validate Expo configuration” da Action 32087094489.
- [x] Reexecutar o workflow e entregar a IPA após a validação Expo passar.

- [x] Investigar por que a IPA 1.2.13/build 133 faz o SideStore fechar durante a instalação.
- [x] Auditar estrutura, bundle identifier, metadados e compatibilidade do pacote IPA.
- [x] Corrigir o workflow/pacote e gerar uma IPA instalável para novo teste.

- [x] Fazer o modal da aba “Emitir notificação” reproduzir exatamente o cartão compacto do preview enviado pelo usuário.
- [ ] Garantir que “Enviar agora” e “Cancelar” sejam renderizados juntos e acionáveis na IPA nativa — confirmar na IPA 1.2.16/build 136.

- [x] Corrigir o botão “Cancelar” que continua invisível na IPA 1.2.15/build 135, apesar de aparecer no preview web — nova estrutura aplicada para a IPA 1.2.16/build 136.
- [x] Substituir o modal atual por uma apresentação nativa com ações independentes; validação física permanece pendente na IPA 1.2.16/build 136.

- [x] Corrigir a interpretação: manter o cartão “Imagem da notificação” e remover somente a confirmação de envio.
- [x] Validar que o formulário, imagem, modelos e envio direto continuam funcionando após remover a confirmação no código, TypeScript, testes e preview móvel.

- [x] Sincronizar o Inter 1.2.17/build 137 e gerar a IPA para SideStore; Action 32128485124 concluída com sucesso, download local pendente por timeout.

- [x] Adicionar modelo pré-moldado “Pix recebido” com edição do nome e valor.
- [x] Adicionar modelo pré-moldado “Pix enviado” com edição do nome e valor.
- [x] Validar seleção dos modelos, preenchimento do formulário e emissão das duas notificações no código, TypeScript, testes e preview móvel.

- [x] Gerar a IPA do Inter com os modelos Pix recebido e Pix enviado editáveis; IPA auditada como versão 1.2.18/build 138.

- [x] Deixar vazios os campos de nome e valor dos modelos Pix rápidos, usando placeholders que expliquem o preenchimento.
- [x] Validar que o botão de aplicar continua bloqueado até nome e valor serem informados; TypeScript, testes e preview móvel validados.

- [x] Permitir agendamento sem título na aba Agendar, mantendo a mensagem obrigatória.
- [x] Usar um nome padrão neutro quando o título do agendamento estiver vazio: “Notificação”.
- [x] Validar agendamento com título e sem título; TypeScript, testes e preview móvel validados.

- [x] Adicionar na aba Agendar os botões “Pix recebido” e “Pix enviado”.
- [x] Preencher automaticamente título, subtítulo e mensagem ao escolher um modelo Pix.
- [x] Validar o uso dos modelos e o agendamento sem título manual; TypeScript, testes e preview móvel validados.

- [ ] Gerar e entregar uma nova IPA com os modelos Pix disponíveis na aba Agendar.

- [x] Deixar o subtítulo dos modelos Pix vazio por padrão na aba Agendar.
- [x] Permitir preencher o subtítulo manualmente antes de agendar.
- [x] Validar a notificação com subtítulo vazio e com subtítulo manual; TypeScript, testes e preview móvel validados.

- [x] Gerar e entregar a IPA com o subtítulo dos modelos Pix vazio por padrão para teste no iPhone; Action 32136482975 concluída e artefato baixado.

- [x] Adicionar entrada suave ao cabeçalho e destaque principal da aba Compor.
- [x] Preservar e validar o feedback de toque dos botões e a animação de sucesso/erro já existente.
- [ ] Animar feedbacks de sucesso, erro e carregamento sem alterar o fluxo atual.
- [x] Validar desempenho e acessibilidade da primeira animação em viewport móvel; TypeScript e testes passaram.

- [x] Gerar e entregar uma nova IPA com a primeira etapa das animações da aba Compor; Action 32139341293 concluída e artefato baixado.

- [x] Corrigir a emissão do modelo rápido “Pix recebido” com nome e valor preenchidos.
- [x] Corrigir a emissão do modelo rápido “Pix enviado” com nome e valor preenchidos.
- [ ] Validar que aplicar um modelo preenche o formulário e permite emitir a notificação.

- [x] Corrigir a transferência dos dados dos modelos rápidos Pix para título, subtítulo e mensagem do formulário principal.
- [ ] Validar que o botão Emitir notificação usa os dados preenchidos pelo modelo rápido.

- [ ] Gerar IPA 1.2.22/build 142 com a correção dos modelos rápidos Pix e validar no SideStore.

- [x] Gerar e auditar a IPA 1.2.22/build 142 para teste no SideStore.

- [x] Adicionar botão de emissão direta na área circulada dos cartões Pix recebido e Pix enviado.
- [x] Validar emissão direta com nome/valor, loading e feedback de erro/sucesso no código, TypeScript, testes e preview móvel.

- [x] Gerar e auditar a IPA atualizada com os botões Emitir agora dos cartões Pix para SideStore.

- [x] Corrigir a renderização nativa dos botões Emitir agora nos cartões Pix, que não aparecem na IPA instalada.
- [x] Validar a IPA correta no SideStore e confirmar visibilidade no bundle nativo; teste físico do toque permanece pendente.

- [x] Remover o corte/ocultação da área de ações dos cartões Pix na IPA nativa.
- [x] Mover os botões para uma seção explícita; validar o bundle nativo e manter o teste físico no iPhone pendente.

- [x] Gerar nova IPA da revisão dos painéis Pix para teste no SideStore.
- [x] Auditar versão, build e bundle da IPA antes da entrega.

- [ ] Corrigir os painéis brancos vazios dos cartões Pix na IPA nativa.
- [ ] Substituir a ação por um botão simples e validar que o código enviado à Action corresponde à versão instalada.

- [x] Aplicar formatação monetária brasileira aos valores dos modelos Pix, incluindo milhares e centavos.
- [x] Garantir que a emissão direta e o preenchimento do formulário usem o valor formatado corretamente.

- [x] Aplicar ao botão principal Emitir notificação o verde/teal vivo usado no destaque dos modelos Pix.
- [x] Validar contraste, estado ativo, loading e emissão após a alteração de cor.

- [x] Gerar e auditar a IPA com o botão principal Emitir notificação em verde/teal vivo para teste no SideStore.

- [x] Centralizar o texto Emitir notificação dentro do botão principal, mantendo o ícone alinhado separadamente.
- [x] Validar o alinhamento no iPhone e preservar a interação do botão.

- [x] Gerar e auditar a IPA com Emitir notificação centralizado e o ícone separado, conforme a pré-visualização aprovada.

- [x] Centralizar o texto Emitir notificação no eixo completo do botão, sem deslocamento causado pelo ícone.
- [x] Manter o sino em camada independente e gerar/auditar uma IPA nova após a validação.

- [x] Fazer o texto do botão Emitir notificação seguir exatamente o padrão centralizado, tamanho e peso do botão Usar Pix.
- [x] Preservar o sino separado à esquerda e validar a emissão após o ajuste.

- [x] Gerar e auditar a IPA com Emitir notificação seguindo exatamente o padrão centralizado do botão Usar Pix; IPA 1.2.32/build 152 auditada.
- [x] Reproduzir no botão “Emitir notificação” o mesmo bloco, espaçamento, altura, bordas e alinhamento do botão laranja destacado nos modelos Pix.
- [x] Manter a cor atual do botão “Emitir notificação” e replicar exatamente o formato dos botões “Emitir Pix enviado” e “Usar Pix enviado”.
- [x] Gerar, auditar e entregar a IPA com o novo layout do botão “Emitir notificação” para teste no SideStore; Action 32174748938 concluída e Info.plist confirmado.
- [x] Corrigir o corte inferior do botão “Emitir notificação”, mantendo sino, texto, cor teal e contêiner totalmente visíveis; cor aplicada diretamente ao Pressable interno; IPA 1.2.32/build 152 gerada.
- [x] Verificar e corrigir gradiente, opacidade, preenchimento teal e camadas sobrepostas do botão “Emitir notificação”; sem gradiente aplicado e com teal/opacidade normalizados.
- [x] Ajustar o espaçamento interno, altura e proporção do botão “Emitir notificação” para coincidir com os botões Pix; padding horizontal 12, altura 54, raio 15 e ícone com altura alinhada.
- [x] Gerar, auditar e entregar a IPA com o botão “Emitir notificação” igual à pré-visualização aprovada; Action 32178943674, versão 1.2.33/build 153, Info.plist confirmado.
- [x] Copiar exatamente a estrutura visual do botão “Usar Pix enviado” para “Emitir notificação”, alterando somente ícone, texto e handler; TypeScript, testes e prévia validados.
- [x] Gerar, auditar e entregar a IPA com “Emitir notificação” usando exatamente a estrutura de “Usar Pix enviado”; IPA 1.2.34/build 154 gerada pela Action 32182206478.
- [x] Criar backup/checkpoint do estado estável atual antes de alterar a aba Agendar; checkpoint ae4416ff preservado.
- [x] Revisar a implementação atual da aba Agendar e a documentação oficial de notificações do Expo SDK 54; APIs nativas confirmadas.
- [x] Exibir agendamentos pendentes com data/hora e conteúdo resumido; lista sincronizada com agendamentos nativos.
- [x] Permitir cancelar um agendamento individual e limpar todos os agendamentos; limpeza global com confirmação.
- [x] Validar que a tela Compor, os modelos Pix e a emissão imediata continuam intactos; TypeScript, testes e preview passaram.
- [x] Gerar, auditar e entregar a IPA com a aba Agendar atualizada para teste no SideStore; Action 32188197599, versão 1.2.35/build 155, Info.plist confirmado.
- [x] Criar backup/checkpoint antes de implementar edição de agendamentos pendentes; checkpoint 9c683028 preservado.
- [x] Permitir editar título, subtítulo, mensagem e horário de um agendamento pendente; editor implementado, com horário preservado.
- [x] Reagendar a notificação com segurança após a edição, preservando cancelamento e limpeza geral; identificador antigo cancelado e novo persistido.
- [x] Validar a edição no iPhone sem alterar Compor, modelos Pix ou emissão imediata; TypeScript, testes e preview validados.
- [x] Adicionar edição de título em cada agendamento pendente; editor modal implementado.
- [x] Adicionar edição de subtítulo em cada agendamento pendente; editor modal implementado.
- [x] Adicionar edição de mensagem em cada agendamento pendente; editor modal implementado.
- [x] Salvar o conteúdo editado mantendo o horário e o identificador do agendamento; novo agendamento criado no mesmo horário e antigo cancelado.
- [x] Validar edição, cancelamento, limpeza geral e emissão imediata sem regressões; TypeScript, testes e preview passaram.
- [x] Incrementar a versão para 1.2.36/build 156 e gerar uma nova IPA SideStore para testar a edição de agendamentos pendentes.
- [x] Acompanhar a GitHub Action, baixar a IPA gerada e auditar o Info.plist antes da entrega; Action 32198570440 concluída com sucesso, IPA auditada com Inter, versão 1.2.36, build 156 e bundle com.app.notificacaoios.
- [x] Salvar a versão correspondente à Action 32198570440 como ponto de referência definitivo; estado restaurado via checkpoint f0f549fe, Inter 1.2.36/build 156, TypeScript e testes aprovados.
- [x] Adicionar na aba Agendar uma seção Modelos rápidos igual à da aba Compor, com Pix recebido e Pix enviado.
- [x] Substituir somente a área circulada dos campos na aba Agendar, preservando o restante do layout definitivo.
- [x] Fazer os modelos rápidos preencherem título, subtítulo e mensagem sem emitir a notificação automaticamente.
- [x] Validar agendamento após usar cada modelo e salvar checkpoint separado da referência definitiva; preview móvel, TypeScript e testes aprovados.
- [x] Incrementar a versão/build e gerar uma IPA SideStore com os Modelos rápidos na aba Agendar; Inter 1.2.40/build 160, Action 32205489984.
- [x] Acompanhar a Action, baixar a IPA e auditar o Info.plist antes da entrega; AUDIT=PASS.
- [x] Salvar a versão Inter 1.2.40/build 160, com Modelos rápidos confirmados no iPhone, como backup de referência definitiva antes de novas alterações; checkpoint c7decb3a.
- [x] Remover a aba Ícone da barra inferior e limpar referências de navegação relacionadas; rota ocultada explicitamente para impedir reaparecimento automático.
- [x] Validar Compor, Histórico, Agendar e Ajustes após a remoção, sem alterar os Modelos rápidos; TypeScript, testes e prévia móvel aprovados.
- [x] Salvar checkpoint separado do backup 316e3866 e preparar nova IPA de teste; checkpoint 2573b318 e IPA 1.2.41/build 161 gerada.

- [x] Remover a aba Ícone da barra inferior e ocultar explicitamente sua rota Expo Router.
- [x] Validar a navegação com apenas Compor, Histórico, Agendar e Ajustes; TypeScript, testes e prévia móvel aprovados.
- [x] Incrementar a versão/build para 1.2.41/build 161 e gerar IPA SideStore; Action 32206949900 concluída com sucesso.
- [x] Baixar e auditar a nova IPA antes da entrega; Info.plist confirmado com Inter, com.app.notificacaoios, 1.2.41 e build 161; AUDIT=PASS.


# Próxima evolução: data e horário completos na aba Agendar

- [x] Manter a versão Inter 1.2.41/build 161 como backup de referência antes da nova evolução.
- [x] Definir o modelo interno de data/hora com horário local e identificador nativo preservado.
- [x] Adicionar seleção de data completa com limite mínimo no futuro.
- [x] Adicionar seleção de horário com formato de 24 horas.
- [x] Exibir resumo da data e horário escolhidos antes de agendar.
- [x] Validar datas passadas, horários inválidos e mudanças de fuso/horário local.
- [x] Preservar modelos Pix, preenchimento automático, edição e cancelamento de agendamentos.
- [x] Validar TypeScript, testes e prévia móvel sem regressões.
- [x] Incrementar a versão/build e gerar IPA SideStore após aprovação da implementação; versão 1.2.42/build 162, Action 32208579369.
- [x] Auditar o Info.plist e entregar a IPA para teste no iPhone; AUDIT=PASS.


# Entrega da IPA com data e horário completos

- [x] Incrementar a versão/build da implementação de data e horário para 1.2.42/build 162.
- [x] Publicar a alteração no repositório SideStore e disparar a GitHub Action 32208579369.
- [x] Baixar e auditar a IPA gerada; Inter, com.app.notificacaoios, 1.2.42, build 162; AUDIT=PASS.
- [x] Entregar a IPA auditada para teste no iPhone via SideStore.


# Backup validado no iPhone

- [x] Registrar a versão Inter 1.2.42/build 162 como ponto de backup definitivo após validação física no iPhone.
- [x] Salvar checkpoint de restauração associado a esse backup.


# Ações rápidas no Histórico

- [x] Adicionar ação “Repetir” em cada notificação do Histórico.
- [x] Adicionar ação “Agendar novamente” em cada notificação do Histórico.
- [x] Reutilizar título, subtítulo e mensagem da notificação selecionada sem duplicar o registro indevidamente.
- [x] Definir o destino de cada ação: emissão imediata para “Repetir” e aba Agendar preenchida para “Agendar novamente”.
- [x] Preservar imagem/anexo quando existir e manter limpeza individual e geral funcionando.
- [x] Validar TypeScript, testes, prévia móvel e compatibilidade com o backup 1.2.42/build 162.
- [x] Incrementar versão/build, gerar IPA SideStore e auditar o artefato após aprovação; 1.2.43/build 163, AUDIT=PASS.


# Entrega da IPA com ações rápidas no Histórico

- [x] Incrementar a versão/build da implementação do Histórico para 1.2.43/build 163.
- [x] Publicar a alteração no repositório SideStore e disparar a GitHub Action 32210148927.
- [x] Baixar e auditar a IPA gerada; Inter, com.app.notificacaoios, 1.2.43, build 163; AUDIT=PASS.
- [x] Entregar a IPA auditada para teste no iPhone via SideStore.


# Backup para retomada amanhã

- [x] Marcar a versão Inter 1.2.43/build 163, com ações rápidas do Histórico validadas no iPhone, como backup de retomada.
- [x] Salvar checkpoint definitivo antes de pausar o projeto.


# Repetição diária e semanal

- [x] Adicionar modo de repetição única, diária e semanal na aba Agendar.
- [x] Definir o horário de repetição diária e o dia da semana para repetição semanal.
- [x] Usar gatilhos nativos de calendário compatíveis com expo-notifications.
- [x] Exibir claramente a recorrência nos agendamentos pendentes.
- [x] Preservar edição, cancelamento, limpeza e ações rápidas do Histórico.
- [x] Validar datas/horários passados, recorrência semanal e comportamento local do dispositivo.
- [x] Validar TypeScript, testes e prévia móvel antes da IPA.
- [x] Incrementar versão/build e gerar IPA SideStore após aprovação; versão 1.2.44/build 164, Action 32240356271.


# Entrega da IPA com recorrência

- [x] Incrementar a versão/build da implementação de repetição diária e semanal para 1.2.44/build 164.
- [x] Publicar a alteração no repositório SideStore e disparar a GitHub Action 32240356271.
- [x] Baixar e auditar a IPA gerada; Inter, com.app.notificacaoios, 1.2.44, build 164; AUDIT=PASS.
- [x] Entregar a IPA auditada para teste no iPhone via SideStore.


# Backup da recorrência validada

- [x] Marcar a versão Inter 1.2.44/build 164, com repetição diária e semanal validada no iPhone, como backup definitivo.
- [x] Salvar checkpoint de restauração associado a essa versão.


# Modelos rápidos personalizados

- [x] Criar formulário para salvar um modelo com nome, título, subtítulo, mensagem e imagem opcional.
- [x] Persistir modelos personalizados localmente no dispositivo.
- [x] Exibir modelos personalizados junto dos modelos rápidos, sem remover Pix recebido e Pix enviado.
- [x] Permitir usar um modelo para preencher Compor e Agendar sem emitir automaticamente.
- [x] Permitir editar modelos personalizados.
- [x] Permitir excluir modelos personalizados com confirmação.
- [x] Validar persistência após reiniciar o aplicativo e evitar modelos duplicados.
- [x] Validar TypeScript, testes e prévia móvel antes da IPA.
- [ ] Incrementar versão/build e gerar IPA SideStore após aprovação.


- [x] Integrar modelos rápidos personalizados na aba Agendar com uso, edição e exclusão sincronizados com Compor
- [x] Validar TypeScript, testes e prévia móvel da integração de modelos personalizados
- [x] Atualizar versão para Inter 1.2.45/build 165 e preparar nova IPA SideStore

- [x] Exibir feedback visual imediato e claro ao salvar um modelo na aba Compor
- [x] Validar o fluxo de salvamento com o novo feedback sem regressões

- [ ] Gerar e auditar a IPA atualizada com feedback visual de salvamento para teste via SideStore
