import { useState } from 'react';
import { ChevronLeft, Send } from 'lucide-react';

interface Conversation {
  id: number;
  name: string;
  subject: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
}

interface Message {
  id: number;
  text: string;
  sender: 'teacher' | 'parent';
  time: string;
}

const conversations: Conversation[] = [
  {
    id: 1,
    name: 'Karimova Nilufar',
    subject: 'Matematika',
    avatar: 'KN',
    lastMessage: 'Jasur bugun darsda juda yaxshi javob berdi',
    time: '14:30',
    unread: 2,
  },
  {
    id: 2,
    name: 'Rahimov Sardor',
    subject: 'Ingliz tili',
    avatar: 'RS',
    lastMessage: "Uy vazifasini tekshirib ko'ring",
    time: '11:20',
    unread: 0,
  },
  {
    id: 3,
    name: 'Toshmatova Dilfuza',
    subject: 'Ona tili',
    avatar: 'TD',
    lastMessage: "Kitob o'qish bo'yicha topshiriq berildi",
    time: 'Kecha',
    unread: 0,
  },
];

const chatMessages: Message[] = [
  {
    id: 1,
    text: "Assalomu alaykum! Jasurning bugungi dars natijalari haqida xabar bermoqchi edim.",
    sender: 'teacher',
    time: '14:20',
  },
  {
    id: 2,
    text: "Va alaykum assalom! Eshitaman, ustoz.",
    sender: 'parent',
    time: '14:22',
  },
  {
    id: 3,
    text: "Jasur bugun nazorat ishida 5 baho oldi. Juda yaxshi tayyorgarlik ko'rgan ekan.",
    sender: 'teacher',
    time: '14:25',
  },
  {
    id: 4,
    text: "Juda xursandman! Rahmat, ustoz. Uyda ham mashq qilayotgan edi.",
    sender: 'parent',
    time: '14:27',
  },
  {
    id: 5,
    text: "Shuningdek, ertangi dars uchun 45-betdagi misollarni yechib kelishi kerak.",
    sender: 'teacher',
    time: '14:30',
  },
];

export default function ParentAppChat() {
  const [activeChat, setActiveChat] = useState<Conversation | null>(null);
  const [messageText, setMessageText] = useState('');

  // Chat list view
  if (!activeChat) {
    return (
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-zinc-900">Xabarlar</h2>
        <div className="space-y-2">
          {conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => setActiveChat(conv)}
              className="w-full bg-white rounded-2xl shadow-sm p-4 flex items-center gap-3 text-left active:bg-zinc-50 min-h-[64px]"
            >
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm font-bold flex-shrink-0">
                {conv.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-base font-semibold text-zinc-800">{conv.name}</span>
                  <span className="text-xs text-zinc-400 flex-shrink-0">{conv.time}</span>
                </div>
                <p className="text-xs text-zinc-400 mb-0.5">{conv.subject}</p>
                <p className="text-sm text-zinc-500 truncate">{conv.lastMessage}</p>
              </div>
              {conv.unread > 0 && (
                <span className="w-6 h-6 bg-emerald-500 text-white text-xs font-bold rounded-full flex items-center justify-center flex-shrink-0">
                  {conv.unread}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Chat view
  return (
    <div className="flex flex-col -mx-4 -mt-4" style={{ height: 'calc(100vh - 7.5rem)' }}>
      {/* Chat Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-white border-b border-zinc-100">
        <button
          onClick={() => setActiveChat(null)}
          className="w-10 h-10 rounded-lg flex items-center justify-center active:bg-zinc-100 -ml-1"
        >
          <ChevronLeft className="w-5 h-5 text-zinc-600" />
        </button>
        <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm font-bold flex-shrink-0">
          {activeChat.avatar}
        </div>
        <div>
          <p className="text-base font-semibold text-zinc-800">{activeChat.name}</p>
          <p className="text-xs text-zinc-400">{activeChat.subject}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {chatMessages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'parent' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                msg.sender === 'parent'
                  ? 'bg-emerald-600 text-white rounded-br-md'
                  : 'bg-zinc-100 text-zinc-800 rounded-bl-md'
              }`}
            >
              <p className="text-sm leading-relaxed">{msg.text}</p>
              <p
                className={`text-[10px] mt-1 text-right ${
                  msg.sender === 'parent' ? 'text-emerald-200' : 'text-zinc-400'
                }`}
              >
                {msg.time}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="px-4 py-3 bg-white border-t border-zinc-100">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Xabar yozing..."
            className="flex-1 h-12 px-4 rounded-xl bg-zinc-100 text-base text-zinc-800 placeholder:text-zinc-400 outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button className="w-12 h-12 bg-emerald-600 text-white rounded-xl flex items-center justify-center active:bg-emerald-700 flex-shrink-0">
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
