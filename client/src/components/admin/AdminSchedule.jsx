import { useState, useEffect } from 'react';
import { scheduleAPI } from '../../services/api';
import { useApp } from '../../context/AppContext';
import ConfirmModal from './ConfirmModal';

export default function AdminSchedule() {
    const { addToast, lang } = useApp();
    const [directions, setDirections] = useState([]);
    const [groups, setGroups] = useState([]);
    const [selectedDir, setSelectedDir] = useState('');
    const [selectedGroup, setSelectedGroup] = useState('');
    const [schedule, setSchedule] = useState({
        monday: [], tuesday: [], wednesday: [], thursday: [], friday: [], saturday: []
    });
    const [loading, setLoading] = useState(false);
    const [newGroupName, setNewGroupName] = useState('');
    const [confirmConfig, setConfirmConfig] = useState({ isOpen: false, onConfirm: null, message: '' });

    useEffect(() => {
        loadBaseData();
    }, []);

    const loadBaseData = async () => {
        try {
            const resDir = await scheduleAPI.getDirections();
            setDirections(resDir.data);
            if (resDir.data.length > 0) {
                const firstDir = resDir.data[0].id;
                setSelectedDir(firstDir);
                await loadGroups(firstDir);
            }
        } catch (err) {
            addToast('Ma\'lumot yuklashda xatolik', 'error');
        }
    };

    const loadGroups = async (dirId) => {
        try {
            const resGroups = await scheduleAPI.getGroups(dirId);
            setGroups(resGroups.data);
            if (resGroups.data.length > 0) {
                const firstGroup = resGroups.data[0].id;
                setSelectedGroup(firstGroup);
                loadSchedule(firstGroup);
            } else {
                setSelectedGroup('');
                setSchedule({ monday: [], tuesday: [], wednesday: [], thursday: [], friday: [], saturday: [] });
            }
        } catch (err) {
            addToast('Guruhlarni yuklashda xatolik', 'error');
        }
    };

    const handleAddGroup = async () => {
        if (!newGroupName.trim() || !selectedDir) return;
        setLoading(true);
        try {
            await scheduleAPI.manage({ 
                addGroup: { 
                    name: newGroupName.trim(), 
                    directionId: selectedDir 
                } 
            });
            addToast('Yangi guruh qo\'shildi', 'success');
            setNewGroupName('');
            await loadGroups(selectedDir);
        } catch (err) {
            addToast('Guruh qo\'shishda xatolik', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteGroup = () => {
        if (!selectedGroup) return;
        setConfirmConfig({
            isOpen: true,
            message: `Haqiqatdan ham "${selectedGroup}" guruhini va uning barcha jadvallarini o'chirib tashlamoqchimisiz?`,
            onConfirm: async () => {
                setLoading(true);
                try {
                    await scheduleAPI.manage({ deleteGroupId: selectedGroup });
                    addToast('Guruh o\'chirildi', 'success');
                    await loadGroups(selectedDir);
                } catch (err) {
                    addToast('Guruhni o\'chirishda xatolik', 'error');
                } finally {
                    setLoading(false);
                }
            }
        });
    };

    const loadSchedule = async (groupId) => {
        setLoading(true);
        try {
            const res = await scheduleAPI.getByGroup(groupId);
            setSchedule(res.data.schedule);
        } catch (err) {
            addToast('Jadvalni yuklashda xatolik', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleAddLesson = (day) => {
        const newLesson = { time: '08:30-10:00', subject: '', teacher: '', room: '' };
        setSchedule({
            ...schedule,
            [day]: [...(schedule[day] || []), newLesson]
        });
    };

    const handleUpdateLesson = (day, index, field, value) => {
        const updatedDay = [...schedule[day]];
        updatedDay[index] = { ...updatedDay[index], [field]: value };
        setSchedule({ ...schedule, [day]: updatedDay });
    };

    const handleRemoveLesson = (day, index) => {
        const updatedDay = schedule[day].filter((_, i) => i !== index);
        setSchedule({ ...schedule, [day]: updatedDay });
    };

    const handleSave = async () => {
        if (!selectedGroup) return;
        setLoading(true);
        try {
            await scheduleAPI.updateGroupSchedule(selectedGroup, schedule);
            addToast('Jadval muvaffaqiyatli saqlandi', 'success');
        } catch (err) {
            addToast('Saqlashda xatolik yuz berdi', 'error');
        } finally {
            setLoading(false);
        }
    };

    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

    return (
        <div className="admin-schedule-container animate-slide-in">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
                <div className="admin-table-container p-6">
                    <label className="text-xs font-bold text-muted uppercase tracking-widest">1. Yo'nalishni tanlang</label>
                    <select 
                        className="w-full mt-3" 
                        style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', padding: '12px', borderRadius: 12, outline: 'none', color: 'var(--text-primary)' }}
                        value={selectedDir}
                        onChange={(e) => { setSelectedDir(e.target.value); loadGroups(e.target.value); }}
                    >
                        {directions.map(d => (
                            <option key={d.id} value={d.id}>{d.name_uz} ({d.code})</option>
                        ))}
                    </select>
                    
                    <div style={{ marginTop: 'var(--space-6)', padding: 'var(--space-5)', background: 'var(--bg-secondary)', borderRadius: '20px', border: '1px dashed var(--border-color)' }}>
                        <label className="text-xs font-bold text-muted uppercase tracking-widest">Yangi guruh qo'shish</label>
                        <div className="flex gap-3 mt-3">
                            <input 
                                className="flex-1" 
                                style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', padding: '10px 15px', borderRadius: 12, fontSize: '0.9rem' }}
                                placeholder="Masalan: 30a-22"
                                value={newGroupName}
                                onChange={(e) => setNewGroupName(e.target.value)}
                            />
                            <button 
                                className="auth-submit-btn"
                                style={{ marginTop: 0, padding: '10px 20px', borderRadius: 12, width: 'auto' }}
                                onClick={handleAddGroup}
                                disabled={!newGroupName.trim() || loading}
                            >
                                <HiOutlinePlus />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="admin-table-container p-6">
                    <label className="text-xs font-bold text-muted uppercase tracking-widest">2. Guruhni tanlang</label>
                    <div className="flex gap-3 mt-3">
                        <select 
                            className="flex-1" 
                            style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', padding: '12px', borderRadius: 12, outline: 'none', color: 'var(--text-primary)' }}
                            value={selectedGroup}
                            onChange={(e) => { setSelectedGroup(e.target.value); loadSchedule(e.target.value); }}
                        >
                            <option value="">-- Tanlang --</option>
                            {groups.map(g => (
                                <option key={g.id} value={g.id}>{g.name}</option>
                            ))}
                        </select>
                        {selectedGroup && (
                            <button 
                                onClick={handleDeleteGroup}
                                className="admin-action-btn delete"
                                style={{ width: 48, height: 48, borderRadius: 12 }}
                                title="Guruhni o'chirish"
                            >
                                <HiOutlineTrash />
                            </button>
                        )}
                    </div>
                    
                    {selectedGroup && (
                        <div style={{ marginTop: 'var(--space-6)', padding: 'var(--space-5)', background: 'rgba(37, 99, 235, 0.05)', borderRadius: '20px', border: '1px solid rgba(37, 99, 235, 0.1)' }}>
                           <p className="text-sm font-bold text-primary">Tanlangan guruh: {selectedGroup}</p>
                           <p className="text-xs text-muted mt-1">Ushbu guruh dars jadvalini quyidagi bo'limda tahrirlashingiz mumkin.</p>
                        </div>
                    )}
                </div>
            </div>

            {selectedGroup ? (
                <div className="flex flex-col gap-8">
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                        {days.map(day => (
                            <div key={day} className="admin-table-container">
                                <div className="flex justify-between items-center p-5 border-b border-color" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
                                    <h4 className="font-black text-lg uppercase tracking-widest" style={{ color: 'var(--text-primary)' }}>
                                        {lang === 'uz' ? (day === 'monday' ? 'Dushanba' : day === 'tuesday' ? 'Seshanba' : day === 'wednesday' ? 'Chorshanba' : day === 'thursday' ? 'Payshanba' : day === 'friday' ? 'Juma' : 'Shanba') : day}
                                    </h4>
                                    <button onClick={() => handleAddLesson(day)} className="btn btn-ghost btn-sm text-primary flex items-center gap-2" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                        <HiOutlinePlus /> Dars
                                    </button>
                                </div>
                                <div className="p-5">
                                    {(!schedule[day] || schedule[day].length === 0) ? (
                                        <div className="text-center py-10 opacity-30">
                                            <HiOutlineCalendar style={{ fontSize: '2rem', margin: '0 auto 10px' }} />
                                            <p className="text-sm">Hali kiritilmagan</p>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col gap-4">
                                            {schedule[day].map((lesson, idx) => (
                                                <div key={idx} className="grid grid-cols-1 sm:grid-cols-5 gap-3 p-4 bg-secondary rounded-2xl border border-color items-center" style={{ background: 'var(--bg-primary)', borderColor: 'var(--border-color)' }}>
                                                    <div className="sm:col-span-1">
                                                        <p className="text-[10px] font-bold text-muted uppercase mb-1">Vaqt</p>
                                                        <input className="w-full" type="text" value={lesson.time} onChange={(e) => handleUpdateLesson(day, idx, 'time', e.target.value)} placeholder="08:30-10:00" style={{ padding: '6px 10px', fontSize: '0.8rem', borderRadius: 8, background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }} />
                                                    </div>
                                                    <div className="sm:col-span-2">
                                                        <p className="text-[10px] font-bold text-muted uppercase mb-1">Fan</p>
                                                        <input className="w-full" type="text" value={lesson.subject} onChange={(e) => handleUpdateLesson(day, idx, 'subject', e.target.value)} placeholder="Fan nomi" style={{ padding: '6px 10px', fontSize: '0.8rem', borderRadius: 8, background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }} />
                                                    </div>
                                                    <div className="sm:col-span-1">
                                                        <p className="text-[10px] font-bold text-muted uppercase mb-1">Xona</p>
                                                        <input className="w-full" type="text" value={lesson.room} onChange={(e) => handleUpdateLesson(day, idx, 'room', e.target.value)} placeholder="Xona" style={{ padding: '6px 10px', fontSize: '0.8rem', borderRadius: 8, background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }} />
                                                    </div>
                                                    <div className="sm:col-span-1 flex justify-end">
                                                        <button onClick={() => handleRemoveLesson(day, idx)} className="admin-action-btn delete" style={{ width: 34, height: 34 }}><HiOutlineTrash /></button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <div className="sticky bottom-8 z-10">
                         <button 
                            disabled={loading}
                            onClick={handleSave} 
                            className="auth-submit-btn w-full shadow-2xl" 
                            style={{ padding: '20px', borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, fontSize: '1rem', fontWeight: 800 }}
                        >
                            {loading ? (
                                <div className="loading-spinner" />
                            ) : (
                                <>📑 Barcha o'zgarishlarni saqlash</>
                            )}
                         </button>
                    </div>
                </div>
            ) : (
                <div className="admin-table-container flex flex-col items-center justify-center py-24 opacity-30">
                    <HiOutlineCalendar style={{ fontSize: '5rem', marginBottom: 20 }} />
                    <p className="text-lg font-bold">Boshqarish uchun yo'nalish va guruhni tanlang</p>
                </div>
            )}
            
            <ConfirmModal
                isOpen={confirmConfig.isOpen}
                onClose={() => setConfirmConfig(prev => ({ ...prev, isOpen: false }))}
                onConfirm={confirmConfig.onConfirm}
                message={confirmConfig.message}
            />
        </div>
    );
}
