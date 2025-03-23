-- Create table 'test'
create table test (
    id serial primary key,
    random_number int2 not null default 37,
    created_at timestamp default now(),
    updated_at timestamp default now()
);

-- Turn on security
alter table "test" enable row level security;

-- Allow anonymous access
create policy "Allow anonymous access" on test for
select to anon using (true);
