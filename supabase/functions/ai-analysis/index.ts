import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const SYSTEM_PROMPT = `Siz Murabbiyona ta'lim platformasining AI tahlilchisisiz. O'quvchining akademik natijalarini tahlil qilib, o'zbek tilida qisqa va aniq hisobot bering.

Hisobotda:
1. KUCHLI TOMONLAR — o'quvchi eng yaxshi natija ko'rsatayotgan fanlar va ko'nikmalar
2. ZAIF TOMONLAR — yaxshilanish kerak bo'lgan sohalar
3. DAVOMAT TAHLILI — davomat holati va ta'siri
4. TAVSIYALAR — o'qituvchi uchun aniq tavsiyalar (3-5 ta)
5. OTA-ONALAR UCHUN — ota-onalarga qisqa xulosa

Qisqa, professional va konstruktiv ton saqlang.

Javobni quyidagi JSON formatda bering:
{
  "analysis": "To'liq tahlil matni",
  "strengths": ["Kuchli tomon 1", "Kuchli tomon 2"],
  "weaknesses": ["Zaif tomon 1", "Zaif tomon 2"],
  "recommendations": ["Tavsiya 1", "Tavsiya 2", "Tavsiya 3"],
  "trend": "improving | stable | declining"
}

Faqat JSON formatda javob bering, boshqa matn qo'shmang.`;

interface Grade {
  score: number;
  max_score: number;
  percentage: number;
  grade_type: string;
  date: string;
  comment: string | null;
  subject_id: string;
  subjects: { name_uz: string } | null;
}

interface AttendanceRecord {
  date: string;
  status: string;
}

interface SubjectStats {
  name: string;
  averageScore: number;
  totalGrades: number;
}

function calculateSubjectAverages(grades: Grade[]): SubjectStats[] {
  const subjectMap = new Map<
    string,
    { name: string; totalPercentage: number; count: number }
  >();

  for (const grade of grades) {
    const subjectName = grade.subjects?.name_uz || "Noma'lum fan";
    const existing = subjectMap.get(grade.subject_id);
    if (existing) {
      existing.totalPercentage += grade.percentage;
      existing.count += 1;
    } else {
      subjectMap.set(grade.subject_id, {
        name: subjectName,
        totalPercentage: grade.percentage,
        count: 1,
      });
    }
  }

  return Array.from(subjectMap.values()).map((s) => ({
    name: s.name,
    averageScore: Math.round((s.totalPercentage / s.count) * 100) / 100,
    totalGrades: s.count,
  }));
}

function calculateAttendanceRate(records: AttendanceRecord[]): number {
  if (records.length === 0) return 0;
  const present = records.filter(
    (r) => r.status === "present" || r.status === "late"
  ).length;
  return Math.round((present / records.length) * 10000) / 100;
}

function calculateTrend(grades: Grade[]): "improving" | "stable" | "declining" {
  if (grades.length < 4) return "stable";

  const sorted = [...grades].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const mid = Math.floor(sorted.length / 2);
  const firstHalf = sorted.slice(0, mid);
  const secondHalf = sorted.slice(mid);

  const avgFirst =
    firstHalf.reduce((sum, g) => sum + g.percentage, 0) / firstHalf.length;
  const avgSecond =
    secondHalf.reduce((sum, g) => sum + g.percentage, 0) / secondHalf.length;

  const diff = avgSecond - avgFirst;
  if (diff > 5) return "improving";
  if (diff < -5) return "declining";
  return "stable";
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    // Verify authentication
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Avtorizatsiya talab qilinadi" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: { headers: { Authorization: authHeader } },
      }
    );

    const {
      data: { user },
      error: authError,
    } = await supabaseClient.auth.getUser();

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Foydalanuvchi autentifikatsiya qilinmagan" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Parse request body
    const { student_id, class_id } = await req.json();

    if (!student_id || !class_id) {
      return new Response(
        JSON.stringify({
          error: "student_id va class_id majburiy maydonlar",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Create admin client for data fetching
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Fetch student info, grades, and attendance in parallel
    const [studentResult, gradesResult, attendanceResult] = await Promise.all([
      supabaseAdmin
        .from("students")
        .select("first_name, last_name")
        .eq("id", student_id)
        .single(),
      supabaseAdmin
        .from("grades")
        .select(
          "score, max_score, percentage, grade_type, date, comment, subject_id, subjects(name_uz)"
        )
        .eq("student_id", student_id),
      supabaseAdmin
        .from("attendance")
        .select("date, status")
        .eq("student_id", student_id),
    ]);

    if (studentResult.error || !studentResult.data) {
      return new Response(
        JSON.stringify({ error: "O'quvchi topilmadi" }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const student = studentResult.data;
    const grades: Grade[] = gradesResult.data || [];
    const attendance: AttendanceRecord[] = attendanceResult.data || [];

    // Handle empty data
    if (grades.length === 0 && attendance.length === 0) {
      return new Response(
        JSON.stringify({
          analysis: `${student.first_name} ${student.last_name} uchun hali yetarli ma'lumot mavjud emas. Baholar va davomat ma'lumotlari kiritilgandan so'ng tahlil qilish mumkin bo'ladi.`,
          strengths: [],
          weaknesses: [],
          recommendations: [
            "O'quvchining baholarini muntazam kiritib boring",
            "Davomat ma'lumotlarini yangilang",
          ],
          trend: "stable" as const,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Calculate analytics
    const subjectAverages = calculateSubjectAverages(grades);
    const attendanceRate = calculateAttendanceRate(attendance);
    const trend = calculateTrend(grades);

    const sortedByAverage = [...subjectAverages].sort(
      (a, b) => b.averageScore - a.averageScore
    );
    const bestSubjects = sortedByAverage.slice(0, 3);
    const worstSubjects = sortedByAverage.slice(-3).reverse();

    // Build context for AI
    const studentContext = `
O'quvchi: ${student.first_name} ${student.last_name}

FANLAR BO'YICHA O'RTACHA BALLAR:
${subjectAverages.map((s) => `- ${s.name}: ${s.averageScore}% (${s.totalGrades} ta baho)`).join("\n")}

ENG YAXSHI FANLAR:
${bestSubjects.map((s) => `- ${s.name}: ${s.averageScore}%`).join("\n")}

ENG ZAIF FANLAR:
${worstSubjects.map((s) => `- ${s.name}: ${s.averageScore}%`).join("\n")}

DAVOMAT:
- Jami kunlar: ${attendance.length}
- Davomat foizi: ${attendanceRate}%
- Sababsiz qoldirilgan: ${attendance.filter((a) => a.status === "absent").length} kun

TREND: ${trend === "improving" ? "Yaxshilanmoqda" : trend === "declining" ? "Pasaymoqda" : "Barqaror"}

BAHOLAR TARIXI (oxirgi 20 ta):
${grades
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  .slice(0, 20)
  .map(
    (g) =>
      `- ${g.date}: ${g.subjects?.name_uz || "Noma'lum"} — ${g.score}/${g.max_score} (${g.percentage}%) [${g.grade_type}]`
  )
  .join("\n")}
`;

    // Call OpenAI API
    const openaiApiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openaiApiKey) {
      return new Response(
        JSON.stringify({ error: "OpenAI API kaliti sozlanmagan" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const openaiResponse = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${openaiApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: studentContext },
          ],
          temperature: 0.7,
          max_tokens: 2048,
        }),
      }
    );

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.json();
      throw new Error(
        `OpenAI API xatosi: ${errorData.error?.message || "Noma'lum xato"}`
      );
    }

    const openaiData = await openaiResponse.json();
    const responseText =
      openaiData.choices?.[0]?.message?.content || "";

    // Parse AI response as JSON
    let result: {
      analysis: string;
      strengths: string[];
      weaknesses: string[];
      recommendations: string[];
      trend: "improving" | "stable" | "declining";
    };

    try {
      // Strip markdown code fences if present
      const cleanedText = responseText
        .replace(/^```json\s*\n?/, "")
        .replace(/\n?```\s*$/, "")
        .trim();
      result = JSON.parse(cleanedText);
    } catch {
      // If AI didn't return valid JSON, build a structured response
      result = {
        analysis: responseText,
        strengths: bestSubjects.map(
          (s) => `${s.name} fanidan yuqori natija (${s.averageScore}%)`
        ),
        weaknesses: worstSubjects.map(
          (s) => `${s.name} fanida yaxshilanish kerak (${s.averageScore}%)`
        ),
        recommendations: [
          "Zaif fanlar bo'yicha qo'shimcha mashg'ulotlar tashkil etish",
          "O'quvchining kuchli tomonlarini rag'batlantirish",
          "Davomat nazoratini kuchaytirish",
        ],
        trend,
      };
    }

    // Ensure trend field uses calculated value as fallback
    if (!["improving", "stable", "declining"].includes(result.trend)) {
      result.trend = trend;
    }

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("AI analysis error:", error);
    return new Response(
      JSON.stringify({
        error: "Ichki server xatosi yuz berdi",
        details: error.message,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
