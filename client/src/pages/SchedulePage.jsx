import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useTranslation } from '../i18n/translations';
import { scheduleAPI } from '../services/api';
import { 
  HiOutlineHome, 
  HiOutlineChevronRight, 
  HiOutlineBuildingLibrary, 
  HiOutlineUsers,
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineBookOpen,
  HiOutlineMapPin,
  HiCircleStack,
  HiOutlineInbox
} from 'react-icons/hi2';

const DAY_COLORS = {
  monday: '#2563eb', tuesday: '#7c3aed', wednesday: '#059669',
  thursday: '#d97706', friday: '#dc2626', saturday: '#475569'
};

export default function SchedulePage() {
  const { lang } = useApp();
  const { t } = useTranslation(lang);
  const [directions, setDirections] = useState([]);
  const [selectedDir, setSelectedDir] = useState('');
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeDay, setActiveDay] = useState('monday');

  useEffect(() => {
    scheduleAPI.getDirections().then(res => {
      setDirections(res.data);
      if (res.data.length > 0) {
        setSelectedDir(res.data[0].id);
      }
    });
  }, []);

  useEffect(() => {
    if (!selectedDir) return;
    scheduleAPI.getGroups(selectedDir).then(res => {
      setGroups(res.data);
      if (res.data.length > 0) {
        setSelectedGroup(res.data[0].id);
      } else {
        setSelectedGroup('');
        setSchedule(null);
      }
    });
  }, [selectedDir]);

  useEffect(() => {
    if (!selectedGroup) return;
    setLoading(true);
    scheduleAPI.getByGroup(selectedGroup).then(res => {
      setSchedule(res.data.schedule);
      setLoading(false);
    }).catch(() => {
        setLoading(false);
        setSchedule(null);
    });
  }, [selectedGroup]);

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

  const todayDay = days[new Date().getDay() - 1] || 'monday';

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="page-hero-content">
            <div className="breadcrumb">
              <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <HiOutlineHome style={{ fontSize: '1rem' }} /> {t('nav.home')}
              </Link>
              <span className="breadcrumb-sep"><HiOutlineChevronRight /></span>
              <span>{t('schedule.title')}</span>
            </div>
            <h1>{t('schedule.title')}</h1>
            <p>{t('schedule.subtitle')}</p>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: 'var(--bg-primary)' }}>
        <div className="container">
          {/* Direction & Group Selector */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', marginBottom: 'var(--space-10)' }}>
            {/* Step 1: Direction */}
            <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ padding: '4px 12px', background: 'var(--primary-600)', color: 'white', borderRadius: 'var(--radius-full)', fontSize: '0.7rem', fontWeight: 900 }}>1</div>
              <label style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: 'var(--font-size-sm)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {t('schedule.select_direction')}:
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                {directions.map(d => (
                    <button key={d.id}
                      onClick={() => setSelectedDir(d.id)}
                      className={`btn ${selectedDir === d.id ? 'btn-primary' : 'btn-ghost'} btn-sm`}
                      style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: 6 }}
                    >
                      <HiOutlineBuildingLibrary /> {d[`name_${lang}`]}
                    </button>
                ))}
              </div>
            </div>

            {/* Step 2: Group */}
            {selectedDir && groups.length > 0 && (
                <div className="animate-fadeIn" style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div style={{ padding: '4px 12px', background: 'var(--accent-500)', color: 'white', borderRadius: 'var(--radius-full)', fontSize: '0.7rem', fontWeight: 900 }}>2</div>
                    <label style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: 'var(--font-size-sm)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {t('schedule.select_group_step')}:
                    </label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                        {groups.map(g => (
                            <button key={g.id}
                                onClick={() => setSelectedGroup(g.id)}
                                className={`btn ${selectedGroup === g.id ? 'btn-primary' : 'btn-ghost'} btn-sm`}
                                style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: 6 }}
                            >
                                <HiOutlineUsers /> {g.name}
                            </button>
                        ))}
                    </div>
                </div>
            )}
            
            {selectedDir && groups.length === 0 && (
                <div style={{ padding: 'var(--space-4)', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)', color: 'var(--text-muted)', fontSize: 'var(--font-size-sm)' }}>
                    {t('schedule.no_groups')}
                </div>
            )}
          </div>

          {/* Day tabs */}
          <div className="tab-list" style={{ marginBottom: 'var(--space-8)', overflowX: 'auto' }}>
            {days.map(day => (
              <button key={day}
                className={`tab-btn ${activeDay === day ? 'active' : ''}`}
                onClick={() => setActiveDay(day)}
                style={activeDay === day ? { borderColor: DAY_COLORS[day], color: DAY_COLORS[day] } : {}}
              >
                {day === todayDay && <span style={{ marginRight: 8, color: '#ef4444', height: 8, width: 8, background: '#ef4444', borderRadius: '50%', display: 'inline-block' }}></span>}
                {t(`schedule.days.${day}`)}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="loading-state"><div className="spinner" /></div>
          ) : schedule && schedule[activeDay] ? (
            schedule[activeDay].length === 0 ? (
              <div style={{ textAlign: 'center', padding: 'var(--space-16)', color: 'var(--text-muted)' }}>
                <div style={{ fontSize: '4rem', marginBottom: 'var(--space-4)', display: 'flex', justifyContent: 'center' }}>
                  <HiOutlineInbox />
                </div>
                <p>{t('schedule.no_classes')}</p>
              </div>
            ) : (
              <div style={{
                background: 'var(--bg-card)', borderRadius: 'var(--radius-2xl)',
                border: '1px solid var(--border-color)', overflow: 'hidden',
                boxShadow: 'var(--shadow-lg)'
              }}>
                <div style={{
                  background: `linear-gradient(135deg, ${DAY_COLORS[activeDay]}, ${DAY_COLORS[activeDay]}cc)`,
                  padding: 'var(--space-5) var(--space-6)',
                  display: 'flex', alignItems: 'center', gap: 'var(--space-3)'
                }}>
                  <HiOutlineCalendar style={{ fontSize: '1.5rem', color: 'white' }} />
                  <h3 style={{ color: 'white', fontWeight: 700, fontSize: 'var(--font-size-xl)' }}>
                    {t(`schedule.days.${activeDay}`)} — {selectedGroup}
                  </h3>
                </div>
                <div style={{ padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                  {schedule[activeDay].map((lesson, i) => (
                    <div key={i} style={{
                      display: 'grid', gridTemplateColumns: '140px 1fr auto',
                      gap: 'var(--space-4)', alignItems: 'center',
                      padding: 'var(--space-5)', borderRadius: 'var(--radius-xl)',
                      background: 'var(--bg-secondary)', border: '1px solid var(--border-color)',
                      transition: 'all 0.2s'
                    }}
                      onMouseOver={e => e.currentTarget.style.borderColor = DAY_COLORS[activeDay]}
                      onMouseOut={e => e.currentTarget.style.borderColor = 'var(--border-color)'}
                    >
                      <div>
                        <div className="schedule-time" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <HiOutlineClock /> {lesson.time}
                        </div>
                        <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-muted)', marginTop: 2 }}>
                          {t('schedule.class_time')}
                        </div>
                      </div>
                      <div>
                        <div className="schedule-subject" style={{ fontSize: 'var(--font-size-base)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
                          <HiOutlineBookOpen style={{ color: DAY_COLORS[activeDay] }} /> {lesson.subject}
                        </div>
                        <div className="schedule-teacher" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <HiOutlineUsers style={{ fontSize: '0.9rem' }} /> {lesson.teacher}
                        </div>
                      </div>
                      <div>
                        <span className="schedule-room" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <HiOutlineMapPin /> {lesson.room}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          ) : null}
        </div>
      </section>
    </>
  );
}
