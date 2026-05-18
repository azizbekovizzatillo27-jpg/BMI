import { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useTranslation } from '../i18n/translations';
import { staffAPI, programsAPI, scheduleAPI, newsAPI, researchAPI, studentsAPI } from '../services/api';
import { 
  HiOutlineChatBubbleOvalLeftEllipsis, 
  HiOutlineXMark, 
  HiOutlinePaperAirplane, 
  HiOutlineUsers,
  HiOutlineAcademicCap,
  HiOutlineBookOpen,
  HiOutlineNewspaper,
  HiOutlineMapPin,
  HiOutlineHome,
  HiOutlinePhone,
  HiOutlineEnvelope,
  HiOutlineUserCircle,
  HiOutlineFaceSmile,
  HiOutlineQuestionMarkCircle
} from 'react-icons/hi2';
import { RiRobot2Line } from 'react-icons/ri';

export default function FloatingBot() {
  const { lang } = useApp();
  const { t } = useTranslation(lang);
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  // Knowledge Base State
  const [kb, setKb] = useState({
    staff: [],
    programs: [],
    directions: [],
    news: [],
    research: [],
    materials: [],
    theses: [],
    requirements: null
  });

  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: t('bot.welcome'),
      actions: [
        { label: t('bot.action_staff'), query: "o'qituvchilar", icon: <HiOutlineUsers /> },
        { label: t('bot.action_programs'), query: "yo'nalishlar", icon: <HiOutlineBookOpen /> },
        { label: t('bot.action_news'), query: "yangiliklar", icon: <HiOutlineNewspaper /> },
        { label: t('bot.action_location'), query: "manzil", icon: <HiOutlineMapPin /> }
      ]
    }
  ]);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Fetch Knowledge Base Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [staffRes, programsRes, scheduleRes, newsRes, researchRes, materialsRes, thesesRes, reqsRes] = await Promise.all([
          staffAPI.getAll(),
          programsAPI.getAll(),
          scheduleAPI.getDirections(),
          newsAPI.getAll({ limit: 20 }),
          researchAPI.getAll(),
          studentsAPI.getMaterials(),
          studentsAPI.getTheses(),
          studentsAPI.getRequirements()
        ]);
        
        setKb({
          staff: staffRes.data || [],
          programs: programsRes.data || [],
          directions: scheduleRes.data || [],
          news: newsRes.data || [],
          research: researchRes.data || [],
          materials: materialsRes.data || [],
          theses: thesesRes.data || [],
          requirements: reqsRes.data || null
        });
      } catch (err) {
        console.error("Bot global data fetch error:", err);
      }
    };
    fetchData();
  }, []);

  const getBotResponse = (query) => {
    const q = query.toLowerCase().trim();
    const isUz = lang === 'uz';
    
    // Default actions
    const defaultActions = [
      { label: t('bot.main_menu'), query: "salom", icon: <HiOutlineHome /> },
      { label: t('bot.contact'), query: "manzil", icon: <HiOutlinePhone /> }
    ];

    // 0. Greetings
    if (q === 'salom' || q === 'hi' || q === 'hello' || q === 'assalom' || q.includes('assalomu alaykum')) {
      return {
        text: t('bot.greeting_response'),
        actions: [
          { label: t('bot.action_staff'), query: "o'qituvchilar", icon: <HiOutlineUsers /> },
          { label: t('bot.action_programs'), query: "yo'nalishlar", icon: <HiOutlineBookOpen /> },
          { label: t('bot.action_news'), query: "yangiliklar", icon: <HiOutlineNewspaper /> }
        ]
      };
    }

    // 1. Staff Search
    if (q.includes('o\'qituvchi') || q.includes('ustoz') || q.includes('faculty')) {
      const topTeachers = kb.staff.slice(0, 3).map(s => s[`name_${lang}`]).join('\n• ');
      return {
        text: t('bot.staff_info').replace('{count}', kb.staff.length).replace('{teachers}', topTeachers),
        actions: kb.staff.slice(0, 3).map(s => ({ label: s[`name_${lang}`], query: s[`name_${lang}`] }))
      };
    }

    const teacher = kb.staff.find(s => 
      s.name_uz.toLowerCase().includes(q) || s.name_en.toLowerCase().includes(q) || (s.name_ru && s.name_ru.toLowerCase().includes(q))
    );
    if (teacher) {
      return {
        text: isUz 
          ? `👤 **${teacher.name_uz}**\n🔹 Lavozimi: ${teacher.position_uz}\n📖 Fanlari: ${teacher.subjects_uz?.join(', ')}\n📧 Email: ${teacher.email}`
          : lang === 'ru'
          ? `👤 **${teacher.name_ru}**\n🔹 Должность: ${teacher.position_ru}\n📖 Предметы: ${teacher.subjects_ru?.join(', ')}\n📧 Email: ${teacher.email}`
          : `👤 **${teacher.name_en}**\n🔹 Position: ${teacher.position_en}\n📖 Subjects: ${teacher.subjects_en?.join(', ')}\n📧 Email: ${teacher.email}`,
        actions: defaultActions
      };
    }

    // 2. News Search
    if (q.includes('yangilik') || q.includes('news')) {
      const latest = kb.news[0];
      return {
        text: t('bot.news_latest')
          .replace('{title}', latest?.[`title_${lang}`])
          .replace('{date}', latest?.published_at)
          .replace('{content}', latest?.[`content_${lang}`]?.substring(0, 100)),
        actions: [
          { label: t('bot.all_news'), query: "yangiliklar" },
          { label: t('bot.conferences'), query: "konferensiya" }
        ]
      };
    }

    // 3. Programs
    if (q.includes('yo\'nalish') || q.includes('program')) {
      return {
        text: t('bot.programs_info').replace('{count}', kb.programs.length),
        actions: kb.programs.slice(0, 4).map(p => ({ label: p.code, query: p.code }))
      };
    }

    const program = kb.programs.find(p => 
      p.name_uz.toLowerCase().includes(q) || p.name_en.toLowerCase().includes(q) || (p.name_ru && p.name_ru.toLowerCase().includes(q)) || p.code.includes(q)
    );
    if (program) {
      return {
        text: isUz
          ? `📘 **${program.name_uz}**\n📝 Code: ${program.code}\n⏳ Muddati: ${program.duration_uz}\n\n${program.description_uz}`
          : lang === 'ru'
          ? `📘 **${program.name_ru}**\n📝 Код: ${program.code}\n⏳ Срок: ${program.duration_ru}\n\n${program.description_ru}`
          : `📘 **${program.name_en}**\n📝 Code: ${program.code}\n⏳ Duration: ${program.duration_en}\n\n${program.description_en}`,
        actions: defaultActions
      };
    }

    // 4. Contact
    if (q.includes('manzil') || q.includes('address') || q.includes('kontakt') || q.includes('aloqa')) {
      return {
        text: t('bot.contact_info'),
        actions: defaultActions
      };
    }

    // 5. Fallback
    return {
      text: t('bot.fallback'),
      actions: defaultActions
    };
  };

  const handleSend = (text = inputValue) => {
    if (!text.trim()) return;

    const userMsg = { id: Date.now(), type: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const response = getBotResponse(text);
      const botMsg = {
        id: Date.now() + 1,
        type: 'bot',
        text: response.text,
        actions: response.actions
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 800);
  };

  return (
    <div style={{ position: 'fixed', bottom: 'var(--space-8)', right: 'var(--space-8)', zIndex: 1000 }}>
      {isOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div className="chatbot-header-info">
              <div className="chatbot-avatar"><RiRobot2Line /></div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>ATT Assistant</div>
                <div className="chatbot-status">{t('bot.status_online')}</div>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '1.2rem', display: 'flex' }}
            >
              <HiOutlineXMark />
            </button>
          </div>

          <div className="chatbot-messages">
            {messages.map((msg) => (
              <div key={msg.id} className={`msg-container ${msg.type === 'bot' ? 'msg-bot-container' : 'msg-user-container'}`}>
                <div className={`mini-avatar ${msg.type === 'bot' ? 'bot-avatar' : 'user-avatar'}`}>
                  {msg.type === 'bot' ? <RiRobot2Line /> : <HiOutlineUserCircle />}
                </div>
                <div>
                  <div className={`msg-bubble ${msg.type === 'bot' ? 'msg-bot' : 'msg-user'}`}>
                    {msg.text}
                  </div>
                  {msg.type === 'bot' && msg.actions && (
                    <div className="msg-actions">
                      {msg.actions.map((action, i) => (
                        <button 
                          key={i} 
                          className="msg-chip"
                          onClick={() => handleSend(action.query)}
                        >
                          <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            {action.icon} {action.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="typing-indicator">
                <div className="typing-dot" />
                <div className="typing-dot" />
                <div className="typing-dot" />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form 
            className="chatbot-input-area" 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          >
            <input 
              className="chatbot-input"
              placeholder={t('bot.placeholder')}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <button 
              className="chatbot-send" 
              type="submit"
              disabled={!inputValue.trim()}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <HiOutlinePaperAirplane />
            </button>
          </form>
        </div>
      )}

      {!isOpen && (
        <div style={{ position: 'relative' }}>
          <div className="animate-fadeIn" style={{
            position: 'absolute', right: '70px', bottom: '10px',
            background: 'var(--bg-card)', padding: '8px 16px', borderRadius: '12px',
            boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border-color)',
            fontSize: 'max(12px, 0.8rem)', whiteSpace: 'nowrap', pointerEvents: 'none'
          }}>
            {t('bot.help_prompt')}
          </div>
          <button
            onClick={() => setIsOpen(true)}
            style={{
              width: '64px', height: '64px', borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--primary-600), var(--primary-700))',
              color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '2rem', boxShadow: '0 8px 30px rgba(37, 99, 235, 0.4)',
              border: 'none', cursor: 'pointer', transition: 'all 0.3s'
            }}
            className="animate-float"
          >
            <HiOutlineChatBubbleOvalLeftEllipsis />
          </button>
        </div>
      )}
    </div>
  );
}
