import { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { newsAPI, staffAPI, contactAPI, statsAPI, galleryAPI, programsAPI, researchAPI, authAPI } from '../services/api';
import { 
  HiOutlineChartBar, 
  HiOutlineNewspaper, 
  HiOutlineUsers, 
  HiOutlineCalendar, 
  HiOutlinePhoto, 
  HiOutlineEnvelope,
  HiOutlineSun,
  HiOutlineMoon,
  HiOutlineHome,
  HiOutlineArrowLeftOnRectangle,
  HiOutlinePlus,
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiOutlineAcademicCap,
  HiOutlineDocumentText,
  HiOutlineTrophy,
  HiOutlineBookOpen,
  HiOutlineShieldCheck
} from 'react-icons/hi2';
import logo from '../assets/logo.png';
import AdminSchedule from '../components/admin/AdminSchedule';
import NewsModal from '../components/admin/NewsModal';
import StaffModal from '../components/admin/StaffModal';
import GalleryModal from '../components/admin/GalleryModal';
import ReplyModal from '../components/admin/ReplyModal';
import ProgramModal from '../components/admin/ProgramModal';
import ResearchModal from '../components/admin/ResearchModal';
import ConfirmModal from '../components/admin/ConfirmModal';
import AdminUsersModal from '../components/admin/AdminUsersModal';

export default function AdminPage() {
  const { user, token, lang, addToast, logout, toggleTheme, theme } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);
  
  // Data states
  const [stats, setStats] = useState(null);
  const [news, setNews] = useState([]);
  const [staff, setStaff] = useState([]);
  const [messages, setMessages] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [research, setResearch] = useState([]);
  const [admins, setAdmins] = useState([]);

  // Modal states
  const [isNewsModalOpen, setIsNewsModalOpen] = useState(false);
  const [selectedNews, setSelectedNews] = useState(null);
  
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);

  const [isProgramModalOpen, setIsProgramModalOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);

  const [isResearchModalOpen, setIsResearchModalOpen] = useState(false);
  const [selectedResearch, setSelectedResearch] = useState(null);

  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  const [confirmConfig, setConfirmConfig] = useState({ isOpen: false, onConfirm: null, message: '' });

  // Redirect if not admin
  if (!user || user.role !== 'admin') {
    return <Navigate to="/admin-login" replace />;
  }

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'dashboard') {
        const res = await statsAPI.getAll();
        setStats(res.data);
      } else if (activeTab === 'news') {
        const res = await newsAPI.getAll();
        setNews(res.data);
      } else if (activeTab === 'staff') {
        const res = await staffAPI.getAll();
        setStaff(res.data);
      } else if (activeTab === 'messages') {
        const res = await contactAPI.getAll();
        setMessages(res.data);
      } else if (activeTab === 'gallery') {
        const res = await galleryAPI.getAll();
        setGallery(res.data);
      } else if (activeTab === 'programs') {
        const res = await programsAPI.getAll();
        setPrograms(res.data);
      } else if (activeTab === 'research') {
        const res = await researchAPI.getAll();
        setResearch(res.data);
      } else if (activeTab === 'admins') {
        const res = await authAPI.getAdmins();
        setAdmins(res.data);
      }
    } catch (err) {
      addToast('Ma\'lumot yuklashda xatolik', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNews = (id) => {
    setConfirmConfig({
      isOpen: true,
      message: 'Ushbu yangilikni o\'chirmoqchimisiz?',
      onConfirm: async () => {
        try {
          await newsAPI.delete(id);
          addToast('O\'chirildi', 'success');
          fetchData();
        } catch (err) {
          addToast('Xatolik yuz berdi', 'error');
        }
      }
    });
  };

  const handleDeleteStaff = (id) => {
    setConfirmConfig({
      isOpen: true,
      message: 'Ushbu o\'qituvchini o\'chirmoqchimisiz?',
      onConfirm: async () => {
        try {
          await staffAPI.delete(id);
          addToast('O\'chirildi', 'success');
          fetchData();
        } catch (err) {
          addToast('Xatolik yuz berdi', 'error');
        }
      }
    });
  };

  const handleDeleteMessage = (id) => {
    setConfirmConfig({
      isOpen: true,
      message: 'Ushbu xabarni o\'chirmoqchimisiz?',
      onConfirm: async () => {
        try {
          await contactAPI.delete(id);
          addToast('Xabar o\'chirildi', 'success');
          fetchData();
        } catch (err) {
          addToast('Xatolik yuz berdi', 'error');
        }
      }
    });
  };

  const handleDeleteGallery = (id) => {
    setConfirmConfig({
      isOpen: true,
      message: 'Ushbu rasmni o\'chirmoqchimisiz?',
      onConfirm: async () => {
        try {
          await galleryAPI.delete(id);
          addToast('Rasm o\'chirildi', 'success');
          fetchData();
        } catch (err) {
          addToast('Xatolik yuz berdi', 'error');
        }
      }
    });
  };

  const handleDeleteProgram = (id) => {
    setConfirmConfig({
      isOpen: true,
      message: 'Ushbu yo\'nalishni o\'chirmoqchimisiz?',
      onConfirm: async () => {
        try {
          await programsAPI.delete(id);
          addToast('O\'chirildi', 'success');
          fetchData();
        } catch (err) {
          addToast('Xatolik yuz berdi', 'error');
        }
      }
    });
  };

  const handleDeleteResearch = (id) => {
    setConfirmConfig({
      isOpen: true,
      message: 'Ushbu ilmiy ishni o\'chirmoqchimisiz?',
      onConfirm: async () => {
        try {
          await researchAPI.delete(id);
          addToast('O\'chirildi', 'success');
          fetchData();
        } catch (err) {
          addToast('Xatolik yuz berdi', 'error');
        }
      }
    });
  };

  const handleDeleteAdmin = (id) => {
    setConfirmConfig({
      isOpen: true,
      message: 'Ushbu adminni o\'chirmoqchimisiz? Diqqat, bu amalni ortga qaytarib bo\'lmaydi!',
      onConfirm: async () => {
        try {
          await authAPI.deleteAdmin(id);
          addToast('Admin o\'chirildi', 'success');
          fetchData();
        } catch (err) {
          addToast(err.response?.data?.error || 'Xatolik yuz berdi', 'error');
        }
      }
    });
  };

  const handleOpenNewsModal = (item = null) => {
    setSelectedNews(item);
    setIsNewsModalOpen(true);
  };

  const handleOpenStaffModal = (item = null) => {
    setSelectedStaff(item);
    setIsStaffModalOpen(true);
  };

  const handleOpenReplyModal = (msg) => {
    setSelectedMessage(msg);
    setIsReplyModalOpen(true);
  };

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <HiOutlineChartBar /> },
    { id: 'news', label: 'Yangiliklar', icon: <HiOutlineNewspaper /> },
    { id: 'staff', label: 'O\'qituvchilar', icon: <HiOutlineUsers /> },
    { id: 'programs', label: 'Yo\'nalishlar', icon: <HiOutlineAcademicCap /> },
    { id: 'research', label: 'Ilmiy faoliyat', icon: <HiOutlineDocumentText /> },
    { id: 'schedule', label: 'Dars jadvallari', icon: <HiOutlineCalendar /> },
    { id: 'gallery', label: 'Galereya', icon: <HiOutlinePhoto /> },
    { id: 'messages', label: 'Xabarlar', icon: <HiOutlineEnvelope /> },
    { id: 'admins', label: 'Adminlar', icon: <HiOutlineShieldCheck /> },
  ];

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="flex items-center gap-4 mb-10 px-2">
          <div className="admin-avatar" style={{ width: 44, height: 44, fontSize: '1.2rem' }}>
            <img src={logo} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 4 }} />
          </div>
          <div className="hidden-mobile">
            <h2 style={{ fontSize: '1rem', fontWeight: 900, letterSpacing: '0.05em', color: 'var(--text-primary)' }}>ADMIN</h2>
            <p className="text-xs text-muted">NamDTU ATT</p>
          </div>
        </div>

        <nav className="flex-1">
          {sidebarItems.map(item => (
            <div
              key={item.id}
              className={`admin-nav-item ${activeTab === item.id ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <span>{item.icon}</span>
              <span className="hidden-mobile">{item.label}</span>
            </div>
          ))}
        </nav>

        <div className="mt-auto pt-6 border-t border-color" style={{ borderColor: 'var(--border-color)' }}>
          <button onClick={toggleTheme} className="admin-nav-item w-full bg-none border-none">
            <span>{theme === 'dark' ? <HiOutlineSun /> : <HiOutlineMoon />}</span>
            <span className="hidden-mobile">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
          <button onClick={() => navigate('/')} className="admin-nav-item w-full bg-none border-none text-blue-500">
            <span><HiOutlineHome /></span>
            <span className="hidden-mobile">Saytga qaytish</span>
          </button>
          <button onClick={logout} className="admin-nav-item w-full bg-none border-none text-error" style={{ color: '#ef4444' }}>
            <span><HiOutlineArrowLeftOnRectangle /></span>
            <span className="hidden-mobile">Chiqish</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <header className="flex justify-between items-center mb-10 animate-slide-in">
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: 4 }}>
              {sidebarItems.find(i => i.id === activeTab)?.label}
            </h1>
            <p className="text-muted">Xush kelibsiz, {user.name.split(' ')[0]} 👋</p>
          </div>

          <div className="admin-header-actions">
            <div className="admin-user-pill">
              <div className="admin-avatar">{user.name[0]}</div>
              <div className="hidden-mobile" style={{ textAlign: 'left' }}>
                <div className="text-sm font-bold">{user.name}</div>
                <div className="text-xs text-muted">Administrator</div>
              </div>
            </div>
          </div>
        </header>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="loading-spinner" style={{ width: 40, height: 40, borderWidth: 4 }} />
          </div>
        ) : (
          <div className="animate-slide-in">
            {/* DASHBOARD */}
            {activeTab === 'dashboard' && stats && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'O\'qituvchilar', val: stats.teachers, icon: <HiOutlineUsers />, color: '#8b5cf6' },
                  { label: 'Ilmiy ishlar', val: stats.research_papers, icon: <HiOutlineDocumentText />, color: '#10b981' },
                  { label: 'Bitiruvchilar', val: stats.graduates, icon: <HiOutlineTrophy />, color: '#f59e0b' },
                ].map((s, i) => (
                  <div key={i} className="admin-stat-card">
                    <div className="admin-stat-icon" style={{ background: `${s.color}15`, color: s.color }}>
                      {s.icon}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-muted uppercase tracking-widest mb-1">{s.label}</p>
                      <h3 style={{ fontSize: '1.75rem', fontWeight: 900 }}>{s.val}</h3>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TABLES (NEWS, STAFF, etc) */}
            {(['news', 'staff', 'programs', 'research', 'admins'].includes(activeTab)) && (
              <div className="admin-table-container">
                <div className="flex justify-between items-center p-6 bg-card border-b border-color" style={{ borderColor: 'var(--border-color)' }}>
                  <h3 className="font-bold text-lg">Barcha ma'lumotlar</h3>
                  <button 
                    onClick={() => {
                      if (activeTab === 'news') handleOpenNewsModal();
                      else if (activeTab === 'staff') handleOpenStaffModal();
                      else if (activeTab === 'programs') { setSelectedProgram(null); setIsProgramModalOpen(true); }
                      else if (activeTab === 'research') { setSelectedResearch(null); setIsResearchModalOpen(true); }
                      else if (activeTab === 'admins') setIsAdminModalOpen(true);
                    }} 
                    className="auth-submit-btn" 
                    style={{ padding: '10px 20px', borderRadius: 12, marginTop: 0, fontSize: '0.85rem' }}
                  >
                    <HiOutlinePlus style={{ marginRight: 8 }} /> Yangi qo'shish
                  </button>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table className="admin-table">
                    <thead>
                      {activeTab === 'news' && (
                        <tr>
                          <th>Sarlavha</th>
                          <th>Kategoriya</th>
                          <th>Sana</th>
                          <th>Ko'rishlar</th>
                          <th style={{ textAlign: 'right' }}>Amallar</th>
                        </tr>
                      )}
                      {activeTab === 'staff' && (
                        <tr>
                          <th>F.I.SH</th>
                          <th>Lavozim</th>
                          <th>Email</th>
                          <th>Maqolalar</th>
                          <th style={{ textAlign: 'right' }}>Amallar</th>
                        </tr>
                      )}
                      {activeTab === 'programs' && (
                        <tr>
                          <th>Kod</th>
                          <th>Nomi</th>
                          <th>Daraja</th>
                          <th>Soni</th>
                          <th style={{ textAlign: 'right' }}>Amallar</th>
                        </tr>
                      )}
                      {activeTab === 'research' && (
                        <tr>
                          <th>Sarlavha</th>
                          <th>Mualliflar</th>
                          <th>Turi</th>
                          <th>Yil</th>
                          <th style={{ textAlign: 'right' }}>Amallar</th>
                        </tr>
                      )}
                      {activeTab === 'admins' && (
                        <tr>
                          <th>F.I.SH</th>
                          <th>Email</th>
                          <th>Roli</th>
                          <th style={{ textAlign: 'right' }}>Amallar</th>
                        </tr>
                      )}
                    </thead>
                    <tbody>
                      {activeTab === 'news' && news.map(item => (
                        <tr key={item.id}>
                          <td><div className="font-bold truncate" style={{ maxWidth: 300 }}>{item.title_uz}</div></td>
                          <td><span className="badge badge-blue">{item.category}</span></td>
                          <td>{item.published_at}</td>
                          <td>{item.views}</td>
                          <td style={{ textAlign: 'right' }}>
                            <div className="flex justify-end gap-2">
                              <button onClick={() => handleOpenNewsModal(item)} className="admin-action-btn"><HiOutlinePencilSquare /></button>
                              <button onClick={() => handleDeleteNews(item.id)} className="admin-action-btn delete"><HiOutlineTrash /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {activeTab === 'staff' && staff.map(person => (
                        <tr key={person.id}>
                          <td>
                            <div className="flex items-center gap-3">
                              <img src={person.photo} style={{ width: 32, height: 32, borderRadius: 8, objectFit: 'cover' }} />
                              <div className="font-bold">{person.name_uz}</div>
                            </div>
                          </td>
                          <td>{person.position_uz}</td>
                          <td>{person.email}</td>
                          <td>{person.articles}</td>
                          <td style={{ textAlign: 'right' }}>
                            <div className="flex justify-end gap-2">
                              <button onClick={() => handleOpenStaffModal(person)} className="admin-action-btn"><HiOutlinePencilSquare /></button>
                              <button onClick={() => handleDeleteStaff(person.id)} className="admin-action-btn delete"><HiOutlineTrash /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {activeTab === 'programs' && programs.map(prog => (
                        <tr key={prog.id}>
                          <td className="font-mono text-xs">{prog.code}</td>
                          <td><div className="font-bold">{prog.name_uz}</div></td>
                          <td><span className={`badge ${prog.level === 'bachelor' ? 'badge-blue' : 'badge-gold'}`}>{prog.level}</span></td>
                          <td>{prog.seats}</td>
                          <td style={{ textAlign: 'right' }}>
                            <div className="flex justify-end gap-2">
                              <button onClick={() => { setSelectedProgram(prog); setIsProgramModalOpen(true); }} className="admin-action-btn"><HiOutlinePencilSquare /></button>
                              <button onClick={() => handleDeleteProgram(prog.id)} className="admin-action-btn delete"><HiOutlineTrash /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {activeTab === 'research' && research.map(item => (
                        <tr key={item.id}>
                          <td><div className="font-bold truncate" style={{ maxWidth: 300 }}>{item.title_uz}</div></td>
                          <td><div className="text-xs">{item.authors.join(', ')}</div></td>
                          <td><span className="badge badge-blue">{item.type}</span></td>
                          <td>{item.year}</td>
                          <td style={{ textAlign: 'right' }}>
                            <div className="flex justify-end gap-2">
                              <button onClick={() => { setSelectedResearch(item); setIsResearchModalOpen(true); }} className="admin-action-btn"><HiOutlinePencilSquare /></button>
                              <button onClick={() => handleDeleteResearch(item.id)} className="admin-action-btn delete"><HiOutlineTrash /></button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {activeTab === 'admins' && admins.map(admin => (
                        <tr key={admin.id}>
                          <td>
                            <div className="flex items-center gap-3">
                              <div className="admin-avatar" style={{ width: 32, height: 32, fontSize: '0.9rem' }}>{admin.name[0]}</div>
                              <div className="font-bold">{admin.name}</div>
                            </div>
                          </td>
                          <td>{admin.email}</td>
                          <td><span className="badge badge-gold">Administrator</span></td>
                          <td style={{ textAlign: 'right' }}>
                            <div className="flex justify-end gap-2">
                              <button 
                                onClick={() => handleDeleteAdmin(admin.id)} 
                                className="admin-action-btn delete"
                                disabled={admin.id === user.id}
                                title={admin.id === user.id ? "O'zingizni o'chira olmaysiz" : "O'chirish"}
                                style={{ opacity: admin.id === user.id ? 0.3 : 1 }}
                              >
                                <HiOutlineTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* SCHEDULE */}
            {activeTab === 'schedule' && <AdminSchedule />}

            {/* MESSAGES */}
            {activeTab === 'messages' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 col-span-2 opacity-30">
                    <HiOutlineEnvelope style={{ fontSize: '4rem', marginBottom: 16 }} />
                    <p>Xabarlar mavjud emas</p>
                  </div>
                ) : (
                  messages.map(msg => (
                    <div key={msg.id} className="admin-stat-card flex-col items-start" style={{ gap: 16, borderLeft: msg.replied ? '6px solid #10b981' : '6px solid #f59e0b' }}>
                      <div className="flex justify-between w-full">
                        <div>
                          <h4 className="font-bold">{msg.name}</h4>
                          <p className="text-xs text-muted">{msg.email} • {msg.created_at}</p>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => handleOpenReplyModal(msg)} className="admin-action-btn"><HiOutlineEnvelope /></button>
                          <button onClick={() => handleDeleteMessage(msg.id)} className="admin-action-btn delete"><HiOutlineTrash /></button>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-muted uppercase mb-1">{msg.subject}</p>
                        <p className="text-sm" style={{ lineHeight: 1.6 }}>{msg.message}</p>
                      </div>
                      {msg.replied && (
                        <div className="w-full p-4 bg-secondary rounded-xl border border-color" style={{ background: 'rgba(37, 99, 235, 0.05)', borderColor: 'rgba(37, 99, 235, 0.1)' }}>
                          <p className="text-xs font-bold text-primary mb-1">JAVOB:</p>
                          <p className="text-sm italic">{msg.reply_msg}</p>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            {/* GALLERY */}
            {activeTab === 'gallery' && (
              <div className="admin-table-container p-6">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="font-bold text-lg">Rasmlar to'plami</h3>
                  <button onClick={() => setIsGalleryModalOpen(true)} className="auth-submit-btn" style={{ padding: '10px 20px', borderRadius: 12, marginTop: 0, fontSize: '0.85rem' }}>
                    <HiOutlinePlus style={{ marginRight: 8 }} /> Rasm yuklash
                  </button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {gallery.map(img => (
                    <div key={img.id} className="group relative rounded-2xl overflow-hidden aspect-video shadow-md border border-color" style={{ borderColor: 'var(--border-color)' }}>
                      <img src={img.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4 text-center">
                        <p className="text-white text-xs font-bold mb-3">{img.title_uz}</p>
                        <button onClick={() => handleDeleteGallery(img.id)} className="btn btn-primary btn-sm bg-red-600 hover:bg-red-700 border-none">
                          <HiOutlineTrash />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}


          </div>
        )}

        {/* MODALS */}
        <NewsModal 
          isOpen={isNewsModalOpen} 
          onClose={() => setIsNewsModalOpen(false)} 
          newsItem={selectedNews} 
          onSuccess={fetchData} 
          addToast={addToast} 
        />
        <StaffModal 
            isOpen={isStaffModalOpen} 
            onClose={() => setIsStaffModalOpen(false)} 
            staffItem={selectedStaff} 
            onSuccess={fetchData} 
            addToast={addToast} 
        />
        <GalleryModal 
            isOpen={isGalleryModalOpen} 
            onClose={() => setIsGalleryModalOpen(false)} 
            onSuccess={fetchData} 
            addToast={addToast} 
        />
        <ReplyModal 
            isOpen={isReplyModalOpen} 
            onClose={() => setIsReplyModalOpen(false)} 
            message={selectedMessage} 
            onSuccess={fetchData} 
            addToast={addToast} 
        />
        <ProgramModal
            isOpen={isProgramModalOpen}
            onClose={() => setIsProgramModalOpen(false)}
            program={selectedProgram}
            onSuccess={fetchData}
            addToast={addToast}
        />
        <ResearchModal
            isOpen={isResearchModalOpen}
            onClose={() => setIsResearchModalOpen(false)}
            research={selectedResearch}
            onSuccess={fetchData}
            addToast={addToast}
        />
        <ConfirmModal
            isOpen={confirmConfig.isOpen}
            onClose={() => setConfirmConfig(prev => ({ ...prev, isOpen: false }))}
            onConfirm={confirmConfig.onConfirm}
            message={confirmConfig.message}
        />
        <AdminUsersModal 
            isOpen={isAdminModalOpen}
            onClose={() => setIsAdminModalOpen(false)}
            onSuccess={fetchData}
            addToast={addToast}
        />
      </main>
    </div>
  );
}
