"use client";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import React, { useState, useCallback, useMemo, useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { FaChevronLeft, FaChevronRight, FaBookOpen, FaHome, FaTimes } from "react-icons/fa";

const localizer = momentLocalizer(moment);

// --- Styled Toolbar ---
const CustomToolbar = React.memo(({ label, onNavigate, onView, view }) => (
  <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4 bg-white/80 backdrop-blur-md p-4 rounded-[2rem] border border-slate-200/60 shadow-xl shadow-slate-200/40 sticky top-0 z-10">
    <div className="flex items-center gap-6">
      <div className="flex bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200">
        <button 
          onClick={() => onNavigate("PREV")} 
          className="p-2.5 hover:bg-white hover:shadow-sm rounded-xl transition-all text-slate-600 active:scale-95"
        >
          <FaChevronLeft size={14} />
        </button>
        <button 
          onClick={() => onNavigate("TODAY")} 
          className="px-6 text-[11px] font-black uppercase tracking-[0.15em] text-slate-500 hover:text-indigo-600 transition-all"
        >
          Today
        </button>
        <button 
          onClick={() => onNavigate("NEXT")} 
          className="p-2.5 hover:bg-white hover:shadow-sm rounded-xl transition-all text-slate-600 active:scale-95"
        >
          <FaChevronRight size={14} />
        </button>
      </div>
      <h2 className="text-2xl font-black text-slate-800 tracking-tight hidden lg:block">
        {label}
      </h2>
    </div>

    <div className="flex gap-1.5 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200">
      {["week", "day"].map((v) => (
        <button
          key={v}
          onClick={() => onView(v)}
          className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
            view === v 
              ? "bg-white text-indigo-600 shadow-md shadow-indigo-100 ring-1 ring-slate-200" 
              : "text-slate-400 hover:text-slate-600"
          }`}
        >
          {v}
        </button>
      ))}
    </div>
  </div>
));

function BigCalendar({ group }) {
  const { userInfo } = useSelector((state) => state.userLogin);
  const [events, setEvents] = useState([]);
  const [view, setView] = useState(Views.WEEK);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [topicsMap, setTopicsMap] = useState({});

  // Logic remains untouched as per your code
  const classesArray = useMemo(() =>
    typeof group === "string" ? group.split(",").map((g) => g.trim()) : Array.isArray(group) ? group : [],
    [group]
  );

  const eventPropGetter = useCallback((event) => ({
    className: `!rounded-2xl !border-0 !p-1 !transition-all hover:!scale-[1.02] hover:!shadow-lg ${
      event.plan_id
        ? "!bg-gradient-to-br !text-white shadow-indigo-200"
        : "!bg-slate-100 !text-slate-400 opacity-70"
    }`,
  }), []);

  console.log(selectedEvent)
  const EventComponent = useCallback(({ event }) => {
    const topics = topicsMap[event.plan_id] || [];
    const currentTopic = topics.find((t) => t.order_index === event.lessonOrder);
    return (
      <div className="flex flex-col h-full text-[10px] p-2 leading-tight">
        <div className="font-black uppercase tracking-tighter opacity-80">{event.group}</div>
        <div className="font-bold text-sm truncate mt-0.5">{event.title}</div>
        {currentTopic && (
          <div className="mt-auto pt-1 border-t border-white/20 truncate italic opacity-90 font-medium">
            {currentTopic.title}
          </div>
        )}
      </div>
    );
  }, [topicsMap]);

  // (All Logic Functions: formatLessons, fetchData, useEffect - remain EXACTLY same as your provided code)
  const formatLessons = useCallback((lessons, activePlans, startDate, endDate) => {
    const formattedEvents = [];
    const eventSet = new Set();
    const viewStart = moment(startDate).startOf("day");
    const viewEnd = moment(endDate).endOf("day");
    const dayMap = { Mon: 1, Tue: 2, Wed: 3, Thurs: 4, Fri: 5, Sat: 6, Sun: 0 };
    const groupLessonCounter = {};

    lessons.forEach((lesson) => {
      const daysArray = [...new Set(lesson.day.split(",").map((d) => d.trim()))];
      const groupName = lesson.name;
      daysArray.forEach((dayName) => {
        const dayNumber = dayMap[dayName];
        if (dayNumber === undefined) return;
        const plan = activePlans.find((p) => p.group_id === groupName);
        let currentIteration;
        if (plan) {
          const planStart = moment(plan.start_date).startOf("day");
          const planEnd = moment(plan.end_date).endOf("day");
          currentIteration = moment(planStart).day(dayNumber);
          if (currentIteration.isBefore(planStart)) currentIteration.add(7, "days");
          while (currentIteration.isSameOrBefore(planEnd)) {
            groupLessonCounter[groupName] = (groupLessonCounter[groupName] || 0) + 1;
            if (currentIteration.isSameOrAfter(viewStart) && currentIteration.isSameOrBefore(viewEnd)) {
              const eventId = `${lesson.name}-${lesson.startTime}-${currentIteration.valueOf()}`;
              if (!eventSet.has(eventId)) {
                eventSet.add(eventId);
                formattedEvents.push({
                  id: eventId,
                  title: lesson.subject,
                  start: moment(currentIteration).set({ hour: parseInt(lesson.startTime), minute: 0 }).toDate(),
                  end: moment(currentIteration).set({ hour: parseInt(lesson.endTime), minute: 0 }).toDate(),
                  group: lesson.name,
                  plan_id: plan.plan_id,
                  lessonOrder: groupLessonCounter[groupName],
                  homework_text: plan.homework,
                });
              }
            }
            currentIteration.add(7, "days");
          }
        } else {
          currentIteration = moment(viewStart).day(dayNumber);
          if (currentIteration.isBefore(viewStart)) currentIteration.add(7, "days");
          while (currentIteration.isSameOrBefore(viewEnd)) {
            const eventId = `${lesson.name}-${lesson.startTime}-${currentIteration.valueOf()}`;
            if (!eventSet.has(eventId)) {
              eventSet.add(eventId);
              formattedEvents.push({
                id: eventId,
                title: lesson.subject,
                start: moment(currentIteration).set({ hour: parseInt(lesson.startTime), minute: 0 }).toDate(),
                end: moment(currentIteration).set({ hour: parseInt(lesson.endTime), minute: 0 }).toDate(),
                group: lesson.name,
                plan_id: null,
              });
            }
            currentIteration.add(7, "days");
          }
        }
      });
    });
    return formattedEvents;
  }, []);

  const fetchData = useCallback(async (start, end) => {
    try {
      const [lessonRes, planRes] = await Promise.all([
        fetch("https://sql-server-nb7m.onrender.com/api/lesson").then((r) => r.json()),
        fetch("https://sql-server-nb7m.onrender.com/api/plan/active").then((r) => r.json()),
      ]);
      const uniquePlanIds = [...new Set(planRes.map((p) => p.plan_id))];
      const topicResults = await Promise.all(uniquePlanIds.map((id) =>
          fetch(`https://sql-server-nb7m.onrender.com/api/teacher/plan/topics/${id}`).then((r) => r.json())
      ));
      const topicsObj = {};
      uniquePlanIds.forEach((id, i) => { topicsObj[id] = topicResults[i]; });
      setTopicsMap(topicsObj);
      const filteredLessons = lessonRes.filter((l) => {
        if (userInfo.role === "teacher") {
          const teacherGroups = userInfo.className ? userInfo.className.split(",").map((g) => g.trim().toLowerCase()) : [];
          return teacherGroups.includes(l.name?.trim().toLowerCase());
        }
        if (userInfo.role === "student") return classesArray.includes(l.name);
        return true;
      });
      setEvents(formatLessons(filteredLessons, planRes, start, end));
    } catch { toast.error("Error loading schedule"); }
  }, [userInfo, classesArray, formatLessons]);

  useEffect(() => {
    const start = moment().startOf(view).subtract(1, "month").toDate();
    const end = moment().endOf(view).add(1, "month").toDate();
    fetchData(start, end);
  }, [view, fetchData]);

  return (
    <div className="h-full relative font-sans text-slate-900 p-2 lg:p-6 bg-slate-50/50">
      {/* Custom Global Style Override */}
      <style jsx global>{`
        .rbc-calendar { background: transparent !important; border: none !important; }
        .rbc-time-view, .rbc-month-view { border: none !important; border-radius: 2rem !important; overflow: hidden; background: white; box-shadow: 0 10px 30px -10px rgba(0,0,0,0.05); }
        .rbc-header { padding: 15px !important; border-bottom: 1px solid #f1f5f9 !important; font-weight: 800 !important; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; font-size: 11px; }
        .rbc-time-header-content { border-left: 1px solid #f1f5f9 !important; }
        .rbc-timeslot-group { border-bottom: 1px solid #f8fafc !important; min-height: 60px !important; }
        .rbc-day-slot .rbc-events-container { margin-right: 10px !important; }
        .rbc-today { background-color: #f5f3ff !important; }
      `}</style>

      <Calendar
        localizer={localizer}
        events={events}
        view={view}
        onView={setView}
        onSelectEvent={setSelectedEvent}
        eventPropGetter={eventPropGetter}
        min={new Date(0, 0, 0, 8, 0)}
        max={new Date(0, 0, 0, 19, 0)}
        components={{ event: EventComponent, toolbar: CustomToolbar }}
      />

      {/* --- NEW DESIGNED TOPIC MODAL --- */}
      {selectedEvent && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity animate-in fade-in duration-300" 
            onClick={() => setSelectedEvent(null)} 
          />
          <div className="relative bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300 border border-slate-100">
            {/* Modal Header */}
            <div className={`p-8 pb-12 text-white relative ${selectedEvent.plan_id ? "bg-indigo-600" : "bg-slate-500"}`}>
              <button 
                onClick={() => setSelectedEvent(null)}
                className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-all"
              >
                <FaTimes size={16} />
              </button>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 bg-white/20 rounded-full text-[10px] font-black uppercase tracking-widest">
                  {selectedEvent.group}
                </span>
                <span className="px-3 py-1 bg-white/20 rounded-full text-[10px] font-black uppercase tracking-widest">
                  Lesson #{selectedEvent.lessonOrder}
                </span>
              </div>
              <h2 className="text-3xl font-black text-black tracking-tight leading-tight uppercase italic">
                {selectedEvent.title}
              </h2>
            </div>

            {/* Modal Content */}
            <div className="p-8 -mt-8 bg-white rounded-t-[2.5rem] relative space-y-6">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-indigo-600 mb-2">
                  <FaBookOpen size={16} />
                  <span className="font-black text-[11px] uppercase tracking-tighter">Planned Topic</span>
                </div>
                <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100/80 shadow-inner">
                  <p className="text-slate-700 font-bold text-lg leading-snug">
                    {topicsMap[selectedEvent.plan_id]?.find(
                      (t) => t.order_index === selectedEvent.lessonOrder
                    )?.title || "No topic assigned for this session."}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-amber-600 mb-2">
                  <FaHome size={16} />
                  <span className="font-black text-[11px] uppercase tracking-tighter">Homework / Tasks</span>
                </div>
                <div className="p-5 bg-amber-50 rounded-3xl border border-amber-100/80">
                  <p className="text-amber-900/80 text-sm font-medium leading-relaxed">
                    {selectedEvent.homework_text || "No homework assigned."}
                  </p>
                </div>
              </div>

              <button
                className={`w-full py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition-all active:scale-95 shadow-lg ${
                    selectedEvent.plan_id ? "bg-indigo-600 text-white shadow-indigo-200" : "bg-slate-800 text-white"
                }`}
                onClick={() => setSelectedEvent(null)}
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default React.memo(BigCalendar);