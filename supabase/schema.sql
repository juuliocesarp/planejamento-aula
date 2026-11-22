-- Sistema de planejamento da revista (Didática Fundamental, UnB)
-- Cole tudo no SQL Editor do Supabase e clique em "Run". Pode rodar mais de uma vez.

-- Perfil de quem está logado (julio, malu, marina, guilherme, vitor), a partir do e-mail interno.
create or replace function public.perfil_atual() returns text
language sql stable security definer set search_path = public as $$
  select case
    when split_part(auth.jwt() ->> 'email', '@', 1) in ('julio','malu','marina','guilherme','vitor')
     and split_part(auth.jwt() ->> 'email', '@', 2) = 'example.com'
    then split_part(auth.jwt() ->> 'email', '@', 1)
  end
$$;

-- Planejamentos (um documento por disciplina, mais "projeto" e "frentes")
create table if not exists public.docs (
  chave text primary key,
  dados jsonb not null,
  atualizado_por text,
  atualizado_em timestamptz default now()
);
alter table public.docs enable row level security;
drop policy if exists docs_ler on public.docs;
drop policy if exists docs_inserir on public.docs;
drop policy if exists docs_alterar on public.docs;
create policy docs_ler on public.docs for select to authenticated using (public.perfil_atual() is not null);
create policy docs_inserir on public.docs for insert to authenticated with check (public.perfil_atual() is not null);
create policy docs_alterar on public.docs for update to authenticated using (public.perfil_atual() is not null) with check (public.perfil_atual() is not null);
grant select, insert, update on public.docs to authenticated;

-- Votação anônima: tabelas sem acesso direto; tudo passa pelas funções abaixo.
create table if not exists public.propostas (
  id uuid primary key default gen_random_uuid(),
  campo text not null check (campo in ('justificativa','objetivos')),
  autor text not null,
  texto text not null default '',
  atualizado_em timestamptz default now(),
  unique (campo, autor)
);
create table if not exists public.votos (
  campo text not null check (campo in ('justificativa','objetivos')),
  eleitor text not null,
  proposta uuid not null references public.propostas(id) on delete cascade,
  primary key (campo, eleitor)
);
alter table public.propostas enable row level security;
alter table public.votos enable row level security;
revoke all on public.propostas, public.votos from anon, authenticated;

create or replace function public.minha_proposta(p_campo text) returns text
language sql stable security definer set search_path = public as $$
  select texto from propostas where campo = p_campo and autor = perfil_atual()
$$;

create or replace function public.salvar_proposta(p_campo text, p_texto text) returns void
language plpgsql security definer set search_path = public as $$
begin
  if perfil_atual() is null then raise exception 'Sem permissão'; end if;
  insert into propostas (campo, autor, texto) values (p_campo, perfil_atual(), p_texto)
  on conflict (campo, autor) do update set texto = excluded.texto, atualizado_em = now();
end $$;

-- Propostas dos outros, sem autor.
create or replace function public.propostas_outros(p_campo text) returns table (id uuid, texto text)
language sql stable security definer set search_path = public as $$
  select id, texto from propostas
  where campo = p_campo and autor <> perfil_atual() and perfil_atual() is not null and length(trim(texto)) > 0
$$;

create or replace function public.meu_voto(p_campo text) returns uuid
language sql stable security definer set search_path = public as $$
  select proposta from votos where campo = p_campo and eleitor = perfil_atual()
$$;

create or replace function public.votar(p_campo text, p_proposta uuid) returns void
language plpgsql security definer set search_path = public as $$
begin
  if perfil_atual() is null then raise exception 'Sem permissão'; end if;
  if exists (select 1 from propostas where id = p_proposta and autor = perfil_atual()) then
    raise exception 'Não é possível votar na própria proposta.';
  end if;
  if not exists (select 1 from propostas where id = p_proposta and campo = p_campo) then
    raise exception 'Proposta não encontrada.';
  end if;
  insert into votos (campo, eleitor, proposta) values (p_campo, perfil_atual(), p_proposta)
  on conflict (campo, eleitor) do update set proposta = excluded.proposta;
end $$;

-- Contagem só aparece quando os 5 votaram ou depois de 23/11/2026 às 14h (Brasília).
create or replace function public.resultado(p_campo text) returns jsonb
language plpgsql stable security definer set search_path = public as $$
declare
  n int;
  liberado boolean;
begin
  if perfil_atual() is null then raise exception 'Sem permissão'; end if;
  select count(*) into n from votos where campo = p_campo;
  liberado := n >= 5 or now() >= timestamptz '2026-11-23 14:00:00-03';
  return jsonb_build_object(
    'liberado', liberado,
    'votos', n,
    'contagem', case when liberado then coalesce((
      select jsonb_agg(jsonb_build_object('id', p.id, 'texto', p.texto, 'votos', (select count(*) from votos v where v.proposta = p.id)) order by (select count(*) from votos v where v.proposta = p.id) desc)
      from propostas p where p.campo = p_campo and length(trim(p.texto)) > 0
    ), '[]'::jsonb) else '[]'::jsonb end
  );
end $$;

revoke execute on function public.minha_proposta(text), public.salvar_proposta(text, text), public.propostas_outros(text), public.meu_voto(text), public.votar(text, uuid), public.resultado(text) from anon, public;
grant execute on function public.minha_proposta(text), public.salvar_proposta(text, text), public.propostas_outros(text), public.meu_voto(text), public.votar(text, uuid), public.resultado(text), public.perfil_atual() to authenticated;
