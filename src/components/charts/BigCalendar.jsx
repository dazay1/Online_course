"use client";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const localizer = momentLocalizer(moment);

function BigCalendar({ firstName, lastName }) {
  const { userInfo } = useSelector((state) => state.userLogin);
  const [lessonDate, setLessonDate] = useState([]);
  const [view, setView] = useState(Views.WEEK);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [popupPos, setPopupPos] = useState({ top: 0, left: 0 });
  const popupRef = useRef(null);
  const [newTheme, setNewTheme] = useState(""); // State for new theme input
  const [isEditing, setIsEditing] = useState(false);
  const [homeworkData, setHomeworkData] = useState([]);
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    const fetchLessonsAndHomework = async () => {
      try {
        const lessonResponse = await fetch(
          "https://sql-server-nb7m.onrender.com/api/lesson"
        );
        const homeworkResponse = await fetch(
          "https://sql-server-nb7m.onrender.com/api/homework"
        );
        const lessons = await lessonResponse.json();
        const homework = await homeworkResponse.json();

        // Filter lessons for the logged-in teacher
        if (userInfo.role === "teacher") {
          const teacherLessons = lessons.filter(
            (item) =>
              item.firstName === userInfo.firstName &&
              item.lastName === userInfo.lastName
          );
          setUserData(teacherLessons);
        } else if (userInfo.role === "admin") {
          const teacherLessons = lessons.filter(
            (item) => item.firstName === firstName && item.lastName === lastName
          );
          setUserData(teacherLessons);
        }
        const formattedLessons = userData.flatMap((lesson) => {
          const daysArray = lesson.day.split(", ").map((day) => day.trim());
          const events = [];

          const now = new Date();
          const year = now.getFullYear();
          const month = now.getMonth();

          const dayMap = {
            Mon: 1,
            Tue: 2,
            Wed: 3,
            Thurs: 4,
            Fri: 5,
            Sat: 6,
            Sun: 0,
          };

          daysArray.forEach((day) => {
            const dayNumber = dayMap[day];
            const startTimeParts = lesson.startTime.split(":");
            const endTimeParts = lesson.endTime.split(":");

            let date = new Date(year, month, 1);
            while (date.getDay() !== dayNumber) {
              date.setDate(date.getDate() + 1);
            }
            while (date.getMonth() === month) {
              const start = new Date(date);
              start.setHours(
                parseInt(startTimeParts[0]),
                parseInt(startTimeParts[1])
              );
              const end = new Date(date);
              end.setHours(
                parseInt(endTimeParts[0]),
                parseInt(endTimeParts[1])
              );

              // Find homework for the current date and group
              const homeworkForDate = homework.find((hw) => {
                const homeworkDate = new Date(hw.date); // Assuming hw.date is in ISO format
                return (
                  homeworkDate.toISOString().split("T")[0] ===
                  date.toISOString().split("T")[0]
                );
              });
              setHomeworkData(homework);

              const lessonDate = new Date(date);
              lessonDate.setDate(lessonDate.getDate() + 1); // Add one day
              const newLessonDate = lessonDate.toISOString().split("T")[0];
              events.push({
                id: `${lesson.subject}-${date.toISOString()}`,
                title: lesson.subject,
                start: start,
                end: end,
                group: lesson.name,
                theme: homeworkForDate ? homeworkForDate.theme : null, // Ensure theme is a string
                lessonDate: newLessonDate,
              });
              date.setDate(date.getDate() + 7);
            }
          });
          return events;
        });
        setLessonDate(formattedLessons);
      } catch (error) {
        toast.error("Server error please try again");
      }
    };
    fetchLessonsAndHomework();

    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setSelectedEvent(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [userInfo, firstName, lastName, userData]);

  const handleOnchangeView = (selectedView) => {
    setView(selectedView);
  };

  // Handle event click: show popup near clicked event
  const handleEventClick = (event, e) => {
    e.stopPropagation(); // Prevent calendar's onClick
    const rect = e.currentTarget.getBoundingClientRect();

    // Calculate popup position (adjust as needed)
    const top = rect.top + window.scrollY - 10; // 10px above event
    const left = rect.right + window.scrollX + 10; // 10px right of event

    setSelectedEvent(event);
    setPopupPos({ top, left });
  };

  // Close popup when clicking outside

  // Function to handle adding a new theme
  const handleAddTheme = async () => {
    if (selectedEvent) {
      const request = await fetch(
        "https://sql-server-nb7m.onrender.com/api/homework/create",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            group: selectedEvent.group,
            lessonDate: selectedEvent.lessonDate,
            theme: newTheme,
          }),
        }
      );
      const result = await request.json();
      const updatedEvents = lessonDate.map((event) => {
        if (event.id === selectedEvent.id) {
          return { ...event, theme: newTheme }; // Update the theme for the selected event
        }
        return event;
      });
      setLessonDate(updatedEvents);
      setNewTheme(""); // Clear the input
      setSelectedEvent(null); // Close the popup
      toast.success("Theme added successfully");
    }
  };
  const handleUpdate = async () => {
    if (selectedEvent) {
      const request = await fetch(
        "https://sql-server-nb7m.onrender.com/api/homework/update",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            group: selectedEvent.group,
            lessonDate: selectedEvent.lessonDate,
            theme: newTheme,
          }),
        }
      );
      const result = await request.json();
      const updatedEvents = lessonDate.map((event) => {
        if (event.id === selectedEvent.id) {
          return { ...event, theme: newTheme }; // Update the theme for the selected event
        }
        return event;
      });
      setLessonDate(updatedEvents);
      setNewTheme(""); // Clear the input
      setSelectedEvent(null); // Close the popup
      setIsEditing(false);
      toast.success("Theme updated successfully");
    }
  };
  const filteredHomework = homeworkData.filter((item) =>
    selectedEvent ? item.date === selectedEvent.lessonDate : false
  );
  const filter = filteredHomework ? filteredHomework[0] : null;
  return (
    <>
      <Calendar
        localizer={localizer}
        events={lessonDate}
        startAccessor="start"
        endAccessor="end"
        views={["month", "week", "day"]}
        view={view}
        style={{ height: "98%" }}
        onView={handleOnchangeView}
        min={new Date(2025, 1, 0, 8, 0, 0)}
        max={new Date(2025, 1, 0, 19, 0, 0)}
        toolbar={true}
        onSelectEvent={handleEventClick}
      />
      {selectedEvent && (
        <div
          ref={popupRef}
          style={{
            position: "absolute",
            top: popupPos.top,
            left: popupPos.left,
            background: "white",
            border: "1px solid #ccc",
            padding: "10px",
            borderRadius: "6px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            zIndex: 1000,
            width: "220px",
            fontSize: "14px",
          }}
        >
          <strong className="text-purple">{selectedEvent.title}</strong>
          <div>
            <b>Group:</b> {selectedEvent.group}
          </div>
          <div>
            <b>Topic of the lesson:</b>{" "}
            {isEditing === false ? (
              filter ? (
                <div className="flex justify-between items-center">
                  <span>{filter.theme}</span>
                  {userInfo.role === "student" ? null : (
                    <button
                      onClick={() => {
                        setIsEditing(true);
                        toast.success("Open the theme again to change value");
                      }}
                      style={{ marginLeft: "10px", cursor: "pointer" }}
                      className=" bg-lamaSky rounded-lg p-2"
                    >
                      Edit
                    </button>
                  )}
                </div>
              ) : filter === undefined ? (
                <>
                  <input
                    type="text"
                    value={newTheme}
                    onChange={(e) => setNewTheme(e.target.value)}
                    placeholder="Enter new theme"
                    style={{ width: "100%", marginTop: "5px" }}
                  />
                  <button
                    onClick={handleAddTheme}
                    style={{ marginTop: "5px", cursor: "pointer" }}
                  >
                    Add
                  </button>
                </>
              ) : null
            ) : (
              <>
                <input
                  type="text"
                  value={newTheme}
                  onChange={(e) => setNewTheme(e.target.value)}
                  placeholder={`${filter.theme}`}
                  style={{ width: "100%", marginTop: "5px" }}
                />
                <div>
                  <button
                    onClick={() => setIsEditing(false)}
                    style={{
                      marginTop: "5px",
                      cursor: "pointer",
                      background: "lamaPurple",
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdate}
                    style={{
                      marginTop: "5px",
                      cursor: "pointer",
                      background: "lamaYellow",
                    }}
                  >
                    Change
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default BigCalendar;
