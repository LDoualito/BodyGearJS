-- Create a table for public profiles using Supabase Auth
create table profiles (
  id uuid references auth.users not null primary key,
  email text,
  weight numeric, -- in kg
  height numeric, -- in cm
  age integer,
  gender text, -- 'male', 'female', 'other'
  updated_at timestamp with time zone,
  
  constraint username_length check (char_length(email) >= 3)
);

alter table profiles enable row level security;

create policy "Users can view their own profile." on profiles
  for select using (auth.uid() = id);

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update their own profile." on profiles
  for update using (auth.uid() = id);

-- Workouts table
create table workouts (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  type text not null, -- 'musculation', 'cardio', 'yoga', etc.
  duration numeric not null, -- in minutes
  date timestamp with time zone not null default now(),
  calories numeric, -- calculated
  comment text,
  created_at timestamp with time zone default now()
);

alter table workouts enable row level security;

create policy "Users can view their own workouts." on workouts
  for select using (auth.uid() = user_id);

create policy "Users can insert their own workouts." on workouts
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own workouts." on workouts
  for update using (auth.uid() = user_id);

create policy "Users can delete their own workouts." on workouts
  for delete using (auth.uid() = user_id);

-- Goals table
create table goals (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  type text not null, -- 'calories_per_week', 'sessions_per_week'
  target_value numeric not null,
  start_date timestamp with time zone default now(),
  end_date timestamp with time zone,
  created_at timestamp with time zone default now()
);

alter table goals enable row level security;

create policy "Users can view their own goals." on goals
  for select using (auth.uid() = user_id);

create policy "Users can insert their own goals." on goals
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own goals." on goals
  for update using (auth.uid() = user_id);
  
create policy "Users can delete their own goals." on goals
  for delete using (auth.uid() = user_id);

-- Trigger to create profile on signup
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
