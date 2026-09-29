-- Tabla de leads del formulario de contacto de la web de LocalIA.
-- Se escribe desde /api/contact con la service role key (solo servidor).
-- RLS activado y sin políticas: nadie puede leer ni escribir con la anon key.

create table if not exists public.contact_leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null check (char_length(name) between 2 and 80),
  company text check (char_length(company) <= 120),
  email text not null check (char_length(email) <= 160),
  phone text check (char_length(phone) <= 30),
  needs text[] not null default '{}',
  message text not null check (char_length(message) between 20 and 3000),
  source text,
  user_agent text,
  status text not null default 'nuevo' check (status in ('nuevo', 'contactado', 'en_curso', 'cerrado', 'descartado'))
);

alter table public.contact_leads enable row level security;

create index if not exists contact_leads_created_at_idx on public.contact_leads (created_at desc);
