import React, { useEffect, useState } from "react";
import service from "../../services/index.services";
import { useNavigate, Link } from "react-router-dom";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import {
  Menu,
  ArrowLeft,
  Plus,
  UserCog,
  Pencil,
  Trash2,
  Route,
  Flame,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

function getDailyChartData(activities) {
  const today = new Date().toISOString().slice(0, 10);

  const todaysActivities = activities.filter((activity) => {
    return activity.date && activity.date.slice(0, 10) === today;
  });

  const totalDistance = todaysActivities.reduce((sum, activity) => {
    return sum + (Number(activity.distance) || 0);
  }, 0);

  const totalCaloriesBurnedToday = todaysActivities.reduce((sum, activity) => {
    return sum + (Number(activity.caloriesBurned) || 0);
  }, 0);

  const weekdayName = new Date().toLocaleDateString("en", { weekday: "short" });

  return {
    activityChartData: {
      labels: [[weekdayName, today]],
      datasets: [
        {
          label: "Distance (km)",
          data: [totalDistance],
          backgroundColor: "#36A2EB",
          maxBarThickness: 70,
        },
      ],
    },
    totalCaloriesBurnedThisWeek: totalCaloriesBurnedToday,
  };
}

function getWeeklyChartData(activities, weekFilter) {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const monday = new Date(now);
  monday.setDate(now.getDate() - daysSinceMonday - weekFilter * 7);
  const mondayString = monday.toISOString().slice(0, 10);

  // get the current week (end)
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  const sundayString = sunday.toISOString().slice(0, 10);

  const currentWeekActivities = activities.filter((activity) => {
    return (
      activity.date &&
      activity.date.slice(0, 10) >= mondayString &&
      activity.date.slice(0, 10) <= sundayString
    );
  });

  const weekDates = [0, 1, 2, 3, 4, 5, 6].map((i) => {
    const currentDay = new Date(monday);
    currentDay.setDate(monday.getDate() + i);
    const dateString = currentDay.toISOString().slice(0, 10);
    const weekDayName = currentDay.toLocaleDateString("en", {
      weekday: "short",
    });
    return [weekDayName, dateString];
  });

  const distances = weekDates.map((dateEntry) => {
    const dateString = dateEntry[1];
    let total = 0;

    currentWeekActivities.forEach((activity) => {
      if (activity.date.slice(0, 10) === dateString) {
        total += Number(activity.distance) || 0;
      }
    });
    return total;
  });

  const totalCaloriesBurnedThisWeek = currentWeekActivities.reduce(
    (acc, activity) => {
      return acc + (Number(activity.caloriesBurned) || 0);
    },
    0,
  );

  const activityChartData = {
    labels: weekDates,
    datasets: [
      {
        label: "Distance (km)",
        data: distances,
        backgroundColor: "#36A2EB",
        maxBarThickness: 40,
      },
    ],
  };

  return { activityChartData, totalCaloriesBurnedThisWeek };
}

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      labels: {
        color: "#FFFFFF", // Makes legend text white if enabled
      },
    },
  },
  scales: {
    x: {
      ticks: {
        color: "#FFFFFF", // Makes X-axis labels (days/dates) white
      },
      grid: {
        color: "rgba(255, 255, 255, 0.1)", // Optional: lighter grid lines for dark mode
      },
    },
    y: {
      ticks: {
        color: "#FFFFFF", // Makes Y-axis numbers white
      },
      grid: {
        color: "rgba(255, 255, 255, 0.1)",
      },
    },
  },
};

function ActivityPage() {
  const navigate = useNavigate();

  const [showForm, setShowForm] = useState(false);
  const [viewMode, setViewMode] = useState("weekly");
  const [weekFilter, setWeekFilter] = useState(0);
  const [activities, setActivities] = useState([]);
  const [title, setTitle] = useState("");
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [caloriesBurned, setCaloriesBurned] = useState("");
  const [date, setDate] = useState("");
  const [activityId, setActivityId] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleDurationChange = (e) => setDuration(e.target.value);
  const handleDistanceChange = (e) => setDistance(e.target.value);
  const handleCaloriesBurnedChange = (e) => setCaloriesBurned(e.target.value);
  const handleDateChange = (e) => setDate(e.target.value);
  const handleViewModeChange = (e) => setViewMode(e.target.value);

  const { activityChartData, totalCaloriesBurnedThisWeek } =
    viewMode === "daily"
      ? getDailyChartData(activities)
      : getWeeklyChartData(activities, weekFilter);

  const totalDistanceFilter = activityChartData.datasets[0].data.reduce(
    (sum, dailyDistance) => {
      return sum + dailyDistance;
    },
    0,
  );

  const handleUpdateButton = async (e) => {
    e.preventDefault();

    const body = {
      title,
      duration,
      distance,
      caloriesBurned,
      date,
    };
    const response = await service.put(`/activities/${activityId}`, body);
    setActivities(
      activities.map((activity) => {
        if (activity._id === activityId) {
          return response.data;
        } else {
          return activity;
        }
      }),
    );
    setActivityId(null);
    setTitle("");
    setDistance("");
    setDuration("");
    setCaloriesBurned("");
    setDate("");
  };

  const handleEditButton = (activity) => {
    setTitle(activity.title);
    setDistance(activity.distance);
    setDuration(activity.duration);
    setCaloriesBurned(activity.caloriesBurned);
    setActivityId(activity._id);
    setDate(activity.date ? activity.date.slice(0, 10) : "");
      setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (distance < 0 || duration < 0 || caloriesBurned < 0) {
      alert("Please fill in all fields with valid numbers");
      return;
    }
    if (!title) {
      alert("Please add a title to the activity");
      return;
    }

    const body = {
      title,
      distance,
      duration,
      caloriesBurned,
      date,
    };
    try {
      const response = await service.post("/activities", body);
      setActivities([...activities, response.data]);
      setTitle("");
      setDistance("");
      setDuration("");
      setCaloriesBurned("");
      setDate("");
    } catch (error) {
      console.log(error);
        if (error.response?.status === 400) {
    setErrorMessage(error.response?.data?.message || "Something went wrong");
      } else {
        navigate("/error");
      }
    }
  };

  const handleDeleteButton = async (Id) => {
    try {
    await service.delete(`/activities/${Id}`);
    setActivities(
      activities.filter((activity) => {
        return activity._id !== Id;
      }),
    );
  } catch (error) {
    console.log(error);
    setErrorMessage("Could not delete activity");
  } ;
}
  useEffect(() => {
    service
      .get("/activities")
      .then((response) => {
        setActivities(response.data);
      })
      .catch((error) => {
        console.log(error);
        setErrorMessage("Could not load activities");
      });
  }, []);

return (
  <div className="relative min-h-screen bg-[#14161B] text-[#F3F1ED] overflow-hidden">
    <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#FF5A36]/10 via-transparent to-[#4FA8FF]/10" />
    <div className="pointer-events-none absolute -top-32 -left-32 h-[32rem] w-[32rem] rounded-full bg-[#FF5A36] opacity-30 blur-[150px]" />
    <div className="pointer-events-none absolute top-1/4 -right-40 h-[34rem] w-[34rem] rounded-full bg-[#4FA8FF] opacity-25 blur-[150px]" />
    <div className="pointer-events-none absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-[#33C97A] opacity-20 blur-[140px]" />
    <div className="pointer-events-none absolute bottom-1/4 right-1/4 h-72 w-72 rounded-full bg-[#FFC94F] opacity-[0.15] blur-[130px]" />

    <div className="relative max-w-5xl mx-auto px-6 py-16 space-y-14">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button type="button" className="text-[#A6ABB2] hover:text-[#F3F1ED] transition-colors">
          <Menu className="w-6 h-6" />
        </button>
        <div className="text-right">
          <h1 className="text-4xl font-['Archivo_Black'] tracking-wide">ACTIVITY</h1>
          <p className="mt-1 text-xs uppercase tracking-[0.2em] text-[#A6ABB2]">Weekly training log</p>
        </div>
      </div>

      {/* Button row */}
      <div className="flex flex-wrap items-center gap-4 mt-4 mb-2">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 rounded-full border-2 border-[#3A3D42] px-5 py-2 text-sm font-bold text-[#A6ABB2] hover:text-[#F3F1ED] hover:border-[#F3F1ED] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-2 rounded-full bg-[#FF5A36] px-5 py-2 text-sm font-bold text-white shadow-[0_0_30px_-4px_#FF5A36] hover:bg-[#ff7355] hover:shadow-[0_0_36px_-2px_#FF5A36] transition-all"
        >
          <Plus className="w-4 h-4" />
          {showForm ? "Close Form" : "Log New Run"}
        </button>
        <Link
          to="/private/user"
          className="flex items-center gap-2 rounded-full border-2 border-[#4FA8FF]/60 px-5 py-2 text-sm font-bold text-[#4FA8FF] hover:bg-[#4FA8FF] hover:text-[#0F1115] transition-colors"
        >
          <UserCog className="w-4 h-4" />
          Edit Profile
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
        <div className="md:col-span-3 rounded-3xl border-2 border-[#FF5A36]/50 bg-[#262A33]/80 backdrop-blur-sm p-7 flex items-center gap-5 shadow-[0_0_40px_-12px_#FF5A36] md:-translate-y-3">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#FF5A36]/15">
            <Route className="w-6 h-6 text-[#FF5A36]" />
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-widest text-[#A6ABB2] font-semibold">Total Distance</h4>
            <p className="text-4xl font-['Archivo_Black'] text-[#FF5A36]">{totalDistanceFilter} km</p>
          </div>
        </div>

        <div className="md:col-span-2 rounded-3xl border-2 border-[#FFC94F]/50 bg-[#262A33]/80 backdrop-blur-sm p-7 flex items-center gap-4 shadow-[0_0_40px_-12px_#FFC94F] md:translate-y-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#FFC94F]/15">
            <Flame className="w-5 h-5 text-[#FFC94F]" />
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-widest text-[#A6ABB2] font-semibold">Calories</h4>
            <p className="text-2xl font-['Archivo_Black'] text-[#FFC94F]">{totalCaloriesBurnedThisWeek} kcal</p>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="rounded-3xl border-2 border-[#3A3D42] bg-[#262A33]/80 backdrop-blur-sm p-8 md:p-10">
        <div className="flex flex-col md:flex-row gap-12">
          <div className="md:w-[62%]">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-bold uppercase tracking-widest text-[#A6ABB2]">Distance</h2>
              <select
                className="border-2 border-[#3A3D42] px-3 py-1.5 text-sm rounded-full bg-[#1B1E24] text-[#F3F1ED] focus:outline-none focus:border-[#FF5A36]"
                value={viewMode}
                onChange={handleViewModeChange}
              >
                <option value="weekly">Weekly</option>
                <option value="daily">Daily</option>
              </select>
            </div>
            <div className="h-72">
              <Bar data={activityChartData} options={chartOptions} />
            </div>
          </div>

          <div className="md:w-[38%] flex flex-col justify-center gap-4 md:pl-6 md:border-l-2 md:border-[#3A3D42]">
            <p className="text-sm text-[#A6ABB2] leading-relaxed">
              {viewMode === "weekly"
                ? "This week's totals, broken out by day."
                : "Today's totals so far."}
            </p>
            {viewMode === "weekly" && (
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  className="flex items-center justify-center gap-1.5 rounded-full border-2 border-[#3A3D42] px-4 py-2 text-m font-bold hover:border-[#FF5A36] hover:text-[#FF5A36] transition-colors"
                  onClick={() => setWeekFilter(weekFilter + 1)}
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  Previous Week
                </button>
                <button
                  type="button"
                  className="flex items-center justify-center gap-1.5 rounded-full border-2 border-[#3A3D42] px-4 py-2 text-m font-bold hover:border-[#FF5A36] hover:text-[#FF5A36] transition-colors"
                  onClick={() => setWeekFilter(weekFilter - 1)}
                >
                  Next Week
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <div className="rounded-3xl border-2 border-[#3A3D42] bg-[#262A33]/80 backdrop-blur-sm p-8 md:p-10 space-y-6">
          <div className="text-base font-bold">{activityId ? "Edit Activity" : "Log Activity"}</div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="md:w-3/4">
              <label className="block text-xs uppercase tracking-widest mb-1 text-[#A6ABB2] font-semibold">Title</label>
              <input
                className="w-full p-2.5 text-sm rounded-lg bg-[#1B1E24] border-2 border-[#3A3D42] focus:outline-none focus:border-[#FF5A36]"
                type="text" name="title" value={title} onChange={handleTitleChange}
              />
            </div>

            <div className="flex flex-col md:flex-row gap-5">
              <div className="md:w-1/3">
                <label className="block text-xs uppercase tracking-widest mb-1 text-[#A6ABB2] font-semibold">Date</label>
                <input
                  className="w-full p-2.5 text-sm rounded-lg bg-[#1B1E24] border-2 border-[#3A3D42] focus:outline-none focus:border-[#FF5A36]"
                  type="date" name="date" value={date} onChange={handleDateChange}
                />
              </div>
              <div className="md:w-1/4">
                <label className="block text-xs uppercase tracking-widest mb-1 text-[#A6ABB2] font-semibold">Distance</label>
                <input
                  className="w-full p-2.5 text-sm rounded-lg bg-[#1B1E24] border-2 border-[#3A3D42] focus:outline-none focus:border-[#FF5A36]"
                  type="number" name="distance" value={distance} onChange={handleDistanceChange}
                />
              </div>
              <div className="md:w-1/4 md:mt-4">
                <label className="block text-xs uppercase tracking-widest mb-1 text-[#A6ABB2] font-semibold">Duration</label>
                <input
                  className="w-full p-2.5 text-sm rounded-lg bg-[#1B1E24] border-2 border-[#3A3D42] focus:outline-none focus:border-[#FF5A36]"
                  type="number" name="duration" value={duration} onChange={handleDurationChange}
                />
              </div>
            </div>

            <div className="md:w-2/3">
              <label className="block text-xs uppercase tracking-widest mb-1 text-[#A6ABB2] font-semibold">Burned Calories</label>
              <input
                className="w-full p-2.5 text-sm rounded-lg bg-[#1B1E24] border-2 border-[#3A3D42] focus:outline-none focus:border-[#FFC94F]"
                type="number" name="caloriesBurned" value={caloriesBurned} onChange={handleCaloriesBurnedChange}
              />
            </div>

            {errorMessage && <p className="text-sm text-[#FFC94F]">{errorMessage}</p>}

            <div className="pt-1">
              {activityId ? (
                <button
                  className="bg-[#FF5A36] text-white px-6 py-2.5 text-sm font-bold rounded-full shadow-[0_0_20px_-4px_#FF5A36] hover:bg-[#ff7355] transition-colors"
                  type="button" onClick={handleUpdateButton}
                >
                  Update
                </button>
              ) : (
                <button
                  className="bg-[#FF5A36] text-white px-6 py-2.5 text-sm font-bold rounded-full shadow-[0_0_20px_-4px_#FF5A36] hover:bg-[#ff7355] transition-colors"
                  type="submit"
                >
                  Save
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {/* Running History */}
      <div className="space-y-4">
        <h2 className="text-lg font-['Archivo_Black'] tracking-wide">Running History</h2>

        {activities.length === 0 && (
          <p className="text-sm text-[#6E7277]">No activities logged yet — add your first run above.</p>
        )}

        <div className="space-y-4">
          {activities.map((activity) => (
            <div
              key={activity._id}
              className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 rounded-2xl border-2 border-[#3A3D42] bg-[#262A33]/80 backdrop-blur-sm p-5 hover:border-[#FF5A36]/50 transition-colors"
            >
              <div className="sm:w-28 shrink-0">
                <p className="text-xs text-[#6E7277] uppercase tracking-widest">
                  {activity.date ? activity.date.slice(0, 10).split("-").reverse().join(".") : ""}
                </p>
                <p className="font-medium">{activity.title}</p>
              </div>

              <div className="flex flex-wrap gap-4 flex-1">
                <span className="text-sm text-[#FF5A36] font-semibold">{activity.distance} km</span>
                <span className="text-sm text-[#A6ABB2]">{activity.duration} mins</span>
                <span className="text-sm text-[#FFC94F] font-semibold">{activity.caloriesBurned} kcal</span>
              </div>

              <div className="flex items-center gap-4 sm:ml-auto">
                <button
                  className="flex items-center gap-1 text-xs font-semibold text-[#4FA8FF] hover:text-[#7cc0ff] transition-colors"
                  onClick={() => handleEditButton(activity)}
                >
                  <Pencil className="w-3.5 h-3.5" />
                  Edit
                </button>
                <button
                  className="flex items-center gap-1 text-xs font-semibold text-[#FF5A36] hover:text-[#ff8266] transition-colors"
                  onClick={() => handleDeleteButton(activity._id)}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);
}

export default ActivityPage;
