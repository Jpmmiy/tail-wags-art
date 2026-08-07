-- Atualiza o tier para vitalício e garante que o usuário seja admin
do $$
declare
  target_user_id uuid;
begin
  select id into target_user_id from auth.users where email = 'andreyhenriquev4@gmail.com';

  if target_user_id is not null then
    -- Atualiza perfil (colunas confirmadas: id, tier)
    update public.profiles 
    set tier = 'vitalicio'
    where id = target_user_id;

    -- Garante role de admin
    insert into public.user_roles (user_id, role)
    values (target_user_id, 'admin')
    on conflict (user_id, role) do nothing;
  end if;
end $$;
