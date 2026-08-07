-- Create app_settings table for admin-only configurations
create table public.app_settings (
    key text primary key,
    value jsonb not null,
    updated_at timestamptz default now(),
    updated_by uuid references auth.users(id)
);

-- Grant access to authenticated users (functions will check roles)
grant select, insert, update on public.app_settings to authenticated;
grant all on public.app_settings to service_role;

-- Enable RLS
alter table public.app_settings enable row level security;

-- Policy: Only admins can read/write
create policy "Admins can manage settings"
on public.app_settings
for all
to authenticated
using (public.has_role(auth.uid(), 'admin'));

-- Initial seed for protocol settings if needed
insert into public.app_settings (key, value) 
values ('protocolo_config', '{"enabled": false, "sales": [], "triggers": {"onLoad": true, "onScroll": false, "onExit": false}, "overrides": {}}')
on conflict (key) do nothing;
