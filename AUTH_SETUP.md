# Autenticação e licenças

O aplicativo agora exige uma sessão própria antes de liberar as abas. A validação ocorre no servidor, não no código do aplicativo. Usuários licenciados entram com usuário, senha e chave; o proprietário entra com as credenciais administrativas.

## Variáveis obrigatórias do servidor

Configure no ambiente do backend:

```env
DATABASE_URL=mysql://...
JWT_SECRET=uma-chave-aleatória-com-pelo-menos-32-caracteres
ADMIN_USERNAME=seu-login-de-proprietario
ADMIN_PASSWORD=uma-senha-forte
```

Não coloque essas variáveis no repositório, no `app.config.js` ou em variáveis `EXPO_PUBLIC_*`. Use os secrets do provedor de hospedagem.

## Primeiro acesso do proprietário

Ao primeiro login com `ADMIN_USERNAME` e `ADMIN_PASSWORD`, o servidor cria a conta de administrador no banco. O painel aparece em **Ajustes > Painel do proprietário**.

## Operação das licenças

No painel, o proprietário pode criar usuários com login, senha e data de vencimento. Uma chave de licença é gerada e exibida apenas na criação. O acesso permanece válido durante todo o último dia informado. Depois disso, o servidor bloqueia o login e também invalida sessões existentes na próxima consulta de sessão.

Cada conta é vinculada ao primeiro dispositivo que efetuar login. Tentativas posteriores em outro dispositivo são recusadas. A licença pode ser renovada ou revogada sem criar outro usuário.

## Migração

Aplique `drizzle/0001_local_auth.sql` no mesmo banco usado pelo backend antes de iniciar o servidor com as novas variáveis. Faça o primeiro login do proprietário somente depois de confirmar que a migração foi aplicada.
