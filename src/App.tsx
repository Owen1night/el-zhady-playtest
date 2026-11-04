import {FactCollection} from './features/FactCollection';
import {VideoCollection} from './features/VideoCollection';
import { PracticePage, PracticeScores } from './practice/PracticePage';
import { AccountGate } from './features/Shared';
import { LearningAtlas } from './features/LearningAtlas';
import { LearningReadings, LearningTimeline, SourceCatalog } from './features/Learning';
import { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowRight, ArrowUpRight, BookOpen, Check, ChevronRight, Clock3, Copy, GraduationCap, Landmark, Menu, Monitor, QrCode, Shield, X, UserRound, Users } from 'lucide-react';
import QRCode from 'qrcode';
import { sectionPlans, sections, sources } from './data/content';
import type { SectionId } from './data/types';
import { siteUrl } from './backend/config';
import { useAuth } from './auth/AuthProvider';
import { readRoomNotice, clearRoomNotice } from './lib/room-exit';
import { leaveLive } from './live/navigationGuard';
import { mayNavigate } from './live/navigationGuard';
import { parseRoute } from './lib/navigation';
import { AuthPage } from './features/AuthPage';
import { ProfilePage } from './features/ProfilePage';
import { JoinPage } from './features/JoinPage';
import { LobbyPage } from './features/LobbyPage';
import { AdminPage } from './features/AdminPage';
import { readPreferences, resetPreferences, savePreferences } from './lib/storage';
import { ArchiveArt } from './components/ArchiveArt';
import { Dialog } from './components/Dialog';

const deploymentUrl = siteUrl;
const accountSections: Record<string, { label: string; eyebrow: string; title: string; description: string }> = {
  auth: { label: 'Кіру', eyebrow: 'АККАУНТ / ҚОНАҚ', title: 'Өз оқу жолыңыз.', description: 'Google арқылы тұрақты аккаунтпен кіріңіз немесе сайысқа қонақ ретінде қосылыңыз.' },
  profile: { label: 'Менің профилім', eyebrow: 'ЖЕКЕ КЕҢІСТІК', title: 'Менің профилім', description: 'Жеке жаттығу нәтижелері мен сайыс тарихы. Email жарияланбайды.' },
  join: { label: 'Сайысқа қосылу', eyebrow: 'ТІКЕЛЕЙ САЙЫС / ҚОСЫЛУ', title: 'Бір бөлмеде бас қосайық.', description: 'Көрсетілетін есім мен бөлме коды жеткілікті. Қонақтарға Google немесе email қажет емес.' },
  lobby: { label: 'Сайыс бөлмесі', eyebrow: 'ТІКЕЛЕЙ САЙЫС', title: 'Тікелей сайыс', description: 'Викторина, карта және уақыт желісі. Жүргізуші әр кезеңді өзі бастайды; барлық экран бір сервер уақытына сүйенеді.' },
  admin: { label: 'Әкімші', eyebrow: 'ҚОРҒАЛҒАН БАСҚАРУ', title: 'Сайыс бөлмелерін дайындау', description: 'Тек серверде рұқсат берілген әкімшілерге арналған басқару аймағы.' },
};
const link = (id: SectionId) => `#/${id}`;
function Draft({ children = 'Материал дайындалуда' }: { children?: React.ReactNode }) { return <span className="draft"><span />{children}</span>; }

export default function App() {
  const auth = useAuth();
  const [location, setLocation] = useState(() => parseRoute(window.location.hash));
  const current = location.name;
  const [roomNotice, setRoomNotice] = useState(readRoomNotice);
  useEffect(() => {
    const exit = (event: Event) => { setRoomNotice((event as CustomEvent<string>).detail); leaveLive('#/home'); };
    window.addEventListener('el-zhady:room-exit', exit);
    return () => window.removeEventListener('el-zhady:room-exit', exit);
  }, []);
  const [preferences, setPreferences] = useState(readPreferences);
  const [, setStorageOk] = useState(true);
  const [modal, setModal] = useState<'menu' | 'share' | 'reset' | string | null>(null);
    const [qr, setQr] = useState('');
  const [copyMessage, setCopyMessage] = useState('');
  const main = useRef<HTMLElement>(null);
  const changed = useRef(false);
  useEffect(() => {
    let acceptedHash = window.location.hash;
    function onHash() {
      const destination = window.location.hash;
      if (destination === acceptedHash) return;
      if (!mayNavigate(destination)) { history.replaceState(null, '', `${window.location.pathname}${window.location.search}${acceptedHash}`); return; }
      acceptedHash = destination; changed.current = true; setLocation(parseRoute(destination)); setModal(null); window.scrollTo({ top: 0 });
    }
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  useEffect(() => {
    if (changed.current) main.current?.focus({ preventScroll: true });
    const label = sections.find(section => section.id === current)?.label || accountSections[current]?.label || 'Бөлім табылмады';
    document.title = `${label} · Ел жады`;
    const publicSection = sections.find(s => s.id === current);
    if (publicSection) setPreferences(previous => previous.visited.includes(publicSection.id) ? previous : { ...previous, visited: [...previous.visited, publicSection.id] });
  }, [current, location]);
  useEffect(() => { setStorageOk(savePreferences(preferences)); }, [preferences]);
  useEffect(() => {
    document.documentElement.classList.toggle('presentation', preferences.presentation);
    return () => document.documentElement.classList.remove('presentation');
  }, [preferences.presentation]);
  useEffect(() => {
    if (modal === 'share' && deploymentUrl) QRCode.toDataURL(deploymentUrl, { width: 256, margin: 2, color: { dark: '#292925', light: '#ffffff' } }).then(setQr).catch(() => setQr(''));
  }, [modal]);
  const section = sections.find(item => item.id === current) || accountSections[current];
  async function copyUrl() {
    if (!deploymentUrl) return;
    try { await navigator.clipboard.writeText(deploymentUrl); setCopyMessage('Сілтеме көшірілді.'); }
    catch { setCopyMessage('Көшіру қолжетімсіз. Сілтемені мәтіннен көшіріңіз.'); }
  }
  const timeline = <LearningTimeline />;
  return <>
    <a className="skip-link" href="#main" onClick={e => { e.preventDefault(); main.current?.focus(); main.current?.scrollIntoView(); }}>Негізгі мазмұнға өту</a>
    <header className="site-header"><div className="header-inner">
      <a className="brand" href={link('home')} aria-label="Ел жады — басты бет"><span className="brand-mark">ЕЖ</span><span className="brand-name">Ел жады<span>ҚАЗАҚСТАН · 1939–1953</span></span></a>
      <nav className="desktop-nav" aria-label="Негізгі навигация">{(['facts', 'heroes', 'timeline', 'games'] as const).map(id => <a key={id} href={link(id)} aria-current={current === id ? 'page' : undefined}>{sections.find(s => s.id === id)?.label}</a>)}<a href="#/join" aria-current={current === 'join' ? 'page' : undefined}>Ойынға қосылу</a></nav>
      <div className="header-actions"><a className="account-link" href={auth.identity && !auth.identity.anonymous ? "#/profile" : "#/auth"} aria-label={auth.identity && !auth.identity.anonymous ? "Менің профилім" : "Аккаунтқа кіру"}><UserRound size={20} /><span>{auth.identity && !auth.identity.anonymous ? "Профиль" : "Кіру"}</span></a><button className="icon-button presentation-button" title="Сыныпқа проекциялау" aria-label="Сыныпқа проекциялау режимі" aria-pressed={preferences.presentation} onClick={() => setPreferences(p => ({ ...p, presentation: !p.presentation }))}><Monitor size={20} /><span>Проектор</span></button><button className="menu-button" aria-label="Бөлімдер" onClick={() => setModal('menu')} aria-haspopup="dialog"><Menu size={20} /><span>Бөлімдер</span></button></div>
    </div></header>
    {preferences.presentation && <div className="presentation-banner"><Monitor size={18} /> Сыныпқа проекциялау · мәтін үлкейтілді <button onClick={() => setPreferences(p => ({ ...p, presentation: false }))}>Шығу <X size={16} /></button></div>}
    <main id="main" tabIndex={-1} ref={main}>
      {roomNotice && <div className="page-width room-exit-notice" role="alert"><strong>{roomNotice}</strong><button type="button" className="icon-button" aria-label="Хабарламаны жабу" onClick={() => { clearRoomNotice(); setRoomNotice(''); }}><X size={20} /></button></div>}
      {current === 'home' ? <>
        <section className="hero page-width">
          <div className="hero-copy"><div className="eyebrow"><span className="small-rule" />ТАРИХТЫ ТАНУ. ЖАДТЫ САҚТАУ.</div><h1>Ел жады<span>Қазақстан,<br /><em>1939–1953.</em></span></h1><p className="hero-description">Ұлы Отан соғысы және соғыстан кейінгі Қазақстан <span>(1939–1953 жж.)</span></p><p className="hero-intro">Өткенді дерек арқылы түсінуге арналған<br className="desktop-break" /> университеттік оқу кеңістігі.</p><div className="hero-actions"><a className="button primary" href={link('timeline')}>Зерттеуді бастау <ArrowRight size={19} /></a><button className="button text-button" onClick={() => setModal('share')}><QrCode size={19} /> Телефонмен ашу</button></div><div className="hero-note"><span className="status-dot" /> Әзірлеу нұсқасы <span className="note-divider">/</span> Мазмұн дереккөздермен толықтырылады</div></div>
          <ArchiveArt />
        </section>
        <div className="collection-strip"><div className="page-width strip-inner"><div><BookOpen size={22} /><span>Бір тақырып. <strong>Бірнеше көзқарас.</strong></span></div><span>Майдан · Тыл · Ғылым · Мәдениет</span><a href="#explore" onClick={e => { e.preventDefault(); document.getElementById('explore')?.scrollIntoView(); }}>Бөлімдерді қарау <ArrowDown size={17} /></a></div></div>
        <section className="page-width section-space" id="explore"><div className="section-heading"><div><span className="eyebrow">ОҚУ БАҒЫТЫ</span><h2>Тарихқа үш қадам</h2></div><p>Уақытты бағдарлаңыз. Тақырыпты зерттеңіз.<br />Біліміңізді бекітуге дайындалыңыз.</p></div>
          <div className="journey-grid">{[{ id: 'timeline' as const, n: '01', title: 'Уақытты бағдарлау', text: '1939–1953 жылдар. Кезеңдер, оқиғалар және олардың байланысы.', Icon: Clock3, meta: 'ХРОНОЛОГИЯ' }, { id: 'front' as const, n: '02', title: 'Тарихты зерттеу', text: 'Майдан мен тыл. Адамдар, еңбек және соғыстан кейінгі өмір.', Icon: Landmark, meta: 'ТАҚЫРЫПТЫҚ БӨЛІМДЕР' }, { id: 'games' as const, n: '03', title: 'Білімді бекіту', text: 'Бес түрлі тапсырма. Сақталатын жеке нәтиже және бес ойынның қорытындысы.', Icon: GraduationCap, meta: 'ИНТЕРАКТИВТІ ӘРЕКЕТТЕР' }].map(item => <a className="journey-card" key={item.id} href={link(item.id)}><div className="journey-top"><span>{item.n}</span><item.Icon size={29} strokeWidth={1.2} /></div><h3>{item.title}</h3><p>{item.text}</p><div className="journey-bottom"><span>{item.meta}</span><ArrowUpRight size={22} /></div></a>)}</div>
        </section>
        <section className="page-width rubric-shortcuts" aria-label="Тақырыптың негізгі жинақтары"><a className="button primary" href="#/facts">10 тезис · 30 факт</a><a className="button secondary" href="#/heroes">11 соғыс қаһарманы</a></section><section className="timeline-section"><div className="page-width section-space"><div className="section-heading"><div><span className="eyebrow">1939 — 1953</span><h2>Бір дәуірдің белестері</h2></div><a className="inline-link" href={link('timeline')}>Уақыт желісін ашу <ArrowRight size={18} /></a></div>{timeline}<p className="caption">Әр оқиғаға дереккөз берілген. Кезең сүзгісін басу немесе пернетақта арқылы таңдаңыз.</p></div></section>
        <section className="page-width section-space"><div className="editorial-note"><Shield size={30} strokeWidth={1.2} /><div><span className="eyebrow">ДЕРЕККЕ ҚҰРМЕТ</span><h2>Тарих дәлдіктен басталады.</h2><p>Алғашқы оқу мәтіндері мен уақыт желісі ашық қолжетімді. Әр тұжырымның дереккөзі көрсетілген. 10 тезис, 30 жеке факт және 11 соғыс қаһарманының профильдері жарияланған. Академиялық рецензия мен үш тақырыптық бейне әлі қажет.</p></div><a className="inline-link" href={link('sources')}>Дереккөздер <ArrowUpRight size={18} /></a></div></section>
      </> : <div className="page-width inner-page">
        <a className="breadcrumb" href={link('home')}>Басты бет <ChevronRight size={14} /><span>{section?.label || 'Бөлім табылмады'}</span></a>
        <div className="page-heading"><span className="eyebrow">{section?.eyebrow || '404 / Навигация'}</span><h1>{section?.title || 'Бұл бөлім табылмады'}</h1><p>{section?.description || 'Бөлімдер мәзірінен оқу бағытын таңдаңыз.'}</p>{current !== 'results' && !['timeline','front','heroes','homefront','postwar','facts','sources','games','videos'].includes(current) && !accountSections[current] && <Draft />}</div>
        {current === 'missing' && <a className="button primary" href={link('home')}>Басты бетке оралу <ArrowRight size={18} /></a>}
        {current === 'timeline' && <>{timeline}<LearningReadings section="front" /></>}
        {sectionPlans[current] && <>{current==='front'&&<LearningAtlas />}<LearningReadings section={current} /></>}
        {current === 'facts' && <FactCollection/>}
        {current === 'videos' && <VideoCollection/>}
        {current === 'games' && <PracticePage activity={location.params.get('activity')} />}
        {current === 'results' && <AccountGate destination="#/results"><PracticeScores /><a className="inline-link" href="#/profile">Сайыс тарихы мен жеке профиль →</a></AccountGate>}
        {current === 'auth' && <AuthPage next={location.params.get('next')} />}
        {current === 'profile' && <ProfilePage next={location.params.get('next')} />}
        {current === 'join' && <JoinPage key={location.params.get('code')} code={location.params.get('code')} />}
        {current === 'lobby' && <LobbyPage roomId={location.params.get('room')} />}
        {current === 'admin' && <AdminPage />}
        {current === 'sources' && <><SourceCatalog /><div className="source-rules"><div><span className="eyebrow">01 / МӘТІН</span><h2>Нақты сілтеме</h2><p>Автор, еңбек атауы, баспа, жыл, бет немесе мұрағаттық шифр. Интернет материалында нақты URL мен қаралған күн.</p></div><div><span className="eyebrow">02 / МЕДИА</span><h2>Ашық атрибуция</h2><p>Сурет пен картаның авторы, коллекциясы, лицензиясы және сипаттамасы. Бейненің авторы мен тексерілген сілтемесі.</p></div><div><span className="eyebrow">03 / ТЕКСЕРУ</span><h2>Жауапқа негіздеме</h2><p>Әр дұрыс жауап түсіндірмемен және дереккөзбен бекітіледі. Тексерілмеген нұсқалар бағалауға жіберілмейді.</p></div></div><p className="caption">Тіркелген дереккөз саны: {sources.length}. Басты беттегі композиция — сайт үшін жасалған көркем графика; тарихи сурет немесе құжат емес.</p></>}
      </div>}
    </main>
    {current === 'home' && <section className="page-width competition-callout"><div><span className="eyebrow">БІРГЕ ҚАТЫСУ</span><h2>Сайысқа аккаунтсыз да қосылыңыз.</h2><p>Жүргізуші берген бөлме коды мен есіміңізді енгізіңіз. Жүргізуші бастаған 10 сұрақтық тікелей викторинаға қатысыңыз.</p></div><a className="button primary" href="#/join"><Users size={19} /> Сайысқа қосылу</a></section>}
    <footer className="site-footer"><div className="page-width"><div className="footer-top"><div><a className="footer-brand" href={link('home')}>Ел жады<span>Қазақстан, 1939–1953</span></a><p>Өткенді түсіну — келешекке жауапкершілік.</p></div><div className="footer-links"><a href={link('sources')}>Дереккөздер <ArrowUpRight size={16} /></a><a href={link('results')}>Менің нәтижем <ArrowUpRight size={16} /></a><button onClick={() => setModal('share')}>Сайтпен бөлісу <QrCode size={17} /></button></div></div><div className="footer-bottom"><span>Университеттік оқу жобасы</span><span>3-кезең · мазмұн әзірленуде</span><span>Қазақ тілінде</span></div></div></footer>
    {modal === 'menu' && <Dialog title="Оқу бөлімдері" wide onClose={() => setModal(null)}><div className="projector-menu"><button type="button" className="button secondary" aria-pressed={preferences.presentation} onClick={() => setPreferences(p => ({...p,presentation:!p.presentation}))}><Monitor size={20} />Сыныпқа проекциялау: {preferences.presentation ? 'қосулы' : 'өшірулі'}</button><p>Проекторға мәтін мен кеңістікті үлкейтеді. Ойын жүргізу мен қосылу қалыпты режимде де жұмыс істейді.</p></div><nav className="all-sections" aria-label="Барлық бөлімдер">{sections.map((s, i) => <a key={s.id} href={link(s.id)} aria-current={current === s.id ? 'page' : undefined} onClick={() => setModal(null)}><span>{String(i).padStart(2, '0')}</span>{s.label}<ArrowUpRight size={18} /></a>)}</nav><nav className="account-menu" aria-label="Аккаунт және сайыс"><a href="#/join" onClick={() => setModal(null)}>Ойынға қосылу <Users size={18} /></a><a href="#/profile" onClick={() => setModal(null)}>Менің профилім <UserRound size={18} /></a>{auth.admin && <a href="#/admin" onClick={() => setModal(null)}>Әкімші <Shield size={18} /></a>}</nav><p className="caption">Тарихи мазмұн әзірленуде. Қоғамдық бөлімдерді оқу үшін аккаунт қажет емес.</p></Dialog>}
    {modal === 'share' && <Dialog title="Телефонмен жалғастыру" onClose={() => setModal(null)}>{deploymentUrl ? <div className="share-content">{qr ? <img width={256} height={256} src={qr} alt="Сайттың жалпыға ашық сілтемесіне арналған QR-код" /> : <p>QR-код әлі дайын емес. Төмендегі сілтемені пайдаланыңыз.</p>}<a href={deploymentUrl}>{deploymentUrl}</a><button className="button primary" onClick={copyUrl}>{copyMessage.startsWith('Сілтеме') ? <Check size={18} /> : <Copy size={18} />} Сілтемені көшіру</button><p role="status">{copyMessage}</p></div> : <div className="share-content"><QrCode size={54} strokeWidth={1} /><h3>Жария сілтеме әлі бапталмаған</h3><p>Нақты GitHub Pages мекенжайы жарияланып, тексерілгеннен кейін осы жерде QR-код пен бөлісу сілтемесі пайда болады.</p><Draft>Жариялануы расталмаған</Draft></div>}</Dialog>}
    {modal === 'reset' && <Dialog title="Баптауларды тазарту" onClose={() => setModal(null)}><p>Осы браузердегі қаралған бөлімдер тізімі мен көрсетілім режимі тазартылады. Сервердегі профиль мен сайыс нәтижелері өзгермейді.</p><div className="dialog-actions"><button className="button secondary" onClick={() => setModal(null)}>Бас тарту</button><button className="button primary" onClick={() => { const ok = resetPreferences(); setPreferences({ presentation: false, visited: sections.some(s => s.id === current) ? [current as SectionId] : [] }); setStorageOk(ok); setModal(null); }}>Тазарту</button></div></Dialog>}
  </>;
}
