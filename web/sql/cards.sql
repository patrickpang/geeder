create table cards (
  id text primary key,
  user_id text not null,
  question text not null,
  answer text not null,
  created_at text not null
) strict;