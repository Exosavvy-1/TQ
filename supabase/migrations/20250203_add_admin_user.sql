insert into auth.users (email, encrypted_password)
values (
  'tqpicture@gmail.com',
  crypt('TyraMokhotla@2705', gen_salt('bf'))
);
