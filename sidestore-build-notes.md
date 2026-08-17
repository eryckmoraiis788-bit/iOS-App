# Notas sobre SideStore e build

## Fontes oficiais consultadas

- SideStore GitHub: https://github.com/SideStore/SideStore
- SideStore Connect GitHub integration: https://connect.sidestore.io/docs/developer/integration-examples/github

## Fatos relevantes

A documentação oficial do SideStore informa que o aplicativo permite instalar apps com um Apple ID e que o próprio SideStore assina novamente os apps com o certificado de desenvolvimento pessoal do usuário antes da instalação. Isso permite separar a geração da IPA da assinatura final usada no iPhone.

A documentação do SideStore Connect mostra uma integração oficial para publicar uma IPA já compilada por GitHub Actions, usando `SideStore-Connect/action@master`, um segredo `ACCESS_TOKEN`, o Bundle ID, a versão e o caminho do arquivo `.ipa`. Essa publicação é opcional e não é necessária para gerar um artefato baixável pelo GitHub.

O build EAS atual falhou na etapa de credenciais porque o certificado de distribuição remoto não foi validado para execução não interativa. A alternativa em avaliação é usar um runner macOS do GitHub para gerar uma IPA sem assinatura de distribuição, deixando a assinatura final para o SideStore no dispositivo.
