-- Nomichi Trip Desk — seed data
-- Run this AFTER 0001_init.sql, and after you have created at least one
-- team member (sign up once through Supabase Auth or the admin login page).
--
-- This gives you 4 trips and a handful of leads in different pipeline
-- stages so the admin and public pages are useful the moment they load.

-- ─────────────────────────────────────────────────────────────
-- Trips
-- ─────────────────────────────────────────────────────────────
insert into public.trips (id, name, destination, start_date, end_date, price_inr_gst, total_seats, status, description)
values
  (
    '11111111-1111-1111-1111-111111111111',
    'Spiti in Winter',
    'Spiti Valley, Himachal Pradesh',
    '2027-01-10',
    '2027-01-17',
    42500,
    8,
    'open',
    'Frozen rivers, quiet monasteries, and nights under more stars than you have seen at once. Slow days, no rush.'
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    'Coorg Coffee Trail',
    'Coorg, Karnataka',
    '2026-09-05',
    '2026-09-08',
    18900,
    10,
    'open',
    'Coffee estates, waterfalls after the rains, and long breakfasts. Built for people who want a short trip that still feels far from home.'
  ),
  (
    '33333333-3333-3333-3333-333333333333',
    'Ladakh Backroads',
    'Leh-Ladakh, Ladakh',
    '2026-08-12',
    '2026-08-21',
    58000,
    6,
    'open',
    'High passes, longer drives, small villages. For the group that wants Ladakh without the convoy of tourist jeeps.'
  ),
  (
    '44444444-4444-4444-4444-444444444444',
    'Sundarbans by Boat',
    'Sundarbans, West Bengal',
    '2026-11-20',
    '2026-11-23',
    21500,
    8,
    'closed',
    'Three nights on the water, mangrove creeks, and a real chance of a tiger sighting. Closed for this batch, back soon.'
  );

-- ─────────────────────────────────────────────────────────────
-- Leads — spread across the pipeline, against the open trips above.
-- owner_id is left null here; assign one from the admin UI once you
-- have a team member signed up, or update this after the fact:
--   update public.leads set owner_id = '<your-team-member-uuid>' where id = '...';
-- ─────────────────────────────────────────────────────────────
insert into public.leads (id, name, phone, email, trip_id, group_type, preferred_month, trip_feeling, status, created_at)
values
  (
    'a1111111-aaaa-1111-aaaa-111111111111',
    'Ananya Rao',
    '+91 98765 43210',
    'ananya.rao@example.com',
    '11111111-1111-1111-1111-111111111111',
    'friends',
    'January 2027',
    'Quiet, a bit cold, somewhere none of us have already seen on Instagram.',
    'new',
    now() - interval '2 hours'
  ),
  (
    'a2222222-aaaa-2222-aaaa-222222222222',
    'Karan Mehta',
    '+91 91234 56780',
    'karan.mehta@example.com',
    '33333333-3333-3333-3333-333333333333',
    'solo',
    'August 2026',
    'I want to actually talk to people on the trip, not just see a place and leave.',
    'contacted',
    now() - interval '1 day'
  ),
  (
    'a3333333-aaaa-3333-aaaa-333333333333',
    'Priya and Rohit Sharma',
    '+91 99887 76655',
    'priya.rohit@example.com',
    '22222222-2222-2222-2222-222222222222',
    'couple',
    'September 2026',
    'A short, easy trip before our anniversary. Good food matters more than a packed itinerary.',
    'qualified',
    now() - interval '3 days'
  ),
  (
    'a4444444-aaaa-4444-aaaa-444444444444',
    'Devika Nair',
    '+91 90909 09090',
    'devika.nair@example.com',
    '11111111-1111-1111-1111-111111111111',
    'family',
    'January 2027',
    'Travelling with my parents, so nothing too physically demanding, but still feels like a real trip.',
    'vibe_check_sent',
    now() - interval '5 days'
  ),
  (
    'a5555555-aaaa-5555-aaaa-555555555555',
    'Farhan Sheikh',
    '+91 93939 39393',
    'farhan.sheikh@example.com',
    '33333333-3333-3333-3333-333333333333',
    'friends',
    'August 2026',
    'We did a big group trip last year and it felt rushed. Want the opposite of that.',
    'confirmed',
    now() - interval '8 days'
  ),
  (
    'a6666666-aaaa-6666-aaaa-666666666666',
    'Simran Kaur',
    '+91 97979 79797',
    'simran.kaur@example.com',
    '22222222-2222-2222-2222-222222222222',
    'solo',
    'September 2026',
    'Honestly just want to disconnect for a few days. Not sure this is the right kind of trip for that though.',
    'not_a_fit',
    now() - interval '10 days'
  );

-- ─────────────────────────────────────────────────────────────
-- A couple of call log notes against the more advanced leads.
-- ─────────────────────────────────────────────────────────────
insert into public.lead_notes (lead_id, body, next_action, created_at)
values
  (
    'a3333333-aaaa-3333-aaaa-333333333333',
    'Called Priya. Both of them are free across most of September. She asked if the estate stays have hot water, told her yes.',
    'Send the vibe check questions tomorrow morning.',
    now() - interval '2 days'
  ),
  (
    'a4444444-aaaa-4444-aaaa-444444444444',
    'Devika called back. Her parents are 61 and 58, both walk fine but she is wary of altitude on day 3. Flagged it to ops.',
    'Wait on ops reply before sending final confirmation.',
    now() - interval '4 days'
  ),
  (
    'a5555555-aaaa-5555-aaaa-555555555555',
    'Group of 4 confirmed, payment received for 2 so far. Farhan is collecting from the other two by Friday.',
    'Follow up Friday evening if payment has not come in.',
    now() - interval '6 days'
  );
