
-- Demo accounts
insert into auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
values
 ('00000000-0000-0000-0000-000000000000','d0000001-0000-4000-8000-000000000001','authenticated','authenticated','customer@onestop.app', crypt('onestop123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Aarav Sharma"}', now(), now()),
 ('00000000-0000-0000-0000-000000000000','d0000002-0000-4000-8000-000000000002','authenticated','authenticated','provider@onestop.app', crypt('onestop123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Sunita Deshmukh"}', now(), now()),
 ('00000000-0000-0000-0000-000000000000','d0000003-0000-4000-8000-000000000003','authenticated','authenticated','admin@onestop.app', crypt('onestop123', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{"full_name":"Team Odyssey Admin"}', now(), now())
on conflict (id) do nothing;

insert into auth.identities (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
select u.id::text, u.id, jsonb_build_object('sub', u.id::text, 'email', u.email, 'email_verified', true), 'email', now(), now(), now()
from auth.users u
where u.id in ('d0000001-0000-4000-8000-000000000001','d0000002-0000-4000-8000-000000000002','d0000003-0000-4000-8000-000000000003')
on conflict do nothing;

insert into public.profiles (id, full_name, phone, email, role, city, latitude, longitude, avatar_url)
values
 ('d0000001-0000-4000-8000-000000000001','Aarav Sharma','+91 98230 45678','customer@onestop.app','customer','Pune',18.5100,73.8100,'https://api.dicebear.com/7.x/bottts/svg?seed=Aarav'),
 ('d0000002-0000-4000-8000-000000000002','Sunita Deshmukh','+91 94220 11223','provider@onestop.app','provider','Pune',18.5085,73.8090,'https://api.dicebear.com/7.x/bottts/svg?seed=Sunita'),
 ('d0000003-0000-4000-8000-000000000003','Team Odyssey Admin','+91 99999 00000','admin@onestop.app','admin','Pune',18.5204,73.8567,'https://api.dicebear.com/7.x/bottts/svg?seed=Admin')
on conflict (id) do update set full_name = excluded.full_name, role = excluded.role, email = excluded.email;

insert into public.user_roles (user_id, role)
values
 ('d0000001-0000-4000-8000-000000000001','customer'),
 ('d0000002-0000-4000-8000-000000000002','provider'),
 ('d0000003-0000-4000-8000-000000000003','admin')
on conflict do nothing;

update public.providers set owner_id = 'd0000002-0000-4000-8000-000000000002'
where id = '11111111-1111-1111-1111-111111111111';

update public.providers set owner_id = gen_random_uuid() where owner_id is null;

-- Demo customer addresses
insert into public.addresses (id, user_id, label, address_line, city, state, pincode, latitude, longitude, is_default)
values
 ('a0000001-0000-4000-8000-000000000001','d0000001-0000-4000-8000-000000000001','Home','Flat 402, Sai Heritage, Near MIT College, Kothrud','Pune','Maharashtra','411038',18.5100,73.8100,true),
 ('a0000002-0000-4000-8000-000000000002','d0000001-0000-4000-8000-000000000001','Office','Floor 3, Tech Park Tower B, Senapati Bapat Road','Pune','Maharashtra','411016',18.5300,73.8300,false)
on conflict (id) do nothing;

-- Menu categories for every provider
insert into public.menu_categories (id, provider_id, name, sort_order)
select md5(p.id::text || c.name)::uuid, p.id, c.name, c.sort_order
from public.providers p
cross join (values ('Today''s Specials',1), ('Thalis & Meals',2), ('Snacks & Sides',3), ('Sweets & Desserts',4)) as c(name, sort_order)
on conflict (id) do nothing;
