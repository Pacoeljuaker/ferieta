-- Ejecuta este script en el SQL Editor de tu proyecto en Supabase (supabase.com)
create table if not exists public.puestos_feria (
  id integer primary key,
  numero text not null,
  nombre text not null,
  categoria text not null,
  descripcion text not null,
  icono text not null,
  color text not null,
  imagen text not null,
  lat double precision not null,
  lng double precision not null,
  productos jsonb not null default '[]'::jsonb,
  updated_at timestamptz default now()
);

alter table public.puestos_feria enable row level security;

create policy "Lectura publica de puestos"
  on public.puestos_feria for select
  using (true);

create policy "Registro y actualizacion publica de puestos"
  on public.puestos_feria for all
  using (true)
  with check (true);
