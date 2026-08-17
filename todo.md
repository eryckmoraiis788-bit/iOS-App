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
- [ ] Repetir o build iOS em nuvem para gerar a IPA
- [x] Vincular o projeto ao EAS usando o projectId `82e285d9-9e2f-4027-9d15-6cd6841339de`
- [ ] Repetir o build iOS após gravar `eas.projectId`
