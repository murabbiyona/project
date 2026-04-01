import { ChevronRight, BookOpen, Clock, MessageSquare, CalendarDays, Users } from 'lucide-react';

const todayGrades = [
  { subject: 'Matematika', grade: 5, color: 'bg-emerald-500' },
  { subject: 'Ona tili', grade: 4, color: 'bg-blue-500' },
  { subject: 'Ingliz tili', grade: 5, color: 'bg-emerald-500' },
];

const teacherMessages = [
  {
    name: 'Karimova Nilufar',
    subject: 'Matematika',
    message: 'Jasur bugun darsda juda yaxshi javob berdi...',
    time: '14:30',
  },
  {
    name: 'Rahimov Sardor',
    subject: 'Ingliz tili',
    message: "Uy vazifasini bajarish sifatini oshirish kerak...",
    time: '11:20',
  },
];

const upcomingEvents = [
  { title: "Ota-onalar yig'ilishi", date: '15-mart, 18:00', icon: Users },
  { title: 'Choraklik imtihon', date: '22-mart, 09:00', icon: BookOpen },
];

export default function ParentAppHome() {
  return (
    <div className="space-y-5">
      {/* Child Card */}
      <div className="bg-white rounded-2xl shadow p-4 flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-lg font-bold flex-shrink-0">
          AJ
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-base font-semibold text-zinc-900">Abdullayev Jasur</h2>
          <p className="text-sm text-zinc-500">7-A sinf</p>
        </div>
        <button className="h-12 px-3 text-sm text-emerald-600 bg-emerald-50 rounded-xl font-medium active:bg-emerald-100 flex-shrink-0">
          Almashtirish
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-2xl shadow p-3 text-center">
          <p className="text-xs text-zinc-500 mb-1">O'rtacha</p>
          <p className="text-2xl font-bold text-emerald-600">4.2</p>
        </div>
        <div className="bg-white rounded-2xl shadow p-3 text-center">
          <p className="text-xs text-zinc-500 mb-1">Davomat</p>
          <p className="text-2xl font-bold text-blue-600">96%</p>
        </div>
        <div className="bg-white rounded-2xl shadow p-3 text-center">
          <p className="text-xs text-zinc-500 mb-1">Reyting</p>
          <p className="text-2xl font-bold text-amber-600">5</p>
        </div>
      </div>

      {/* Today's Grades */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-semibold text-zinc-900">Bugungi baholar</h3>
          <button className="text-sm text-emerald-600 font-medium flex items-center gap-0.5">
            Barchasi <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-2">
          {todayGrades.map((item) => (
            <div
              key={item.subject}
              className="bg-white rounded-xl shadow-sm p-4 flex items-center justify-between min-h-[48px]"
            >
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-zinc-400" />
                <span className="text-base text-zinc-800">{item.subject}</span>
              </div>
              <span
                className={`${item.color} text-white w-9 h-9 rounded-lg flex items-center justify-center text-base font-bold`}
              >
                {item.grade}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Teacher Messages */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-semibold text-zinc-900">Ustoz xabarlari</h3>
          <button className="text-sm text-emerald-600 font-medium flex items-center gap-0.5">
            Barchasi <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-2">
          {teacherMessages.map((msg) => (
            <div
              key={msg.name}
              className="bg-white rounded-xl shadow-sm p-4 min-h-[48px]"
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-emerald-500" />
                  <span className="text-sm font-semibold text-zinc-800">{msg.name}</span>
                </div>
                <span className="text-xs text-zinc-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {msg.time}
                </span>
              </div>
              <p className="text-sm text-zinc-500 ml-6 line-clamp-1">{msg.message}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Important Dates */}
      <section>
        <h3 className="text-base font-semibold text-zinc-900 mb-3">Muhim sanalar</h3>
        <div className="space-y-2">
          {upcomingEvents.map((event) => (
            <div
              key={event.title}
              className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-3 min-h-[48px]"
            >
              <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
                <CalendarDays className="w-5 h-5" />
              </div>
              <div>
                <p className="text-base font-medium text-zinc-800">{event.title}</p>
                <p className="text-sm text-zinc-500">{event.date}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
