import { useState } from 'react';
import { MessageCircle, Send } from 'lucide-react';

const conversations = [
  {
    id: 1,
    name: 'Karimova Nilufar',
    role: 'Matematika',
    avatar: 'KN',
    lastMessage: 'Jasur bugun darsda juda yaxshi javob berdi.',
    time: '14:30',
    unread: 0,
  },
  {
    id: 2,
    name: 'Rahimov Bobur',
    role: 'Sinf rahbari',
    avatar: 'RB',
    lastMessage: "Ertaga ota-onalar yig'ilishi bo'ladi.",
    time: '12:15',
    unread: 2,
  },
  {
    id: 3,
    name: "Maktab ma'muriyati",
    role: "Ma'muriyat",
    avatar: 'MM',
    lastMessage: "Bahorgi ta'til jadvali e'lon qilindi.",
    time: 'Kecha',
    unread: 0,
  },
];

const chatMessages = [
  {
    id: 1,
    sender: 'teacher',
    text: "Assalomu alaykum, Abdullayev aka! Jasur haqida gaplashmoqchi edim.",
    time: '10:00',
  },
  {
    id: 2,
    sender: 'parent',
    text: "Va alaykum assalom! Albatta, tinglayapman.",
    time: '10:05',
  },
  {
    id: 3,
    sender: 'teacher',
    text: "Jasur so'nggi nazorat ishida 5 baho oldi. Matematikadan juda yaxshi natijalarga erishyapti.",
    time: '10:07',
  },
  {
    id: 4,
    sender: 'parent',
    text: "Juda xursandman! Uyda ham ko'p mashq qilyapti.",
    time: '10:10',
  },
  {
    id: 5,
    sender: 'teacher',
    text: "Jasur bugun darsda juda yaxshi javob berdi. Olimpiadaga tayyorgarlik ko'rayotgani seziladi. Davom ettirishini maslahat beraman.",
    time: '14:30',
  },
];

export default function ParentMessages() {
  const [activeChat, setActiveChat] = useState(1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-6 h-6 text-emerald-600" />
          <h1 className="text-2xl font-bold text-zinc-800">Xabarlar</h1>
        </div>
        <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors">
          Yangi xabar
        </button>
      </div>

      {/* Chat layout */}
      <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden flex" style={{ height: '520px' }}>
        {/* Conversation list */}
        <div className="w-80 border-r border-zinc-200 flex flex-col flex-shrink-0">
          <div className="px-4 py-3 border-b border-zinc-100">
            <p className="text-sm font-medium text-zinc-500">Suhbatlar</p>
          </div>
          <div className="flex-1 overflow-y-auto">
            {conversations.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveChat(c.id)}
                className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-colors ${
                  activeChat === c.id ? 'bg-emerald-50' : 'hover:bg-zinc-50'
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 font-bold text-sm flex items-center justify-center flex-shrink-0">
                  {c.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-zinc-700 truncate">{c.name}</span>
                    <span className="text-[11px] text-zinc-400 flex-shrink-0 ml-2">{c.time}</span>
                  </div>
                  <p className="text-xs text-zinc-400">{c.role}</p>
                  <p className="text-xs text-zinc-500 truncate mt-0.5">{c.lastMessage}</p>
                </div>
                {c.unread > 0 && (
                  <span className="bg-emerald-600 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0 mt-1">
                    {c.unread}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1 flex flex-col">
          {/* Chat header */}
          <div className="px-5 py-3 border-b border-zinc-100 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center">
              {conversations.find((c) => c.id === activeChat)?.avatar}
            </div>
            <div>
              <p className="text-sm font-semibold text-zinc-700">
                {conversations.find((c) => c.id === activeChat)?.name}
              </p>
              <p className="text-[11px] text-zinc-400">
                {conversations.find((c) => c.id === activeChat)?.role}
              </p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
            {chatMessages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'parent' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[70%] rounded-2xl px-4 py-2.5 ${
                    msg.sender === 'parent'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-zinc-100 text-zinc-700'
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                  <p
                    className={`text-[10px] mt-1 ${
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
          <div className="px-5 py-3 border-t border-zinc-100">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Xabar yozing..."
                className="flex-1 border border-zinc-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
              <button className="w-10 h-10 bg-emerald-600 text-white rounded-full flex items-center justify-center hover:bg-emerald-700 transition-colors flex-shrink-0">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
