# Gerar a IPA pela GitHub Actions

O workflow `Build iOS IPA` instala as dependências, valida a configuração Expo, inicia o build iOS pelo EAS e publica a IPA como artefato da execução.

## Configuração única

No GitHub, abra **Settings → Secrets and variables → Actions → New repository secret** e crie o segredo `EXPO_TOKEN`. O valor deve ser um token pessoal do Expo com permissão suficiente para iniciar builds no projeto associado ao `eas.projectId` configurado em `app.config.js`.

O token deve ser criado e copiado diretamente do painel do Expo. Não coloque o valor em arquivos, commits, prints ou mensagens.

## Execução

Abra a aba **Actions**, selecione **Build iOS IPA** e clique em **Run workflow**. Também é possível iniciar automaticamente fazendo push para a branch `main`.

Quando o workflow terminar com sucesso, abra a execução concluída, vá até **Artifacts** e baixe `notificacao-ios-ipa`. O arquivo baixado será `notificacao-ios.ipa`.

A assinatura Apple e a validade da instalação dependem das credenciais configuradas no projeto EAS e do método de sideload utilizado pelo SideStore. O workflow não armazena certificados ou chaves privadas no repositório.
