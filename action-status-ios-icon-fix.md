# Status da GitHub Action — correção de ícones iOS

Fonte: https://github.com/eryckmoraiis788-bit/iOS-App/actions

A execução #3 do workflow `Build SideStore IPA`, acionada pelo commit `13f1f56` (`Update icon-symbol.ios.tsx`), está em andamento. A execução #2, do commit `004d871` (`Update build-ios.yml`), concluiu com sucesso em aproximadamente 8m05s e gerou o artefato `notificacao-ios-sidestore-ipa` de 10,2 MB. A execução #1 falhou por incompatibilidade do Xcode 15.4; o runner foi alterado para `macos-15` na execução #2.

Objetivo da execução #3: corrigir o componente iOS `components/ui/icon-symbol.ios.tsx`, traduzindo aliases Material usados pelo aplicativo para nomes válidos de SF Symbols, pois a aba Compor ficou branca na IPA instalada.

Última observação: execução #3 ainda aparece como `In progress`; nenhum novo artefato foi disponibilizado na última consulta.
