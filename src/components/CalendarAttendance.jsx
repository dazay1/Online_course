import { useState } from "react"
import {
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  format,
  isSameMonth,
  isSunday
} from "date-fns"

const attendance = {
  "2026-07-01": "present",
  "2026-07-03": "present",
  "2026-07-05": "present",
  "2026-07-10": "present",
  "2026-07-26": "absent",
  "2026-07-29": "absent"
}

export default function AttendanceCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(monthStart)
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 })
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 })

  const rows = []
  let days = []
  let day = startDate

  while (day <= endDate) {
    for (let i = 0; i < 7; i++) {
      const formattedDate = format(day, "yyyy-MM-dd")
      const status = attendance[formattedDate]

      days.push(
        <div
          key={day}
          className={`
            h-20 border rounded-md p-2 relative
            ${!isSameMonth(day, monthStart) && "text-gray-300"}
            ${isSunday(day) && "bg-red-50"}
            ${status === "present" && "bg-cyan-50"}
            ${status === "absent" && "bg-red-50"}
          `}
        >
          {/* DATE NUMBER */}
          <span
            className={`
              absolute top-2 right-2 text-sm font-semibold
              ${isSunday(day) ? "text-red-500" : "text-blue-900"}
            `}
          >
            {format(day, "d")}
          </span>

          {/* ATTENDANCE */}
          {status && (
            <div className="mt-8 text-sm">
              <span
                className={`
                  inline-flex items-center gap-2 px-2 py-1 rounded-md
                  ${status === "present"
                    ? "text-cyan-600 bg-cyan-100"
                    : "text-red-500 bg-red-100"}
                `}
              >
                ● {status === "present" ? "Bor edi" : "Yo‘q edi"}
              </span>
            </div>
          )}
        </div>
      )

      day = addDays(day, 1)
    }

    rows.push(
      <div key={day} className="grid grid-cols-7 gap-2">
        {days}
      </div>
    )
    days = []
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-xl w-[900px]">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-blue-900">
          Davomat
        </h2>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="border rounded-lg p-2 hover:bg-gray-100"
          >
            ‹
          </button>

          <span className="font-medium">
            {format(currentMonth, "MMMM")}
          </span>

          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="border rounded-lg p-2 hover:bg-gray-100"
          >
            ›
          </button>
        </div>
      </div>

      {/* WEEK DAYS */}
      <div className="grid grid-cols-7 text-center text-blue-900 font-medium mb-2">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(day => (
          <div key={day}>{day}</div>
        ))}
      </div>

      {/* DAYS */}
      <div className="flex flex-col gap-2">{rows}</div>
    </div>
  )
}
