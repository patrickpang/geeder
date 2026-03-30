create table users (
  id text primary key,
  username text not null,
  password_hashed text not null,
  created_at text not null
) strict;

create table tokens (
  token text primary key,
  user_id text not null,
  created_at text not null
) strict;
