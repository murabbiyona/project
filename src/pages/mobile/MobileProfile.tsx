import { useState, useEffect } from 'react';
import { Mail, Phone, Building2, Send, Edit, Globe, LogOut, Save, X, Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function MobileProfile() {
  const { profile, updateProfile, signOut } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Form states
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [email, setEmail] = useState(profile?.email || '');
  const [phone, setPhone] = useState(profile?.phone || '');

  // Update local state when profile loads
  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setEmail(profile.email || '');
      setPhone(profile.phone || '');
    }
  }, [profile]);

  const infoItems = [
    { id: 'email', icon: Mail, label: 'Email', value: email || 'Kiritilmagan', type: 'email' },
    { id: 'phone', icon: Phone, label: 'Telefon', value: phone || 'Kiritilmagan', type: 'tel' },
    { id: 'school', icon: Building2, label: 'Maktab', value: 'Murabbiyona Demo School', readOnly: true },
    { id: 'telegram', icon: Send, label: 'Telegram', value: profile?.telegram_id ? 'Ulangan' : 'Ulanmagan', connected: !!profile?.telegram_id, readOnly: true },
  ];

  const handleSave = async () => {
    setLoading(true);
    const { error } = await updateProfile({
      full_name: fullName,
      email: email,
      phone: phone,
    });
    
    if (!error) {
      setIsEditing(false);
    } else {
      alert('Xatolik yuz berdi: ' + error.message);
    }
    setLoading(false);
  };

  const handleCancel = () => {
    setFullName(profile?.full_name || '');
    setEmail(profile?.email || '');
    setPhone(profile?.phone || '');
    setIsEditing(false);
  };

  return (
    <div className="space-y-6 pb-20 max-w-lg mx-auto px-4 md:px-0">
      {/* Avatar & Name */}
      <div className="flex flex-col items-center text-center pt-8">
        <div className="w-24 h-24 bg-emerald-500 text-white rounded-full flex items-center justify-center text-3xl font-bold mb-4 shadow-lg ring-4 ring-emerald-50 dark:ring-emerald-900/20 transition-all">
          {(fullName || 'U').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
        </div>
        
        {isEditing ? (
          <div className="w-full px-4 space-y-3">
            <input
              autoFocus
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full text-center text-xl font-bold bg-zinc-50 dark:bg-zinc-800 border-2 border-emerald-500/20 rounded-2xl p-3 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
              placeholder="Ism-familiyangiz"
            />
            <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest">{profile?.role === 'teacher' ? "O'qituvchi" : profile?.role || 'Foydalanuvchi'}</p>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-zinc-900 dark:text-white capitalize">{fullName || 'Foydalanuvchi'}</h1>
            <p className="text-sm font-semibold text-zinc-400 dark:text-zinc-500 mt-1">{profile?.role === 'teacher' ? "O'qituvchi" : profile?.role || 'Foydalanuvchi'}</p>
          </>
        )}
      </div>

      {/* Info Cards */}
      <div className="bg-white dark:bg-zinc-900 rounded-[32px] shadow-sm border border-zinc-100 dark:border-zinc-800 overflow-hidden">
        <div className="divide-y divide-zinc-50 dark:divide-zinc-800/50">
          {infoItems.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="flex items-center gap-4 px-6 py-5 hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors">
                <div className="w-12 h-12 bg-zinc-50 dark:bg-zinc-800 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Icon className="w-6 h-6 text-zinc-500 dark:text-zinc-400" strokeWidth={1.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] uppercase tracking-tighter font-extrabold text-zinc-400 dark:text-zinc-500 mb-0.5">{item.label}</p>
                  
                  {isEditing && !item.readOnly ? (
                    <input
                      type={item.type}
                      value={item.id === 'email' ? email : phone}
                      onChange={(e) => item.id === 'email' ? setEmail(e.target.value) : setPhone(e.target.value)}
                      className="w-full text-sm font-bold text-zinc-900 dark:text-white bg-transparent border-b-2 border-emerald-500/20 focus:border-emerald-500 outline-none py-1 transition-all"
                    />
                  ) : (
                    <p className="text-sm font-bold text-zinc-800 dark:text-zinc-200 truncate">
                      {item.value}
                    </p>
                  )}
                </div>
                {item.connected && (
                  <span className="text-[10px] font-black bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 px-2 py-1 rounded-lg uppercase">
                    LIVE
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-4">
        {isEditing ? (
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={handleCancel}
              className="flex items-center justify-center gap-2 h-16 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 rounded-[22px] font-bold active:scale-95 transition-all"
            >
              <X className="w-5 h-5" />
              Bekor qilish
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex items-center justify-center gap-2 h-16 bg-emerald-600 text-white rounded-[22px] font-bold shadow-lg shadow-emerald-500/20 active:scale-95 transition-all disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              Saqlash
            </button>
          </div>
        ) : (
          <>
            <button
              onClick={() => setIsEditing(true)}
              className="w-full h-16 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-[22px] px-6 flex items-center gap-3 shadow-xl active:scale-95 transition-all group"
            >
              <Edit className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              <span className="text-base font-bold flex-1 text-left">Profilni tahrirlash</span>
              <div className="w-8 h-8 bg-zinc-800 dark:bg-zinc-100 rounded-full flex items-center justify-center text-zinc-400 dark:text-zinc-500">→</div>
            </button>
            
            <button className="w-full h-16 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white border-2 border-zinc-50 dark:border-zinc-800 rounded-[22px] px-6 flex items-center gap-3 active:scale-95 transition-all">
              <Globe className="w-5 h-5 text-zinc-400" />
              <span className="text-base font-bold flex-1 text-left">Tilni o'zgartirish</span>
              <span className="text-xs font-black text-zinc-300 dark:text-zinc-700 uppercase tracking-widest">UZ</span>
            </button>

            <button
              onClick={() => signOut()}
              className="w-full h-16 bg-rose-50 dark:bg-rose-900/10 text-rose-600 rounded-[22px] px-6 flex items-center gap-3 active:scale-95 transition-all"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-base font-bold">Chiqish</span>
            </button>
          </>
        )}
      </div>

      {/* App Version */}
      <div className="text-center space-y-1 py-4">
        <p className="text-[10px] font-black text-zinc-300 dark:text-zinc-700 uppercase tracking-[0.3em]">
          Murabbiyona LMS
        </p>
        <p className="text-[9px] font-bold text-zinc-400">v1.1.0-beta.release</p>
      </div>
    </div>
  );
}
