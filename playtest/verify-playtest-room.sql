-- READ ONLY. Run only in el-zhady-playtest / isufimcphbxhkmrquocc.
-- Replace the room-code placeholder; keep the room until this report is saved.
-- One JSON cell avoids losing earlier results when the editor shows only the last query.
with target_room as (
  select id, code from public.rooms
  where code = 'REPLACE_WITH_TEST_ROOM_CODE'
), sessions as (
  select s.* from public.live_quiz_sessions s
  join target_room r on r.id = s.room_id
), snapshots as (
  select s.id as session_id, s.round_number, s.game_kind,
    s.question_seconds, q.question_id, q.ordinal,
    q.time_saved_seconds, q.closed_early_at,
    el_zhady_private.question_opens(s.id, q.ordinal) as opens_at,
    extract(epoch from (
      el_zhady_private.question_deadline(s.id, q.ordinal)
      - el_zhady_private.question_opens(s.id, q.ordinal)
    )) as window_seconds,
    case when q.ordinal < 10 then extract(epoch from (
      el_zhady_private.question_opens(s.id, q.ordinal + 1)
      - el_zhady_private.question_deadline(s.id, q.ordinal)
    )) end as reveal_gap_seconds
  from sessions s
  join el_zhady_private.live_quiz_snapshot q on q.session_id = s.id
), per_round as (
  select s.round_number, s.game_kind, s.question_seconds, s.status,
    (select count(*) from snapshots q where q.session_id = s.id) as snapshot_count,
    (select count(*) from el_zhady_private.room_question_draws d
      where d.session_id = s.id) as reserved_count
  from sessions s
), accepted as (
  select a.*,
    case when a.is_correct then greatest(0, least(100, floor(
      100 * extract(epoch from (
        q.opens_at + q.question_seconds * interval '1 second' - a.received_at
      )) / q.question_seconds
    )::integer)) else 0 end as expected_original_speed
  from el_zhady_private.live_quiz_answers a
  join snapshots q on q.session_id = a.session_id
    and q.question_id = a.question_id
), result_comparisons as (
  select r.session_id, r.participant_id,
    r.correct_count = count(a.question_id) filter (where a.is_correct)
      and r.speed_points = coalesce(sum(a.speed_points), 0)
      and r.raw_points = coalesce(sum(a.raw_points), 0) as matches_accepted
  from public.live_quiz_results r
  join sessions s on s.id = r.session_id
  left join accepted a on a.session_id = r.session_id
    and a.participant_id = r.participant_id
  group by r.session_id, r.participant_id,
    r.correct_count, r.speed_points, r.raw_points
)
select jsonb_build_object(
  'room_code', (select code from target_room),
  'lineup', (select jsonb_agg(to_jsonb(p) order by p.round_number) from per_round p),
  'room_reserved_count', (
    select count(*) from el_zhady_private.room_question_draws d
    join target_room r on r.id = d.room_id
  ),
  'room_distinct_count', (
    select count(distinct d.content_key) from el_zhady_private.room_question_draws d
    join target_room r on r.id = d.room_id
  ),
  'full_windows_when_not_ended_early', (
    select bool_and(case when q.closed_early_at is null
      then abs(q.window_seconds - q.question_seconds) < 0.001
      else true end) from snapshots q
  ),
  'five_second_reveals', (
    select bool_and(abs(q.reveal_gap_seconds - 5) < 0.001)
    from snapshots q where q.ordinal < 10
  ),
  'question_timing', (
    select jsonb_agg(jsonb_build_object(
      'round', q.round_number, 'kind', q.game_kind, 'question', q.ordinal,
      'configured_seconds', q.question_seconds,
      'ended_early', q.closed_early_at is not null,
      'discarded_seconds', q.time_saved_seconds,
      'window_seconds', q.window_seconds,
      'reveal_gap_seconds', q.reveal_gap_seconds
    ) order by q.round_number, q.ordinal) from snapshots q
  ),
  'accepted_answer_count', (select count(*) from accepted),
  'accepted_points_match_original_window', (
    select bool_and(a.speed_points = a.expected_original_speed
      and a.raw_points = case when a.is_correct
        then 1000 + a.expected_original_speed else 0 end)
    from accepted a
  ),
  'duplicate_accepted_answer_groups', (
    select count(*) from (
      select session_id, participant_id, question_id from accepted
      group by session_id, participant_id, question_id having count(*) > 1
    ) duplicate_groups
  ),
  'completed_player_round_results', (select count(*) from result_comparisons),
  'completed_results_match_accepted_answers', (
    select bool_and(matches_accepted) from result_comparisons
  )
) as playtest_report;
