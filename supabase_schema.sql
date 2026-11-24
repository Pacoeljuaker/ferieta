-- Ejecuta este script en el SQL Editor de tu proyecto en Supabase (supabase.com)

create extension if not exists "pgcrypto";

-- 1. Tabla de Usuarios
create table if not exists public.usuarios_feria (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  email text unique not null,
  password_hash text not null,
  created_at timestamptz default now()
);

-- 2. Tabla de Puestos Registrados (vinculados al usuario creador via owner_id)
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
  owner_id uuid references public.usuarios_feria(id) on delete set null,
  owner_nombre text,
  productos jsonb not null default '[]'::jsonb,
  updated_at timestamptz default now()
);

alter table public.usuarios_feria enable row level security;
alter table public.puestos_feria enable row level security;

create policy "Acceso API usuarios"
  on public.usuarios_feria for all
  using (true)
  with check (true);

create policy "Acceso API puestos"
  on public.puestos_feria for all
  using (true)
  with check (true);
