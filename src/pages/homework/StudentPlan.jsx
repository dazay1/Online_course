"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  FaBookOpen,
  FaCalendarCheck,
  FaLayerGroup,
  FaHashtag,
  FaArrowRight,
} from "react-icons/fa";
import AdminLayout from "../layout";

export default function StudentPlan() {
  const { userInfo } = useSelector((s) => s.userLogin);
  const groupId = userInfo?.className || null;

  const [planData, setPlanData] = useState(null);
  const [topics, setTopics] = useState([]);
  const [activeTab, setActiveTab] = useState("grammar");

  useEffect(() => {
    if (!groupId) return;

    const fetchStudentPlan = async () => {
      try {
        const res = await fetch(
          `https://sql-server-nb7m.onrender.com/api/plan/active`,
        );
        const data = await res.json();
        setPlanData(data);

        // ✅ ensure array
        const plansArray = Array.isArray(data) ? data : [data];

        const uniquePlanId = [
          ...new Set(plansArray.map((p) => p?.id).filter(Boolean)),
        ];

        const topicRes = await Promise.all(
          uniquePlanId.map(async (id) => {
            try {
              const r = await fetch(
                `https://sql-server-nb7m.onrender.com/api/teacher/plan/topics/${id}`,
              );
              return await r.json();
            } catch (err) {
              console.error("Fetch error:", err);
              return [];
            }
          }),
        );

        setTopics(topicRes.flat());
      } catch (error) {
        console.error("Error fetching student plan:", error);
      }
    };

    fetchStudentPlan();
  }, [userInfo, groupId]); // ✅ FIXED
  const groupIds = (groupId || "")
    .split(/[,\s]+/)
    .map((g) => g.trim())
    .filter((g) => g && g !== "null");
  const selectedPlan = Array.isArray(planData)
    ? planData.find((plan) => groupIds.includes(plan.group_id))
    : planData;
  const filteredTopics = topics.filter(
    (topic) => topic.plan_id === selectedPlan?.plan_id,
  );
  // ✅ safe reduce
  const groupedTopics = (filteredTopics || []).reduce((acc, topic) => {
    if (!topic?.type) return acc;
    if (!acc[topic.type]) acc[topic.type] = [];
    acc[topic.type].push(topic);
    return acc;
  }, {});

  const startDate = selectedPlan?.start_date;
  return (
    <AdminLayout hidden={true}>
      <div className="p-4 md:p-8 bg-[#f8fafc] min-h-screen">
        {/* HEADER */}
        <div className="mb-8 bg-white p-8 rounded-3xl shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-indigo-100 text-indigo-600 text-[10px] font-black uppercase px-2 py-0.5 rounded-md">
                My Curriculum
              </span>
            </div>
            <p className="text-slate-500 font-medium">
              Your personalized learning path and course materials.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm text-indigo-500">
              <FaCalendarCheck />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase leading-none">
                Joined On
              </p>
              <p className="text-sm font-bold text-slate-700">
                {startDate
                  ? new Date(startDate).toLocaleDateString("en-GB")
                  : "--/--/--"}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          {/* TABS */}
          <div className="flex border-b border-slate-100 bg-slate-50/50 overflow-x-auto">
            {["grammar", "vocabulary", "homework", "material"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-6 text-sm font-black transition-all border-b-2 uppercase tracking-widest whitespace-nowrap ${
                  activeTab === tab
                    ? "border-indigo-600 text-indigo-600 bg-white"
                    : "border-transparent text-slate-400 hover:text-slate-600"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="p-8">
            {groupedTopics[activeTab]?.length > 0 ? (
              <div className="space-y-12">
                {[0, 1, 2, 3].map((weekIndex) => {
                  const sorted = [...groupedTopics[activeTab]].sort(
                    (a, b) => (a.order_index || 0) - (b.order_index || 0),
                  );

                  const weekTopics = sorted.slice(
                    weekIndex * 3,
                    weekIndex * 3 + 3,
                  );

                  if (weekTopics.length === 0) return null;

                  return (
                    <div key={weekIndex} className="relative">
                      <div className="flex items-center gap-4 mb-8">
                        <div className="flex items-center gap-2 bg-slate-900 text-white px-4 py-1.5 rounded-full shadow-lg shadow-slate-200">
                          <FaHashtag size={10} className="text-indigo-400" />
                          <span className="text-xs font-black uppercase tracking-tighter">
                            Week {weekIndex + 1}
                          </span>
                        </div>
                        <div className="h-px bg-slate-100 flex-1"></div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {weekTopics.map((topic) => (
                          <div
                            key={topic?.id}
                            className="group bg-white p-6 rounded-2xl border border-slate-100 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-50/50 transition-all flex flex-col h-full"
                          >
                            <div className="flex justify-between items-start mb-4">
                              <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center font-black text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                {topic?.order_index ?? "-"}
                              </div>
                              <FaBookOpen
                                className="text-slate-200 group-hover:text-indigo-100 transition-colors"
                                size={24}
                              />
                            </div>

                            <h3 className="text-lg font-bold text-slate-800 mb-3 group-hover:text-indigo-600 transition-colors leading-tight">
                              {topic?.title || "Untitled"}
                            </h3>

                            <p className="text-sm text-slate-500 leading-relaxed mb-6 flex-1">
                              {topic?.description || "No description"}
                            </p>

                            <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                              <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">
                                Available
                              </span>
                              <FaArrowRight className="text-slate-300 group-hover:translate-x-1 transition-transform" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-24">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaLayerGroup size={32} className="text-slate-200" />
                </div>
                <h3 className="text-slate-800 font-bold text-xl">
                  No Content Yet
                </h3>
                <p className="text-slate-400 text-sm max-w-xs mx-auto mt-2">
                  There are no {activeTab} lessons scheduled for your group at
                  this moment.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
