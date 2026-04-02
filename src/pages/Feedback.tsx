import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  Heart, 
  ImagePlus, 
  Send
} from 'lucide-react';

interface FeedbackUser {
  name: string;
  initials?: string;
  avatar?: string;
  isAdmin: boolean;
}

interface Reply {
  id: number;
  user: FeedbackUser;
  time: string;
  content: string;
}

interface FeedbackItem {
  id: number;
  user: FeedbackUser;
  tag: string;
  tagKey: string;
  tagColor: string;
  time: string;
  content: string;
  attachments?: string[];
  replies?: Reply[];
}

export default function Feedback() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('all');
  const [feedbackText, setFeedbackText] = useState('');
  const [selectedType, setSelectedType] = useState('suggestion');

  // Mock data with names provided by user
  const FEEDBACK_ITEMS: FeedbackItem[] = [
    {
      id: 1,
      user: {
        name: 'Behruz Ruziyev',
        initials: 'BR',
        isAdmin: false
      },
      tag: 'Xatolik',
      tagKey: 'bug',
      tagColor: 'bg-rose-500/10 text-rose-600',
      time: '2 soat oldin',
      content: "Dars jadvali qismida ba'zi darslar noto'g'ri vaqtda ko'rinayapti. Ayniqsa haftalik ko'rinishda grid siljib ketyapti. Tekshirib ko'rsangiz yaxshi bo'lardi.",
      replies: [
        {
          id: 101,
          user: {
            name: 'Otabek Abdusattorov',
            initials: 'OA',
            isAdmin: true
          },
          time: '1 soat oldin',
          content: "Rahmat Behruz! Ha, buni sezdim. Grid tizimidagi layout'ni responsive holatga keltirishda xato o'tib ketgan. Bugun kechqurun tuzatib qo'yaman."
        }
      ]
    },
    {
      id: 2,
      user: {
        name: 'Otabek Abdusattorov',
        initials: 'OA',
        isAdmin: true
      },
      tag: 'Taklif',
      tagKey: 'suggestion',
      tagColor: 'bg-blue-500/10 text-blue-600',
      time: '1 kun oldin',
      content: "Tizimga yangi 'AI Pedagogical Assistant' qo'shish rejamiz bor. Bu o'qituvchilarga dars rejalarini tezroq tuzishga yordam beradi. Nima deysizlar?",
      replies: [
        {
          id: 201,
          user: {
            name: 'Behruz Ruziyev',
            initials: 'BR',
            isAdmin: false
          },
          time: '15 daqiqa oldin',
          content: "Zo'r fikr! Bu o'qituvchilarning vaqtini ancha tejaydi."
        }
      ]
    }
  ];

  const TABS = [
    { id: 'all', label: t('feedback.tabAll'), count: 2 },
    { id: 'questions', label: t('feedback.tabQuestions'), count: 0 },
    { id: 'open', label: t('feedback.tabOpen'), count: 12 },
    { id: 'ongoing', label: t('feedback.tabOngoing'), count: 4 },
    { id: 'completed', label: t('feedback.tabCompleted'), count: 28 },
    { id: 'praise', label: t('feedback.tabPraise'), count: 5 }
  ];

  return (
    <div className="flex-1 min-h-0 flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="p-8 lg:px-12 max-w-4xl mx-auto w-full">
        
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">{t('feedback.communityTitle')}</h1>
          <p className="text-muted-foreground">{t('feedback.communityDescription')}</p>
        </div>

        {/* Post Feedback Area */}
        <div className="bg-card rounded-xl border border-border p-6 card-elevation mb-6">
          <div className="flex gap-4">
            <div className="size-10 rounded-full bg-zinc-900 text-white flex items-center justify-center shrink-0 mt-1 font-bold text-xs border border-zinc-200">
              OA
            </div>
            <div className="flex-1 min-w-0">
              <div className="relative">
                <textarea 
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder={t('feedback.placeholder')} 
                  rows={5} 
                  className="w-full resize-none rounded-lg border border-border bg-muted/30 px-4 py-3 pr-24 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:bg-background transition-all duration-200"
                />
                <div className="absolute bottom-3 right-3 flex items-center gap-1">
                  <button className="flex items-center justify-center size-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-150 outline-none">
                    <ImagePlus className="size-4" />
                  </button>
                  <button 
                    disabled={!feedbackText}
                    className="inline-flex items-center justify-center h-9 px-4 gap-2 rounded-lg bg-zinc-900 text-white hover:bg-zinc-800 disabled:opacity-50 disabled:pointer-events-none transition-all active:scale-[0.98] outline-none"
                  >
                    <Send className="size-4" />
                    <span className="text-sm font-medium">{t('feedback.button')}</span>
                  </button>
                </div>
              </div>
              
              <div className="mt-3 flex items-center gap-1.5">
                {['suggestion', 'bug', 'question', 'praise'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer border
                      ${selectedType === type 
                        ? 'bg-zinc-900 text-white border-zinc-900' 
                        : 'bg-muted/50 text-muted-foreground border-transparent hover:border-border hover:bg-muted'}`}
                  >
                    {t(`feedback.${type}`)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Filter */}
        <div className="mb-6">
          <div className="flex items-center gap-1 p-1 rounded-xl bg-card border border-border card-elevation overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 min-w-fit justify-center px-4 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap
                  ${activeTab === tab.id 
                    ? 'bg-zinc-900 text-white' 
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'}`}
              >
                {tab.label}
                <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center
                  ${activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-muted text-muted-foreground/80'}`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Feedback List */}
        <div className="space-y-4">
          {FEEDBACK_ITEMS.map((item) => (
            <div key={item.id} className="group relative bg-card rounded-xl px-6 py-6 border border-border card-elevation">
              <div className="absolute top-6 right-6">
                <button className="text-muted-foreground hover:text-rose-500 p-1 transition-colors outline-none">
                  <Heart className="size-4" />
                </button>
              </div>

              <div className="flex gap-4 pr-12">
                <div className="size-10 rounded-full bg-zinc-100 text-zinc-900 flex items-center justify-center shrink-0 font-bold text-xs border border-zinc-200">
                  {item.user.initials || item.user.name.charAt(0)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-sm text-foreground">{item.user.name}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${item.tagColor}`}>
                      {item.tag}
                    </span>
                    <span className="text-xs text-muted-foreground/60 font-medium">{item.time}</span>
                  </div>
                  
                  <p className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">
                    {item.content}
                  </p>

                  {item.attachments && item.attachments.length > 0 && (
                    <div className="mt-3">
                      <img 
                        src={item.attachments[0]} 
                        alt="Feedback attachment" 
                        className="max-h-32 rounded-lg border border-border/50 object-cover hover:border-border transition-all cursor-zoom-in"
                      />
                    </div>
                  )}

                  {/* Replies */}
                  {item.replies && item.replies.length > 0 && (
                    <div className="mt-5 border-t border-border/40 pt-4 space-y-4">
                      {item.replies.map((reply) => (
                        <div key={reply.id} className="flex gap-3">
                          <div className="size-8 rounded-full bg-zinc-900 text-white flex items-center justify-center shrink-0 font-bold text-[10px] border border-zinc-700">
                             {reply.user.initials || reply.user.name.charAt(0)}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="font-bold text-xs text-foreground">{reply.user.name}</span>
                              {reply.user.isAdmin && (
                                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-zinc-900 text-white uppercase tracking-tighter">Admin</span>
                              )}
                              <span className="text-[10px] text-muted-foreground/60 font-medium">{reply.time}</span>
                            </div>
                            <p className="text-sm text-foreground/80 whitespace-pre-wrap leading-relaxed bg-muted/30 p-2.5 rounded-lg border border-border/50">
                              {reply.content}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
