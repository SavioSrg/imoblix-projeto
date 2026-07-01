# Camada de Serviços

Toda regra de negócio e acesso a dados vive aqui, desacoplada da UI.
Hoje os serviços retornam **dados mockados**. Para plugar Supabase basta trocar
a implementação — as interfaces exportadas não mudam.

## Serviços disponíveis

| Arquivo | Responsabilidade | Status |
| --- | --- | --- |
| `EstimateService.ts` | Calcula estimativa de custos de registro a partir das respostas do wizard | Mock (pronto) |
| `CertidoesService.ts` | Lista o catálogo de certidões e seus preços/prazos | Mock (pronto) |
| `LeadsService.ts` | Envia leads da área Premium / formulário de contato | Mock (pronto) |
| `SessionService.ts` | Persiste o processo atual do usuário para o Dashboard | Mock (sessionStorage) |

## Como plugar Supabase depois

1. Ative Lovable Cloud (Supabase) no projeto.
2. Crie as tabelas correspondentes (ex.: `leads`, `certidoes`, `processos`).
3. Reimplemente cada arquivo deste diretório usando `createServerFn` +
   `requireSupabaseAuth` quando o dado for do usuário. As **assinaturas
   públicas** dos serviços não mudam, então os componentes/hooks continuam
   funcionando sem alteração.
