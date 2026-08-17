# Status da GitHub Action

Em 15/08/2026, a execução manual #108 do workflow `Build iOS IPA` está em andamento na branch `main` após a configuração do segredo `EXPO_TOKEN`. As execuções anteriores falharam primeiro porque o pnpm foi configurado depois do cache e, depois da correção, porque o `EXPO_TOKEN` estava vazio. O workflow foi corrigido e publicado no commit `47b44b79795ee1fbeeaf8ca81658ef3d981c68dd`.
