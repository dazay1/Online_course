import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  FaBookOpen,
  FaCalendarAlt,
  FaLayerGroup,
  FaEdit,
  FaChevronRight,
  FaTrash,
  FaUserPlus,
  FaPlus,
  FaTimes,
} from "react-icons/fa";
import AdminLayout from "../layout";
import { toast } from "react-toastify";

export default function TeacherPlan() {
  const { userInfo } = useSelector((s) => s.userLogin);
  const teacherId = userInfo?.id || null;

  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [planInstances, setPlanInstances] = useState([]);
  const [topics, setTopics] = useState([]);
  const [activeTab, setActiveTab] = useState("grammar");
  const [isAddingPlan, setIsAddingPlan] = useState(false);
  const [planData, setPlanData] = useState({
    title: "",
    level: "",
    teacherId: userInfo?.id,
  });
  const [deletingId, setDeletingId] = useState(null);
  const [editingTopic, setEditingTopic] = useState(false);
  const [editForm, setEditForm] = useState({
    type: "grammar",
    title: "",
    description: "",
    order_index: 1,
  });
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [assignData, setAssignData] = useState({
    group_id: "",
    start_date: "",
    end_date: "",
  });

  const [isTopicModalOpen, setIsTopicModalOpen] = useState(false);
  const [newTopic, setNewTopic] = useState({
    type: "grammar",
    title: "",
    description: "",
    order_index: 1,
  });
  const planId = selectedPlan?.id;
  useEffect(() => {
    if (!teacherId) return;
    const fetchPlans = async () => {
      try {
        const planRes = await fetch(
          `https://sql-server-nb7m.onrender.com/api/teacher/plan/${teacherId}`,
        );
        const planData = await planRes.json();
        setPlans(planData);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchPlans();
  }, [teacherId]);

  useEffect(() => {
    if (!selectedPlan) return;
    fetchPlanData();
  }, [selectedPlan]);

  const fetchPlanData = async () => {
    try {
      const instanceRes = await fetch(
        `https://sql-server-nb7m.onrender.com/api/teacher/plan/data/${selectedPlan.id}`,
      );
      setPlanInstances(await instanceRes.json());

      const topicsRes = await fetch(
        `https://sql-server-nb7m.onrender.com/api/teacher/plan/topics/${selectedPlan.id}`,
      );
      setTopics(await topicsRes.json());
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const handleAssignPlan = async () => {
    try {
      await fetch(
        `https://sql-server-nb7m.onrender.com/api/teacher/plan/assign`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ planId: planId, ...assignData }),
        },
      );

      setIsAssignModalOpen(false);
      fetchPlanData();
    } catch (err) {
      console.error(err);
    }
  };
  const handleCreatePlan = async () => {
    try {
      await fetch("https://sql-server-nb7m.onrender.com/api/teacher/plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(planData),
      });
      setIsAddingPlan(false);
      fetchPlanData();
    } catch (error) {
      console.error(error);
      toast.error(error);
    }
  };
  const handleCreateTopic = async () => {
    try {
      const res = await fetch(
        "https://sql-server-nb7m.onrender.com/api/teacher/topics/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            planId: planId,
            ...newTopic,
          }),
        },
      );
      if (res.ok) {
        toast.success("Plan created successfully");
        setIsTopicModalOpen(false);
      }
      fetchPlanData();
    } catch (err) {
      console.error(err);
    }
  };
  const handleDeleteDeployment = async (instanceId) => {
    try {
      const res = await fetch(
        `https://sql-server-nb7m.onrender.com/api/plan/instance/${instanceId}`,
        { method: "DELETE" },
      );

      if (res.ok) {
        setPlanInstances((prev) =>
          prev.filter((item) => item.id !== instanceId),
        );
        setDeletingId(null); // Reset the state
      }
    } catch (error) {
      console.error("Delete Error:", error);
      setDeletingId(null); // Reset even if it fails
    }
  };
  const handleUpdateTopic = async () => {
    try {
      await fetch(
        `https://sql-server-nb7m.onrender.com/api/teacher/topics/update/${editingTopic.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editForm),
        },
      );

      setEditingTopic(false);
      fetchPlanData(); // refresh
    } catch (err) {
      console.error(err);
    }
  };
  const groupedTopics = topics.reduce((acc, topic) => {
    if (!acc[topic.type]) acc[topic.type] = [];
    acc[topic.type].push(topic);
    return acc;
  }, {});
  const subjectTabs = {
    "ingliz tili": ["grammar", "vocabulary", "homework", "material"],
    "grafik dizayn": ["theory", "practice", "project", "material"],
    // default fallback if subject is missing
    default: ["overview", "tasks", "resources"],
  };
  return (
    <AdminLayout hidden={true}>
      <div className="p-4 md:p-8 bg-[#f8fafc] min-h-screen">
        {/* HEADER & CONTROLS */}
        <div className="mb-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <FaBookOpen className="text-indigo-500" />
              Plan Management
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Configure your curriculum and assign it to active student groups.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <select
              className="bg-slate-50 border border-slate-300 text-slate-900 text-sm rounded-xl p-3 min-w-[200px] font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
              onChange={(e) => {
                const plan = plans.find((p) => p.id === Number(e.target.value));
                setSelectedPlan(plan);
              }}
            >
              <option value="">Select a Template</option>
              {plans.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
            {!selectedPlan && (
              <div className="relative">
                <button
                  onClick={() => setIsAddingPlan(!isAddingPlan)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all active:scale-95 shadow-sm border ${
                    isAddingPlan
                      ? "bg-slate-800 border-slate-800 text-white"
                      : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {isAddingPlan ? (
                    <FaTimes />
                  ) : (
                    <FaPlus className="text-indigo-500" />
                  )}
                  {isAddingPlan ? "Close" : "Add Plan"}
                </button>

                {/* FLOATING INPUT CARD - This won't move your other buttons */}
                {isAddingPlan && (
                  <div className="absolute top-full right-0 mt-3 w-[320px] bg-white rounded-3xl shadow-2xl border border-slate-100 p-5 z-[70] animate-in zoom-in-95 duration-200 origin-top-right">
                    <div className="space-y-4">
                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">
                          Plan Title
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Advanced English"
                          value={planData.title}
                          onChange={(e) =>
                            setPlanData({ ...planData, title: e.target.value })
                          }
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all font-medium"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">
                          Plan level
                        </label>
                        <input
                          placeholder="e.g. Beginner"
                          value={planData.level}
                          onChange={(e) =>
                            setPlanData({
                              ...planData,
                              level: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all font-medium resize-none"
                        />
                      </div>
                      <button
                        onClick={() => {
                          handleCreatePlan();
                        }}
                        className="w-full bg-indigo-600 text-white py-3 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all"
                      >
                        Save New Plan
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
            {selectedPlan && (
              <>
                <button
                  onClick={() => setIsAssignModalOpen(true)}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl font-bold text-sm transition-all shadow-lg shadow-indigo-100"
                >
                  <FaUserPlus /> Assign to Group
                </button>
                {isAssignModalOpen && (
                  <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    {/* Backdrop with heavy blur for focus */}
                    <div
                      className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity"
                      onClick={() => setIsAssignModalOpen(false)}
                    />

                    {/* Modal Container */}
                    <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-modalEnter">
                      {/* Visual Header */}
                      <div className="bg-indigo-600 p-8 text-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
                        <div className="relative z-10">
                          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border border-white/30">
                            <FaUserPlus className="text-white text-2xl" />
                          </div>
                          <h2 className="text-2xl font-black text-white">
                            Deploy Plan
                          </h2>
                          <p className="text-indigo-100 text-sm mt-1 font-medium italic">
                            Assigning "{selectedPlan?.title}"
                          </p>
                        </div>
                      </div>

                      {/* Form Content */}
                      <div className="p-8 space-y-6">
                        {/* Group ID Input */}
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <FaLayerGroup /> Target Student Group
                          </label>
                          <div className="relative">
                            <input
                              placeholder="Enter Group ID (e.g., #105)"
                              className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 pl-12 font-bold text-slate-700 focus:border-indigo-500 focus:bg-white outline-none transition-all"
                              onChange={(e) =>
                                setAssignData({
                                  ...assignData,
                                  group_id: e.target.value,
                                })
                              }
                            />
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 font-bold">
                              #
                            </span>
                          </div>
                        </div>

                        {/* Date Selection Grid */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                              <FaCalendarAlt /> Start Date
                            </label>
                            <input
                              type="date"
                              className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-3 text-sm font-bold text-slate-600 focus:border-indigo-500 outline-none transition-all"
                              onChange={(e) =>
                                setAssignData({
                                  ...assignData,
                                  start_date: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                              <FaCalendarAlt /> End Date
                            </label>
                            <input
                              type="date"
                              className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-3 text-sm font-bold text-slate-600 focus:border-indigo-500 outline-none transition-all"
                              onChange={(e) =>
                                setAssignData({
                                  ...assignData,
                                  end_date: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>

                        {/* Notice/Warning */}
                        <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 flex gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                          <p className="text-[11px] text-amber-700 leading-relaxed">
                            Assigning this plan will immediately make all
                            lessons visible to students in the specified group.
                          </p>
                        </div>
                      </div>

                      {/* Action Footer */}
                      <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center gap-4">
                        <button
                          onClick={() => setIsAssignModalOpen(false)}
                          className="flex-1 px-4 py-3 rounded-xl font-bold text-slate-400 hover:text-slate-600 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleAssignPlan}
                          className="flex-[2] bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-4 rounded-2xl font-black shadow-lg shadow-indigo-100 hover:shadow-indigo-200 transition-all flex items-center justify-center gap-2"
                        >
                          Confirm Assignment
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                <button
                  onClick={() => setIsTopicModalOpen(true)}
                  className="flex items-center gap-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-5 py-3 rounded-xl font-bold text-sm transition-all"
                >
                  <FaPlus /> New Topic
                </button>
                {isTopicModalOpen && (
                  <div className="fixed inset-0 z-50 overflow-hidden">
                    {/* Backdrop */}
                    <div
                      className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
                      onClick={() => setIsTopicModalOpen(false)}
                    />

                    <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
                      <div className="w-screen max-w-md animate-slideIn">
                        <div className="h-full flex flex-col bg-white shadow-2xl border-l border-slate-200">
                          {/* Drawer Header */}
                          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <div>
                              <h2 className="text-xl font-black text-slate-800 tracking-tight">
                                Add New Lesson
                              </h2>
                              <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mt-1">
                                Curriculum Architect
                              </p>
                            </div>
                            <button
                              onClick={() => setIsTopicModalOpen(false)}
                              className="p-2 rounded-full hover:bg-slate-200 text-slate-400 transition-colors"
                            >
                              <FaChevronRight className="text-sm" />
                            </button>
                          </div>

                          {/* Drawer Body */}
                          <div className="flex-1 overflow-y-auto p-8 space-y-8">
                            {/* Lesson Identity Section */}
                            <div className="space-y-4">
                              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">
                                Lesson Identity
                              </label>

                              <div className="flex gap-4">
                                <div className="w-20">
                                  <label className="block text-[10px] font-bold text-slate-500 mb-1">
                                    Number
                                  </label>
                                  <input
                                    type="number"
                                    value={newTopic.order_index}
                                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-3 text-center font-black text-indigo-600 focus:border-indigo-500 outline-none transition-all"
                                    onChange={(e) =>
                                      setNewTopic({
                                        ...newTopic,
                                        order_index: Number(e.target.value),
                                      })
                                    }
                                  />
                                </div>
                                <div className="flex-1">
                                  <label className="block text-[10px] font-bold text-slate-500 mb-1">
                                    Lesson Title
                                  </label>
                                  <input
                                    placeholder="e.g., Past Participles"
                                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-3 font-bold text-slate-700 focus:border-indigo-500 outline-none transition-all"
                                    onChange={(e) =>
                                      setNewTopic({
                                        ...newTopic,
                                        title: e.target.value,
                                      })
                                    }
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Category Selector */}
                            <div className="space-y-4">
                              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">
                                Category
                              </label>
                              <div className="grid grid-cols-2 gap-2">
                                {(userInfo.subject?.toLowerCase() ===
                                "grafik dizayn"
                                  ? [
                                      "theory",
                                      "practice",
                                      "project",
                                      "material",
                                    ]
                                  : [
                                      "grammar",
                                      "vocabulary",
                                      "homework",
                                      "material",
                                    ]
                                ).map((type) => (
                                  <button
                                    key={type}
                                    onClick={() =>
                                      setNewTopic({ ...newTopic, type })
                                    }
                                    className={`p-3 rounded-xl border-2 text-xs font-black uppercase tracking-tighter transition-all ${
                                      newTopic.type === type
                                        ? "border-indigo-600 bg-indigo-50 text-indigo-700 shadow-sm"
                                        : "border-slate-100 bg-white text-slate-400 hover:border-slate-200"
                                    }`}
                                  >
                                    {type}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Content Section */}
                            <div className="space-y-4">
                              <label className="text-xs font-black text-slate-400 uppercase tracking-widest">
                                Lesson Detail
                              </label>
                              <textarea
                                rows={5}
                                placeholder="What will the students learn in this lesson?"
                                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 text-sm text-slate-600 focus:border-indigo-500 outline-none transition-all resize-none"
                                onChange={(e) =>
                                  setNewTopic({
                                    ...newTopic,
                                    description: e.target.value,
                                  })
                                }
                              />
                            </div>
                          </div>

                          {/* Drawer Footer */}
                          <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3">
                            <button
                              onClick={() => setIsTopicModalOpen(false)}
                              className="flex-1 px-6 py-4 rounded-2xl font-bold text-slate-500 hover:bg-slate-200 transition-all"
                            >
                              Discard
                            </button>
                            <button
                              onClick={handleCreateTopic}
                              className="flex-[2] bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-4 rounded-2xl font-black shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-all transform active:scale-95"
                            >
                              Publish Lesson
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {selectedPlan && (
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
            {/* SIDEBAR - Current Assignments */}
            <div className="xl:col-span-1 space-y-4">
              <div className="flex items-center justify-between px-1">
                <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest">
                  Active Deployments
                </h2>
                <span className="text-[10px] bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full font-bold">
                  {planInstances.length}
                </span>
              </div>
              {planInstances.map((instance) => (
                <div
                  key={instance.id}
                  className="bg-white rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group transition-all"
                >
                  {/* MAIN CONTENT LAYER */}
                  <div
                    className={`p-4 transition-opacity ${deletingId === instance.id ? "opacity-20 blur-[1px]" : "opacity-100"}`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-bold text-slate-800 text-sm">
                        Group #{instance.group_id}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setDeletingId(instance.id)}
                          className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <FaTrash size={12} />
                        </button>
                        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                      </div>
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1">
                      <FaCalendarAlt size={10} />{" "}
                      {new Date(instance.start_date).toLocaleDateString()}
                    </div>
                  </div>

                  {/* INLINE WARNING OVERLAY */}
                  {deletingId === instance.id && (
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px] flex flex-col items-center justify-center p-2 animate-fadeIn">
                      <p className="text-[10px] font-black text-red-600 uppercase tracking-tighter mb-2">
                        Remove this plan?
                      </p>
                      <div className="flex gap-2 w-full px-2">
                        <button
                          onClick={() => setDeletingId(null)}
                          className="flex-1 py-1.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-lg hover:bg-slate-200 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleDeleteDeployment(instance.id)}
                          className="flex-1 py-1.5 bg-red-600 text-white text-[10px] font-bold rounded-lg hover:bg-red-700 shadow-sm transition-colors"
                        >
                          Confirm
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* MAIN CONTENT - Topic Editor with Weekly Grouping */}
            <div className="xl:col-span-3 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="flex border-b border-slate-100 bg-slate-50/50">
                {(
                  subjectTabs[userInfo.subject?.toLowerCase()] ||
                  subjectTabs.default
                ).map((tab) => {
                  const isActive = activeTab === tab;
                  return (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`relative px-8 py-5 text-sm font-black uppercase tracking-widest transition-all min-w-fit flex items-center gap-2 ${
                        isActive
                          ? "text-indigo-600 bg-white"
                          : "text-slate-400 hover:text-slate-600 hover:bg-slate-100/50"
                      }`}
                    >
                      {/* Visual Indicator for Active Tab */}
                      {isActive && (
                        <span className="absolute bottom-0 left-0 w-full h-1 bg-indigo-600 animate-in fade-in zoom-in duration-300" />
                      )}

                      {/* Dynamic Icon Logic (Optional but recommended) */}
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-indigo-600" : "bg-transparent"}`}
                      />

                      {tab}
                    </button>
                  );
                })}
              </div>

              <div className="p-8">
                {groupedTopics[activeTab]?.length > 0 ? (
                  <div className="space-y-10">
                    {/* Weekly Grouping Logic for 12 Lessons */}
                    {[0, 1, 2, 3].map((weekIndex) => {
                      const weekTopics = groupedTopics[activeTab]
                        .sort((a, b) => a.order_index - b.order_index)
                        .slice(weekIndex * 3, weekIndex * 3 + 3);

                      if (weekTopics.length === 0) return null;

                      return (
                        <div key={weekIndex}>
                          <div className="flex items-center gap-4 mb-6">
                            <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">
                              Week {weekIndex + 1}
                            </h4>
                            <div className="h-px bg-slate-100 flex-1"></div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {weekTopics.map((topic) => (
                              <div
                                key={topic.id}
                                className="group relative flex gap-5 p-5 rounded-2xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/20 transition-all cursor-pointer bg-white"
                                onClick={() => {
                                  setEditingTopic(topic);
                                  setEditForm({
                                    type: topic.type,
                                    title: topic.title,
                                    description: topic.description,
                                    order_index: topic.order_index,
                                  });
                                }}
                              >
                                <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center font-black text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                  {topic.order_index}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between gap-2">
                                    <h3 className="font-bold text-slate-800 group-hover:text-indigo-700 transition-colors truncate">
                                      {topic.title}
                                    </h3>
                                    <FaEdit className="text-slate-300 group-hover:text-indigo-400 opacity-0 group-hover:opacity-100 transition-all shrink-0" />
                                  </div>
                                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                                    {topic.description}
                                  </p>
                                </div>
                              </div>
                            ))}
                            {editingTopic && (
                              <div className="fixed inset-0 z-50 overflow-hidden">
                                {/* Backdrop with a slightly different tint to distinguish 'Edit' mode */}
                                <div
                                  className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setEditingTopic(false);
                                  }}
                                />

                                <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
                                  <div
                                    className="w-screen max-w-md animate-slideIn"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <div className="h-full flex flex-col bg-white shadow-2xl border-l border-slate-200">
                                      {/* Drawer Header - Indigo Gradient for Edit Mode */}
                                      <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-indigo-50/30">
                                        <div className="flex items-center gap-3">
                                          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-indigo-100 shadow-lg">
                                            <FaEdit size={18} />
                                          </div>
                                          <div>
                                            <h2 className="text-xl font-black text-slate-800 tracking-tight">
                                              Edit Lesson
                                            </h2>
                                            <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-widest mt-0.5">
                                              Topic ID: #{editingTopic.id}
                                            </p>
                                          </div>
                                        </div>
                                        <button
                                          onClick={() => setEditingTopic(false)}
                                          className="p-2 rounded-full hover:bg-slate-200 text-slate-400 transition-colors"
                                        >
                                          <FaChevronRight className="text-sm" />
                                        </button>
                                      </div>

                                      {/* Drawer Body */}
                                      <div className="flex-1 overflow-y-auto p-8 space-y-8">
                                        {/* Lesson Positioning */}
                                        <div className="space-y-4">
                                          <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                            <FaLayerGroup className="text-indigo-400" />{" "}
                                            Sequence & Title
                                          </label>

                                          <div className="flex gap-4">
                                            <div className="w-24">
                                              <label className="block text-[10px] font-bold text-slate-500 mb-1">
                                                Order
                                              </label>
                                              <input
                                                type="number"
                                                value={editForm.order_index}
                                                className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-3 text-center font-black text-indigo-600 focus:border-indigo-500 focus:bg-white outline-none transition-all"
                                                onChange={(e) =>
                                                  setEditForm({
                                                    ...editForm,
                                                    order_index: Number(
                                                      e.target.value,
                                                    ),
                                                  })
                                                }
                                              />
                                            </div>
                                            <div className="flex-1">
                                              <label className="block text-[10px] font-bold text-slate-500 mb-1">
                                                Title
                                              </label>
                                              <input
                                                value={editForm.title}
                                                className="w-full bg-slate-50 border-2 border-slate-100 rounded-xl p-3 font-bold text-slate-700 focus:border-indigo-500 focus:bg-white outline-none transition-all"
                                                onChange={(e) =>
                                                  setEditForm({
                                                    ...editForm,
                                                    title: e.target.value,
                                                  })
                                                }
                                              />
                                            </div>
                                          </div>
                                        </div>

                                        {/* Category Toggle */}
                                        <div className="space-y-4">
                                          <label className="text-xs font-black text-slate-400 uppercase tracking-widest">
                                            Classification
                                          </label>
                                          <div className="grid grid-cols-2 gap-2">
                                            {[
                                              "grammar",
                                              "vocabulary",
                                              "homework",
                                              "material",
                                            ].map((type) => (
                                              <button
                                                key={type}
                                                onClick={() =>
                                                  setEditForm({
                                                    ...editForm,
                                                    type,
                                                  })
                                                }
                                                className={`p-3 rounded-xl border-2 text-[11px] font-black uppercase tracking-wider transition-all ${
                                                  editForm.type === type
                                                    ? "border-indigo-600 bg-indigo-600 text-white shadow-md"
                                                    : "border-slate-100 bg-white text-slate-400 hover:border-slate-200"
                                                }`}
                                              >
                                                {type}
                                              </button>
                                            ))}
                                          </div>
                                        </div>

                                        {/* Description TextArea */}
                                        <div className="space-y-4">
                                          <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                            <FaBookOpen className="text-indigo-400" />{" "}
                                            Content Summary
                                          </label>
                                          <textarea
                                            rows={6}
                                            value={editForm.description}
                                            className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 text-sm text-slate-600 focus:border-indigo-500 focus:bg-white outline-none transition-all resize-none leading-relaxed"
                                            onChange={(e) =>
                                              setEditForm({
                                                ...editForm,
                                                description: e.target.value,
                                              })
                                            }
                                          />
                                        </div>
                                      </div>

                                      {/* Drawer Footer */}
                                      <div className="p-6 bg-slate-50 border-t border-slate-100 flex gap-3">
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setEditingTopic(false);
                                          }}
                                          className="flex-1 px-6 py-4 rounded-2xl font-bold text-slate-500 hover:bg-slate-200 transition-all"
                                        >
                                          Cancel
                                        </button>
                                        <button
                                          onClick={handleUpdateTopic}
                                          className="flex-[2] bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-4 rounded-2xl font-black shadow-lg shadow-indigo-100 hover:shadow-indigo-300 transition-all transform active:scale-95 flex items-center justify-center gap-2"
                                        >
                                          Update Changes
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-20 text-slate-300">
                    <FaLayerGroup
                      size={40}
                      className="mx-auto mb-4 opacity-20"
                    />
                    <p className="font-medium italic">
                      No {activeTab} topics found for this plan.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
