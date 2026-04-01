import { Search, Plus, Pencil, Trash2 } from 'lucide-react';

const teachers = [
  { id: 1, name: 'Karimova Nilufar', subject: 'Matematika', classes: '5-A, 6-B', phone: '+998 90 123 45 67', status: 'Faol' },
  { id: 2, name: 'Rahimov Davron', subject: 'Fizika', classes: '7-A, 8-B', phone: '+998 91 234 56 78', status: 'Faol' },
  { id: 3, name: 'Aliyeva Malika', subject: 'Ingliz tili', classes: '5-B, 6-A', phone: '+998 93 345 67 89', status: 'Faol' },
  { id: 4, name: "Hasanov Sherzod", subject: 'Tarix', classes: '9-A, 10-B', phone: '+998 94 456 78 90', status: "Ta'tilda" },
  { id: 5, name: 'Toshmatova Dilnoza', subject: 'Biologiya', classes: '7-B, 8-A', phone: '+998 90 567 89 01', status: 'Faol' },
  { id: 6, name: "Umarov Jasur", subject: "O'zbek tili", classes: '5-A, 5-B, 6-A', phone: '+998 91 678 90 12', status: 'Faol' },
  { id: 7, name: 'Nazarova Gulnora', subject: 'Kimyo', classes: '8-A, 9-B', phone: '+998 93 789 01 23', status: "Ta'tilda" },
  { id: 8, name: 'Abdullayev Otabek', subject: 'Informatika', classes: '10-A, 11-A', phone: '+998 94 890 12 34', status: 'Faol' },
];

export default function AdminTeachers() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">O'qituvchilar</h1>
          <p className="text-sm text-zinc-500 mt-1">Jami: {teachers.length} ta o'qituvchi</p>
        </div>
        <button className="flex items-center gap-2 bg-zinc-900 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors">
          <Plus className="w-4 h-4" />
          Yangi qo'shish
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
        <input
          type="text"
          placeholder="Qidirish..."
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-zinc-200 bg-white text-sm text-zinc-700 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-300"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-zinc-50 border-b border-zinc-200">
              <th className="text-left px-4 py-3 font-semibold text-zinc-600">#</th>
              <th className="text-left px-4 py-3 font-semibold text-zinc-600">Ism</th>
              <th className="text-left px-4 py-3 font-semibold text-zinc-600">Fan</th>
              <th className="text-left px-4 py-3 font-semibold text-zinc-600">Sinf</th>
              <th className="text-left px-4 py-3 font-semibold text-zinc-600">Telefon</th>
              <th className="text-left px-4 py-3 font-semibold text-zinc-600">Status</th>
              <th className="text-right px-4 py-3 font-semibold text-zinc-600">Amallar</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map((teacher) => (
              <tr key={teacher.id} className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50 transition-colors">
                <td className="px-4 py-3 text-zinc-500">{teacher.id}</td>
                <td className="px-4 py-3 font-medium text-zinc-900">{teacher.name}</td>
                <td className="px-4 py-3 text-zinc-600">{teacher.subject}</td>
                <td className="px-4 py-3 text-zinc-600">{teacher.classes}</td>
                <td className="px-4 py-3 text-zinc-600">{teacher.phone}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      teacher.status === 'Faol'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {teacher.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button className="p-1.5 rounded-md hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700 transition-colors">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 rounded-md hover:bg-red-50 text-zinc-400 hover:text-red-600 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
