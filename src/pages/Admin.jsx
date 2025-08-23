import {
  AttendanceChart,
  CountChart,
  EventCalendar,
  FinanceChart,
  LeftChart,
} from "../components";
import CountFinance from "../components/charts/CountFinance";
import CountPaid from "../components/charts/CountPaid";
import AdminLayout from "./layout";
function Admin() {
  return (
    <AdminLayout>
      <div className="p-4 flex gap-4 flex-col md:flex-row">
        {/* LEFT */}
        <div className="w-full lg:w-2/3 flex flex-col gap-8">
          {/* MIDDLE CHARTS */}
          <div className="flex gap-4 flex-col lg:flex-row">
            {/* COUNT CHART */}
            <div className="w-full lg:w-1/3 h-[450px]">
              <CountChart />
            </div>
            {/* ATTENDANCE CHART */}
            <div className="w-full lg:w-2/3 h-[450px]">
              <AttendanceChart />
            </div>
          </div>
          {/* BOTTOM CHARTS */}
          <div className="w-full h-[500px]">
            <FinanceChart />
          </div>
          <div className="w-full h-[500px]">
            <CountFinance />
          </div>
        </div>
        {/* RIGHT */}
        <div className="w-full lg:w-1/3 flex flex-col gap-8">
          <EventCalendar />
          <div className="w-full h-[400px]">
            <CountPaid />
          </div>
          {/* <Announcement /> */}
        </div>
      </div>
    </AdminLayout>
  );
}

export default Admin;
