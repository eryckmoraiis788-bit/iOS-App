# Notas de instalação via SideStore

Fontes oficiais consultadas em 15 de agosto de 2026:

- https://sidestore.io/
- https://docs.sidestore.io/docs/installation/install
- https://docs.sidestore.io/docs/installation/prerequisites
- https://docs.sidestore.io/docs/advanced/pairing-file
- https://docs.sidestore.io/docs/faq
- https://docs.sidestore.io/docs/troubleshooting/common-issues

Pontos confirmados:

1. SideStore instala arquivos IPA por sideload e usa a conta Apple do usuário para assinar os aplicativos no dispositivo.
2. A instalação inicial exige computador, iPhone com código, conta Apple, Wi-Fi e LocalDevVPN; depois o SideStore pode operar sem computador, desde que o VPN esteja conectado quando for instalar, atualizar ou renovar apps.
3. Após instalar o SideStore, o usuário deve confiar no perfil em Ajustes > Geral > VPN e Gerenciamento de Dispositivo, abrir o LocalDevVPN, conectar, abrir o SideStore, iniciar sessão e atualizar o contador de 7 dias em My Apps.
4. Para instalar uma IPA personalizada, o arquivo deve ser aberto/importado pelo SideStore como qualquer outra IPA; para uma atualização, a documentação informa que o mesmo Bundle ID permite manter os dados do app quando a versão nova é instalada pelo SideStore.
5. Em conta Apple gratuita, existem limites de apps ativos e App IDs; a conta Apple Developer paga amplia o prazo de validade.
6. Se o arquivo de pareamento expirar, ele pode precisar ser substituído pelo iLoader conforme a documentação oficial.

Observação do projeto: o checkpoint do código não é uma IPA assinada. É necessário gerar o build standalone e assinar a IPA com a conta Apple usada pelo SideStore antes da instalação no iPhone.

## Build iOS sem Mac: Expo EAS

Fontes oficiais consultadas em 15 de agosto de 2026:

- https://docs.expo.dev/build/introduction/
- https://docs.expo.dev/develop/development-builds/introduction/
- https://docs.expo.dev/submit/ios/

Pontos confirmados:

1. EAS Build é um serviço hospedado que gera binários standalone para Expo/React Native, incluindo iOS, em servidores macOS da própria Expo; portanto, o usuário pode iniciar o build a partir do Windows.
2. A documentação do Expo informa que development builds podem ser compilados em nuvem sem ferramentas nativas locais e que builds iOS podem ser criados a partir de qualquer sistema operacional.
3. O build local de um development build para iPhone sem uma conta Apple Developer paga não é o caminho disponível em Windows; o build local de iOS exige macOS/Xcode.
4. EAS Submit para App Store exige conta Apple Developer paga, mas isso é diferente do objetivo de gerar uma IPA para sideload no SideStore.
5. O projeto deve usar EAS Build em nuvem para tentar gerar a IPA; a assinatura final e a instalação no iPhone devem ser compatíveis com o fluxo de sideload do SideStore.

Conclusão operacional: Windows + SideStore é viável, mas não basta o checkpoint do código. É necessário iniciar um build iOS em nuvem e resolver as credenciais/signature do build. Não solicitar credenciais Apple pelo chat; o usuário deverá inseri-las diretamente no fluxo seguro de build quando solicitado.
