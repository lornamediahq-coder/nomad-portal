-- Nomad Portal — full schema
-- Run this in Supabase Dashboard → SQL Editor

-- ─── USERS ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.users (
  id            UUID        REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email         TEXT        NOT NULL,
  full_name     TEXT,
  archetype     TEXT        CHECK (archetype IN ('Explorer','Builder','Visionary','Wanderer','Sovereign')),
  tier          TEXT        NOT NULL DEFAULT 'free' CHECK (tier IN ('free','pro','elite')),
  xp            INTEGER     NOT NULL DEFAULT 0,
  level         INTEGER     NOT NULL DEFAULT 1,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-create users row when someone signs up via Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name'
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ─── SPRINT GOALS ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.sprint_goals (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID        REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  title       TEXT        NOT NULL,
  weeks       INTEGER     NOT NULL DEFAULT 4,
  start_date  DATE        NOT NULL DEFAULT CURRENT_DATE,
  status      TEXT        NOT NULL DEFAULT 'active' CHECK (status IN ('active','completed','abandoned')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── SPRINT TASKS ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.sprint_tasks (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  goal_id     UUID        REFERENCES public.sprint_goals(id) ON DELETE CASCADE NOT NULL,
  title       TEXT        NOT NULL,
  due_date    DATE,
  completed   BOOLEAN     NOT NULL DEFAULT FALSE,
  xp_value    INTEGER     NOT NULL DEFAULT 10,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── BUDGET ENTRIES ──────────────────────────────────────────────────────────
-- Positive amount = income, negative = expense
CREATE TABLE IF NOT EXISTS public.budget_entries (
  id          UUID           DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID           REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  amount      NUMERIC(12,2)  NOT NULL,
  category    TEXT           NOT NULL,
  note        TEXT,
  date        DATE           NOT NULL DEFAULT CURRENT_DATE,
  created_at  TIMESTAMPTZ    NOT NULL DEFAULT NOW()
);

-- ─── XP EVENTS ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.xp_events (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID        REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  event_type  TEXT        NOT NULL,
  xp_awarded  INTEGER     NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── NATAL CHARTS ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.natal_charts (
  id           UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id      UUID        REFERENCES public.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  birth_date   DATE        NOT NULL,
  birth_time   TIME,
  birth_place  TEXT        NOT NULL,
  chart_data   JSONB,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── POD MEMBERS ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.pod_members (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  pod_id      UUID        NOT NULL,
  user_id     UUID        REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  role        TEXT        NOT NULL DEFAULT 'member' CHECK (role IN ('member','lead')),
  joined_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (pod_id, user_id)
);

-- ─── FORUM POSTS ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.forum_posts (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID        REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  title       TEXT        NOT NULL,
  body        TEXT        NOT NULL,
  upvotes     INTEGER     NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── BADGES EARNED ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.badges_earned (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID        REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  badge_id    TEXT        NOT NULL,
  earned_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, badge_id)
);

-- ─── ROW LEVEL SECURITY ──────────────────────────────────────────────────────
ALTER TABLE public.users         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sprint_goals  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sprint_tasks  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budget_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.xp_events     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.natal_charts  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pod_members   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_posts   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges_earned ENABLE ROW LEVEL SECURITY;

-- Users: own row only
CREATE POLICY "users: own row" ON public.users
  FOR ALL USING (auth.uid() = id);

-- Sprint goals: own rows
CREATE POLICY "sprint_goals: own rows" ON public.sprint_goals
  FOR ALL USING (auth.uid() = user_id);

-- Sprint tasks: own via goal
CREATE POLICY "sprint_tasks: own via goal" ON public.sprint_tasks
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.sprint_goals g
      WHERE g.id = goal_id AND g.user_id = auth.uid()
    )
  );

-- Budget entries: own rows
CREATE POLICY "budget_entries: own rows" ON public.budget_entries
  FOR ALL USING (auth.uid() = user_id);

-- XP events: own rows
CREATE POLICY "xp_events: own rows" ON public.xp_events
  FOR ALL USING (auth.uid() = user_id);

-- Natal charts: own rows
CREATE POLICY "natal_charts: own rows" ON public.natal_charts
  FOR ALL USING (auth.uid() = user_id);

-- Pod members: own rows
CREATE POLICY "pod_members: own rows" ON public.pod_members
  FOR ALL USING (auth.uid() = user_id);

-- Forum posts: readable by all authenticated users, writable by owner
CREATE POLICY "forum_posts: read all" ON public.forum_posts
  FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "forum_posts: own write" ON public.forum_posts
  FOR ALL USING (auth.uid() = user_id);

-- Badges: own rows
CREATE POLICY "badges_earned: own rows" ON public.badges_earned
  FOR ALL USING (auth.uid() = user_id);
