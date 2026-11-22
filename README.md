# Revista: planejamento interdisciplinar

Protótipo acadêmico da disciplina Didática Fundamental (UnB). Sistema web para planejar o projeto interdisciplinar
"Energia, Trabalho e Território: das Máquinas Térmicas à Crise Climática" (2ª série do Ensino Médio): Física,
Geografia, História, Redação e Gramática/Literatura.

- Site: GitHub Pages (`npm run build`, publicado pelo workflow em `.github/workflows/deploy.yml`).
- Dados: Supabase gratuito. Rode `supabase/schema.sql` no SQL Editor e coloque a URL e a chave pública em `.env.production`
  (`VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`). Sem esses valores, o sistema roda em modo de demonstração (salva no navegador).
- Calendário: SEEDF 2026 (Portaria nº 1.300/2025). Conteúdos: guia de referência do grupo e PDF do projeto.

Protótipo sem dados pessoais. O login (perfil + senha única) é só uma barreira simbólica e a votação não é à prova de fraude.
