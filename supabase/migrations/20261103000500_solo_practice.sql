begin;
-- NEW review migration, isolated playtest only; do not apply during PR preparation.
create table el_zhady_private.practice_sets (
 activity_id text primary key check(activity_id in ('quiz','matching','ordering','map','classification')),
 version text not null, items jsonb not null check(jsonb_typeof(items)='array')
);
create table el_zhady_private.practice_attempts (
 id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
 request_id uuid not null, activity_id text not null references el_zhady_private.practice_sets,
 version text not null, items jsonb not null, answers jsonb not null default '{}'::jsonb,
 score integer check(score between 0 and 20), created_at timestamptz not null default now(), completed_at timestamptz,
 unique(user_id,request_id)
);
create unique index one_active_practice on el_zhady_private.practice_attempts(user_id,activity_id) where completed_at is null;
alter table el_zhady_private.practice_sets enable row level security;
alter table el_zhady_private.practice_attempts enable row level security;
revoke all on el_zhady_private.practice_sets,el_zhady_private.practice_attempts from public,anon,authenticated;

-- Reuse already sourced immutable authored material, never import keys into browser code.
insert into el_zhady_private.practice_sets
select 'quiz','solo-v1',jsonb_agg(jsonb_build_object('id',id::text,'prompt',prompt,'options',options,'correct',correct_option_id,'explanation',explanation,'sources',source_refs) order by ordinal)
from el_zhady_private.live_quiz_questions where set_version='kz-1939-1953-mixed-v3' and game_kind='quiz' and ordinal<=5;
insert into el_zhady_private.practice_sets
select 'map','solo-v1',jsonb_agg(jsonb_build_object('id',id::text,'prompt',prompt,'options',options,'payload',payload,'correct',correct_option_id,'explanation',explanation,'sources',source_refs) order by ordinal)
from (select * from el_zhady_private.live_quiz_questions where set_version='kz-1939-1953-mixed-v3' and game_kind='map' order by ordinal limit 5) q;
insert into el_zhady_private.practice_sets values('matching','solo-v1','[{"id":"auezov","prompt":"Мұхтар Әуезов","options":[{"id":"role-auezov","text":"Абай туралы 1945 жылғы очерктің авторы"},{"id":"role-aliya","text":"Мерген"},{"id":"role-manshuk","text":"Пулеметші"},{"id":"role-satbayev","text":"Ғылым академиясының тұңғыш президенті"},{"id":"role-bekmakhanov","text":"1947 жылғы тарихи монографияның авторы"}],"correct":"role-auezov","explanation":"Жазушы. Абай туралы еңбегі идеологиялық сынға ұшырап, саяси қысым көрді.","sources":[{"title":"Қоғамдық-саяси және мәдени өмірдегі өзгерістер","url":"https://e-history.kz/kz/amp/history-of-kazakhstan/show/8825","publisher":"e-history.kz","locator":"М. Әуезовтің 1945 жылғы еңбегі және қудалануы","checked_on":"2026-11-03"}]},{"id":"aliya","prompt":"Әлия Молдағұлова","options":[{"id":"role-auezov","text":"Абай туралы 1945 жылғы очерктің авторы"},{"id":"role-aliya","text":"Мерген"},{"id":"role-manshuk","text":"Пулеметші"},{"id":"role-satbayev","text":"Ғылым академиясының тұңғыш президенті"},{"id":"role-bekmakhanov","text":"1947 жылғы тарихи монографияның авторы"}],"correct":"role-aliya","explanation":"Мерген. Оның майдан жолы әйелдердің соғысқа қатысуын жеке тұлға арқылы түсінуге мүмкіндік береді.","sources":[{"title":"Батыс қазақстандықтардың Ұлы Жеңіске қосқан үлесі","url":"https://e-history.kz/kz/amp/news/show/50000239","publisher":"e-history.kz","locator":"54-ші атқыштар бригадасының мергені аталған абзац","checked_on":"2026-11-03"}]},{"id":"manshuk","prompt":"Мәншүк Мәметова","options":[{"id":"role-auezov","text":"Абай туралы 1945 жылғы очерктің авторы"},{"id":"role-aliya","text":"Мерген"},{"id":"role-manshuk","text":"Пулеметші"},{"id":"role-satbayev","text":"Ғылым академиясының тұңғыш президенті"},{"id":"role-bekmakhanov","text":"1947 жылғы тарихи монографияның авторы"}],"correct":"role-manshuk","explanation":"Пулеметші. Кейінгі еске алу нысандарын соғыс кезіндегі құжаттардан ажырата оқу қажет.","sources":[{"title":"Батыс қазақстандықтардың Ұлы Жеңіске қосқан үлесі","url":"https://e-history.kz/kz/amp/news/show/50000239","publisher":"e-history.kz","locator":"100-ші ұлттық атқыштар бригадасының пулеметшісі аталған абзац","checked_on":"2026-11-03"}]},{"id":"satbayev","prompt":"Қаныш Сәтбаев","options":[{"id":"role-auezov","text":"Абай туралы 1945 жылғы очерктің авторы"},{"id":"role-aliya","text":"Мерген"},{"id":"role-manshuk","text":"Пулеметші"},{"id":"role-satbayev","text":"Ғылым академиясының тұңғыш президенті"},{"id":"role-bekmakhanov","text":"1947 жылғы тарихи монографияның авторы"}],"correct":"role-satbayev","explanation":"1946 жылы құрылған Қазақ КСР Ғылым академиясының тұңғыш президенті.","sources":[{"title":"ҚР ҰҒА тарихы","url":"https://qazscience.gov.kz/category/history-of-nas-rk","publisher":"Қазақстан Республикасының Ұлттық ғылым академиясы","locator":"1946 бөлімі","checked_on":"2026-11-03"}]},{"id":"bekmakhanov","prompt":"Ермұхан Бекмаханов","options":[{"id":"role-auezov","text":"Абай туралы 1945 жылғы очерктің авторы"},{"id":"role-aliya","text":"Мерген"},{"id":"role-manshuk","text":"Пулеметші"},{"id":"role-satbayev","text":"Ғылым академиясының тұңғыш президенті"},{"id":"role-bekmakhanov","text":"1947 жылғы тарихи монографияның авторы"}],"correct":"role-bekmakhanov","explanation":"1947 жылғы монографияның авторы. 1952 жылғы үкімі соғыстан кейінгі ғалымдарды қудалау тарихын ашады.","sources":[{"title":"Қоғамдық-саяси және мәдени өмірдегі өзгерістер","url":"https://e-history.kz/kz/amp/history-of-kazakhstan/show/8825","publisher":"e-history.kz","locator":"1947 жылғы еңбек; 1952 жылғы үкім","checked_on":"2026-11-03"}]}]'::jsonb);
insert into el_zhady_private.practice_sets values('ordering','solo-v1','[{"id":"sequence","prompt":"Оқиғаларды ертеден кешке реттеңіз.","options":[{"id":"event-1952","text":"Бекмахановқа үкім шығарылды"},{"id":"event-1949-08-29","text":"Семейдегі алғашқы ядролық сынақ"},{"id":"event-1946-06-01","text":"Ғылым академиясы құрылды"},{"id":"event-1941-06-22","text":"КСРО-ға шабуыл"},{"id":"event-1939-09-01","text":"Соғыстың басталуы"}],"correct":"event-1939-09-01>event-1941-06-22>event-1946-06-01>event-1949-08-29>event-1952","explanation":"1939-09-01: Соғыстың басталуы; 1941-06-22: КСРО-ға шабуыл; 1946-06-01: Ғылым академиясы құрылды; 1949-08-29: Семейдегі алғашқы ядролық сынақ; 1952: Бекмахановқа үкім шығарылды","sources":[{"title":"World War II Dates and Timeline","url":"https://encyclopedia.ushmm.org/content/en/article/world-war-ii-key-dates","publisher":"United States Holocaust Memorial Museum","locator":"September 1, 1939; June 22, 1941; FAQ","checked_on":"2026-11-03"},{"title":"World War II Dates and Timeline","url":"https://encyclopedia.ushmm.org/content/en/article/world-war-ii-key-dates","publisher":"United States Holocaust Memorial Museum","locator":"September 1, 1939; June 22, 1941; FAQ","checked_on":"2026-11-03"},{"title":"ҚР ҰҒА тарихы","url":"https://qazscience.gov.kz/category/history-of-nas-rk","publisher":"Қазақстан Республикасының Ұлттық ғылым академиясы","locator":"1946 бөлімі: құрылған күн мен тұңғыш президент","checked_on":"2026-11-03"},{"title":"International Day against Nuclear Tests","url":"https://www.ctbto.org/news-and-events/international-day-against-nuclear-tests","publisher":"CTBTO","locator":"First Soviet nuclear test: 29 August 1949; harmful effects paragraph","checked_on":"2026-11-03"},{"title":"Қоғамдық-саяси және мәдени өмірдегі өзгерістер","url":"https://e-history.kz/kz/amp/history-of-kazakhstan/show/8825","publisher":"e-history.kz","locator":"Бекмахановтың қызметтен босатылуы мен 1952 жылғы үкімі","checked_on":"2026-11-03"}]}]'::jsonb);
insert into el_zhady_private.practice_sets values('classification','solo-v1','[{"id":"front-women","prompt":"Әлия Молдағұлова мерген, Мәншүк Мәметова пулеметші болды. Олардың жолын тек марапатпен шектемей, әскери мамандығы мен адам тағдыры арқылы да тану маңызды.","options":[{"id":"front","text":"Майдан"},{"id":"homefront","text":"Тыл"},{"id":"postwar","text":"Соғыстан кейін"}],"correct":"front","explanation":"Майдандағы әйелдер","sources":[{"title":"Батыс қазақстандықтардың Ұлы Жеңіске қосқан үлесі","url":"https://e-history.kz/kz/amp/news/show/50000239","publisher":"e-history.kz","locator":"Әлия мен Мәншүктің әскери мамандықтары аталған абзац","checked_on":"2026-11-03"}]},{"id":"rear-oral","prompt":"1941 жылы Ленинградтан Оралға №231 зауыттың мамандары мен жабдықтары жеткізілді. Қоныс аударған өндірісті орналастыру жергілікті еңбек пен соғыс қажетінің байланысын көрсетеді.","options":[{"id":"front","text":"Майдан"},{"id":"homefront","text":"Тыл"},{"id":"postwar","text":"Соғыстан кейін"}],"correct":"homefront","explanation":"Эвакуация: Оралдағы өндіріс","sources":[{"title":"Батыс қазақстандықтардың Ұлы Жеңіске қосқан үлесі","url":"https://e-history.kz/kz/amp/news/show/50000239","publisher":"e-history.kz","locator":"1941 жылғы 10–11 қыркүйек және №231 зауыт туралы абзацтар","checked_on":"2026-11-03"}]},{"id":"cinema-almaty","prompt":"1941–1944 жылдары Алматыда Орталық біріккен киностудия жұмыс істеді. Оның құрамына жергілікті студия және эвакуацияланған «Мосфильм» мен «Ленфильм» кірді. Өнер адамдары соғыс жағдайында да фильмдер жасады.","options":[{"id":"front","text":"Майдан"},{"id":"homefront","text":"Тыл"},{"id":"postwar","text":"Соғыстан кейін"}],"correct":"homefront","explanation":"Алматы — соғыс кезіндегі кино орталығы","sources":[{"title":"ЦОКС — Центральная Объединенная киностудия (1941–1944 гг.)","url":"https://csdfmuseum.ru/articles/418","publisher":"ЦСДФ мұражайы","locator":"Алғашқы екі абзац: 1941–1944 және студия құрамы","checked_on":"2026-11-03"}]},{"id":"academy-1946","prompt":"Қазақ КСР Ғылым академиясы 1946 жылғы 1 маусымда құрылды. Тұңғыш президенті Қаныш Сәтбаев болды. Академияның ресми тарихында осы күн арнайы көрсетілген.","options":[{"id":"front","text":"Майдан"},{"id":"homefront","text":"Тыл"},{"id":"postwar","text":"Соғыстан кейін"}],"correct":"postwar","explanation":"Ғылымның жаңа орталығы","sources":[{"title":"ҚР ҰҒА тарихы","url":"https://qazscience.gov.kz/category/history-of-nas-rk","publisher":"Қазақстан Республикасының Ұлттық ғылым академиясы","locator":"1946 бөлімі: құрылған күн мен тұңғыш президент","checked_on":"2026-11-03"}]},{"id":"persecution-1952","prompt":"Бекмаханов 1952 жылы 25 жылға сотталды. Ғылыми тұжырымды әкімшілік айыппен жазалау зерттеу еркіндігін шектеді. Бұл жерде даулы нақты күн емес, деректердегі ортақ жыл беріледі.","options":[{"id":"front","text":"Майдан"},{"id":"homefront","text":"Тыл"},{"id":"postwar","text":"Соғыстан кейін"}],"correct":"postwar","explanation":"Ғалымды қудалау","sources":[{"title":"Қоғамдық-саяси және мәдени өмірдегі өзгерістер","url":"https://e-history.kz/kz/amp/history-of-kazakhstan/show/8825","publisher":"e-history.kz","locator":"Бекмахановтың қызметтен босатылуы мен 1952 жылғы үкімі","checked_on":"2026-11-03"}]}]'::jsonb);

do $$ begin
 if (select count(*) from el_zhady_private.practice_sets)<>5 or exists(
  select 1 from el_zhady_private.practice_sets where jsonb_array_length(items)<>case when activity_id='ordering' then 1 else 5 end
 ) then raise exception 'Five complete sourced practice games required';end if;
end $$;
create function el_zhady_private.practice_projection(p_id uuid) returns jsonb
language plpgsql stable security definer set search_path='' as $$
declare a el_zhady_private.practice_attempts; projected jsonb;
begin
 if not el_zhady_private.is_permanent() then raise exception 'REGISTERED_REQUIRED' using errcode='42501';end if;
 select * into a from el_zhady_private.practice_attempts where id=p_id and user_id=auth.uid();
 if not found then raise exception 'PRACTICE_NOT_FOUND' using errcode='42501';end if;
 select jsonb_agg(case when a.completed_at is null then item-'correct'-'explanation'-'sources' else item end order by ord)
 into projected from jsonb_array_elements(a.items) with ordinality as x(item,ord);
 return jsonb_build_object('id',a.id,'activity_id',a.activity_id,'version',a.version,'items',projected,
 'answers',a.answers,'score',a.score,'completed_at',a.completed_at,'max_score',20);
end $$;
create function public.practice_begin(p_activity_id text,p_request_id uuid) returns jsonb
language plpgsql security definer set search_path='' as $$
declare a el_zhady_private.practice_attempts; s el_zhady_private.practice_sets; shuffled jsonb;
begin
 if not el_zhady_private.is_permanent() then raise exception 'REGISTERED_REQUIRED' using errcode='42501';end if;
 if p_request_id is null then raise exception 'INVALID_REQUEST';end if;
 perform pg_advisory_xact_lock(hashtextextended(auth.uid()::text,117));
 select * into s from el_zhady_private.practice_sets where activity_id=p_activity_id;
 if not found then raise exception 'INVALID_ACTIVITY';end if;
 select * into a from el_zhady_private.practice_attempts where user_id=auth.uid() and request_id=p_request_id;
 if found then
  if a.activity_id<>p_activity_id then raise exception 'INVALID_REQUEST';end if;
  return el_zhady_private.practice_projection(a.id);
 end if;
 select * into a from el_zhady_private.practice_attempts where user_id=auth.uid() and activity_id=p_activity_id and completed_at is null;
 if found then return el_zhady_private.practice_projection(a.id);end if;
 if (select count(*) from el_zhady_private.practice_attempts where user_id=auth.uid() and created_at>now()-interval '1 hour')>=40 then raise exception 'RATE_LIMITED';end if;
 select jsonb_agg(item order by random()) into shuffled from jsonb_array_elements(s.items) item;
 insert into el_zhady_private.practice_attempts(user_id,request_id,activity_id,version,items)
 values(auth.uid(),p_request_id,p_activity_id,s.version,shuffled) returning * into a;
 return el_zhady_private.practice_projection(a.id);
end $$;
create function public.practice_state(p_attempt_id uuid) returns jsonb
language sql stable security definer set search_path='' as $$select el_zhady_private.practice_projection(p_attempt_id)$$;
create function public.practice_save(p_attempt_id uuid,p_answers jsonb) returns jsonb
language plpgsql security definer set search_path='' as $$
declare a el_zhady_private.practice_attempts;
begin
 if not el_zhady_private.is_permanent() then raise exception 'REGISTERED_REQUIRED' using errcode='42501';end if;
 if p_answers is null or jsonb_typeof(p_answers)<>'object' or length(p_answers::text)>8000 then raise exception 'INVALID_ANSWERS';end if;
 select * into a from el_zhady_private.practice_attempts where id=p_attempt_id and user_id=auth.uid() for update;
 if not found then raise exception 'PRACTICE_NOT_FOUND' using errcode='42501';end if;
 if a.completed_at is null then update el_zhady_private.practice_attempts set answers=p_answers where id=a.id;end if;
 return el_zhady_private.practice_projection(a.id);
end $$;
create function public.practice_submit(p_attempt_id uuid,p_answers jsonb) returns jsonb
language plpgsql security definer set search_path='' as $$
declare a el_zhady_private.practice_attempts; item jsonb; chosen text; v_score integer:=0; answer_order jsonb; i integer;
begin
 if not el_zhady_private.is_permanent() then raise exception 'REGISTERED_REQUIRED' using errcode='42501';end if;
 perform pg_advisory_xact_lock(hashtextextended(auth.uid()::text,117));
 select * into a from el_zhady_private.practice_attempts where id=p_attempt_id and user_id=auth.uid() for update;
 if not found then raise exception 'PRACTICE_NOT_FOUND' using errcode='42501';end if;
 if a.completed_at is not null then return el_zhady_private.practice_projection(a.id);end if;
 if p_answers is null or jsonb_typeof(p_answers)<>'object' or length(p_answers::text)>8000 then raise exception 'INVALID_ANSWERS';end if;
 if a.activity_id='ordering' then
  answer_order:=p_answers->'order'; item:=a.items->0;
  if jsonb_typeof(answer_order) is distinct from 'array' or jsonb_array_length(answer_order)<>5 or
   (select array_agg(v order by v) from jsonb_array_elements_text(answer_order) v) is distinct from
   (select array_agg(o->>'id' order by o->>'id') from jsonb_array_elements(item->'options') o) then raise exception 'INVALID_ANSWERS';end if;
  for i in 0..4 loop if answer_order->>i=split_part(item->>'correct','>',i+1) then v_score:=v_score+4;end if;end loop;
 else
  if (select count(*) from jsonb_object_keys(p_answers))<>5 then raise exception 'INVALID_ANSWERS';end if;
  for item in select * from jsonb_array_elements(a.items) loop
   chosen:=p_answers->>(item->>'id');
   if chosen is null or not exists(select 1 from jsonb_array_elements(item->'options') o where o->>'id'=chosen) then raise exception 'INVALID_ANSWERS';end if;
   if chosen=item->>'correct' then v_score:=v_score+4;end if;
  end loop;
  if a.activity_id='matching' and (select count(distinct value) from jsonb_each_text(p_answers))<>5 then raise exception 'INVALID_ANSWERS';end if;
 end if;
 update el_zhady_private.practice_attempts set answers=p_answers,score=v_score,completed_at=now() where id=a.id;
 insert into public.practice_results(user_id,activity_id,score,max_score,content_version)
 values(auth.uid(),a.activity_id,v_score,20,a.version)
 on conflict(user_id,activity_id) do update set score=greatest(practice_results.score,excluded.score),
 completed_at=case when excluded.score>=practice_results.score then now() else practice_results.completed_at end,
 content_version=excluded.content_version;
 return el_zhady_private.practice_projection(a.id);
end $$;
create function public.practice_reset() returns void
language plpgsql security definer set search_path='' as $$
begin
 if not el_zhady_private.is_permanent() then raise exception 'REGISTERED_REQUIRED' using errcode='42501';end if;
 perform pg_advisory_xact_lock(hashtextextended(auth.uid()::text,117));
 delete from el_zhady_private.practice_attempts where user_id=auth.uid();
 delete from public.practice_results where user_id=auth.uid();
end $$;
revoke all on function el_zhady_private.practice_projection(uuid) from public,anon,authenticated;
revoke all on function public.practice_begin(text,uuid),public.practice_state(uuid),public.practice_save(uuid,jsonb),public.practice_submit(uuid,jsonb),public.practice_reset() from public,anon,authenticated;
grant execute on function public.practice_begin(text,uuid),public.practice_state(uuid),public.practice_save(uuid,jsonb),public.practice_submit(uuid,jsonb),public.practice_reset() to authenticated;
commit;
