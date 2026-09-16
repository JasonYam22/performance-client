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
        color: "#FFFFFF" // Makes legend text white if enabled
      }
    }
  },
  scales: {
    x: {
      ticks: {
        color: "#FFFFFF" // Makes X-axis labels (days/dates) white
      },
      grid: {
        color: "rgba(255, 255, 255, 0.1)" // Optional: lighter grid lines for dark mode
      }
    },
    y: {
      ticks: {
        color: "#FFFFFF" // Makes Y-axis numbers white
      },
      grid: {
        color: "rgba(255, 255, 255, 0.1)"
      }
    }
  }
};

function ActivityPage() {
  const navigate = useNavigate();

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
      if (error.status && error.response.status === 400) {
        setErrorMessage(error.response.data.errorMessage);
      } else {
        navigate("/error");
      }
    }
  };
  const handleDeleteButton = async (Id) => {
    await service.delete(`/activities/${Id}`);
    setActivities(
      activities.filter((activity) => {
        return activity._id !== Id;
      }),
    );
  };

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
    <div className="bg-gray-900 text-[#1E293B] min-h-screen">
      <div className="max-w-5xl mx-auto p-6 space-y-8">
        <div className="flex items-center justify-between border-b border-[#FFFFFF]/30 pb-4">
          <button
            className="text-2xl font-bold tracking-wider text-[#2563EB] hover:text-[#1E293B] transition-colors"
            type="button"
            onClick={() => navigate(-1)}>Back</button>
          <h1 className="text-2xl font-bold tracking-wider">ACTIVITY</h1>
        </div>

        {/* Metric Summary Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-[#FFFFFF]/30 p-4 rounded space-y-1">
            <h4 className="text-xs uppercase tracking-wide text-[#FFFFFF]">
              Total Distance
            </h4>
            <p className="text-xl font-semibold text-[#2563EB]">
              {totalDistanceFilter} km
            </p>
          </div>
          <div className="border border-[#FFFFFF]/30 p-4 rounded space-y-1">
            <h4 className="text-xs uppercase tracking-wide text-[#FFFFFF]">
              Calories Burned
            </h4>
            <p className="text-xl font-semibold text-[#F59E0B]">
              {totalCaloriesBurnedThisWeek} kcal
            </p>
          </div>
        </div>

        {/* Chart Section Box */}
        <div className="border border-[#FFFFFF]/30 p-6 rounded space-y-4">
          <div className="flex justify-between items-start">
            <div className="text-sm font-semibold uppercase tracking-wider text-[#1E293B]">
              Distance
            </div>
            <select
              className="border border-[#FFFFFF]/40 px-2 py-1 text-sm rounded bg-[#FFFFFF] text-[#1E293B]"
              value={viewMode}
              onChange={handleViewModeChange}
            >
              <option value="weekly">Weekly</option>
              <option value="daily">Daily</option>
            </select>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 min-w-0 border border-[#FFFFFF]/30 rounded p-4 h-80 md:h-96 lg:h-[30rem]">
              <Bar data={activityChartData} options={chartOptions} />
            </div>

            <div className="w-full lg:w-52 shrink-0 border border-[#FFFFFF]/30 rounded p-4 space-y-2 self-start">
              <h4 className="text-xs uppercase tracking-wide text-[#FFFFFF]">
                Legend
              </h4>
              <div className="flex items-center gap-2">
                <span className="inline-block w-3 h-3 rounded-sm bg-[#2563EB]" />
                <span className="text-xs">Distance (km)</span>
              </div>
            </div>
          </div>

          {viewMode === "weekly" && (
            <div className="flex justify-center space-x-4">
              <button
                type="button"
                className="border border-[#FFFFFF]/40 px-3 py-1 text-xs rounded text-[#2563EB] hover:bg-[#2563EB]/10 transition-colors"
                onClick={() => setWeekFilter(weekFilter + 1)}
              >
                Previous Week
              </button>
              <button
                type="button"
                className="border border-[#FFFFFF]/40 px-3 py-1 text-xs rounded text-[#2563EB] hover:bg-[#2563EB]/10 transition-colors"
                onClick={() => setWeekFilter(weekFilter - 1)}
              >
                Next Week
              </button>
            </div>
          )}
        </div>

        {/* Form Section Container */}
        <div className="border border-[#FFFFFF]/30 p-6 rounded space-y-4">
          <div className="text-base font-bold">
            {activityId ? "Edit Activity" : "Log Activity"}
          </div>

          <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-xs uppercase tracking-wide mb-1 text-[#FFFFFF]">
                  Title
                </label>
                <input
                  className="border border-[#FFFFFF]/40 w-full p-2 text-sm rounded bg-[#FFFFFF] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/40 focus:border-[#2563EB]"
                  type="text"
                  name="title"
                  value={title}
                  onChange={handleTitleChange}
                />
              </div>
              <div className="space-y-1">
                <label className="block text-xs uppercase tracking-wide mb-1 text-[#FFFFFF]">
                  Date:
                </label>
                <input
                  className="border border-[#FFFFFF]/40 w-full p-2 text-sm rounded bg-[#FFFFFF] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/40 focus:border-[#2563EB]"
                  type="date"
                  name="date"
                  placeholder="Date"
                  value={date}
                  onChange={handleDateChange}
                />
              </div>
              <div className="space-y-1">
                <label className="block text-xs uppercase tracking-wide mb-1 text-[#FFFFFF]">
                  Distance:
                </label>
                <input
                  className="border border-[#FFFFFF]/40 w-full p-2 text-sm rounded bg-[#FFFFFF] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/40 focus:border-[#2563EB]"
                  type="number"
                  name="distance"
                  value={distance}
                  onChange={handleDistanceChange}
                />
              </div>
              <div className="space-y-1">
                <label className="block text-xs uppercase tracking-wide mb-1 text-[#FFFFFF]">
                  Duration
                </label>
                <input
                  className="border border-[#FFFFFF]/40 w-full p-2 text-sm rounded bg-[#FFFFFF] focus:outline-none focus:ring-2 focus:ring-[#2563EB]/40 focus:border-[#2563EB]"
                  type="number"
                  name="duration"
                  value={duration}
                  onChange={handleDurationChange}
                />
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="block text-xs uppercase tracking-wide mb-1 text-[#FFFFFF]">
                  Burned Calories
                </label>
                <input
                  className="border border-[#FFFFFF]/40 w-full p-2 text-sm rounded bg-[#FFFFFF] focus:outline-none focus:ring-2 focus:ring-[#F59E0B]/40 focus:border-[#F59E0B]"
                  type="number"
                  name="caloriesBurned"
                  value={caloriesBurned}
                  onChange={handleCaloriesBurnedChange}
                />
              </div>
            </div>

            {errorMessage && (
              <p className="text-sm text-[#F59E0B]">{errorMessage}</p>
            )}

            <div className="flex space-x-4 pt-2">
              {activityId ? (
                <button
                  className="bg-[#2563EB] text-white px-4 py-2 text-sm font-medium rounded hover:bg-[#1D4ED8] transition-colors"
                  type="button"
                  onClick={handleUpdateButton}
                >
                  Update
                </button>
              ) : (
                <button
                  className="bg-[#2563EB] text-white px-4 py-2 text-sm font-medium rounded hover:bg-[#1D4ED8] transition-colors"
                  type="submit"
                >
                  Save
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Running History Table Container */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold tracking-wide">Running History</h2>

          <div className="overflow-x-auto border border-[#FFFFFF]/30 rounded">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#FFFFFF]/30 bg-[#1E293B]/5">
                  <th className="p-3 text-xs uppercase tracking-wider border-r border-[#FFFFFF]/20 text-[#FFFFFF]">
                    Date
                  </th>
                  <th className="p-3 text-xs uppercase tracking-wider border-r border-[#FFFFFF]/20 text-[#FFFFFF]">
                    Title
                  </th>
                  <th className="p-3 text-xs uppercase tracking-wider border-r border-[#FFFFFF]/20 text-[#FFFFFF]">
                    Distance
                  </th>
                  <th className="p-3 text-xs uppercase tracking-wider border-r border-[#FFFFFF]/20 text-[#FFFFFF]">
                    Duration
                  </th>
                  <th className="p-3 text-xs uppercase tracking-wider border-r border-[#FFFFFF]/20 text-[#FFFFFF]">
                    Calories
                  </th>
                  <th className="p-3 text-xs uppercase tracking-wider text-[#FFFFFF]"></th>
                </tr>
              </thead>
              <tbody>
                {activities.map((activity) => (
                  <tr
                    className="border-b border-[#FFFFFF]/20 hover:bg-[#2563EB]/5 transition-colors"
                    key={activity._id}
                  >
                    <td className="p-3 text-sm border-r border-[#FFFFFF]/20">
                      {activity.date
                        ? activity.date
                            .slice(0, 10)
                            .split("-")
                            .reverse()
                            .join(".")
                        : ""}
                    </td>
                    <td className="p-3 text-sm border-r border-[#FFFFFF]/20">
                      {activity.title}
                    </td>
                    <td className="p-3 text-sm border-r border-[#FFFFFF]/20 text-[#2563EB]">
                      {activity.distance} km
                    </td>
                    <td className="p-3 text-sm border-r border-[#FFFFFF]/20">
                      {activity.duration} mins
                    </td>
                    <td className="p-3 text-sm border-r border-[#FFFFFF]/20 text-[#F59E0B]">
                      {activity.caloriesBurned} kcal
                    </td>
                    <td className="p-3 text-sm space-x-2">
                      <button
                        className="underline text-xs text-[#2563EB] hover:text-[#1E293B]"
                        onClick={() => handleEditButton(activity)}
                      >
                        Edit
                      </button>
                      <button
                        className="underline text-xs text-[#F59E0B] hover:text-[#B45309]"
                        onClick={() => handleDeleteButton(activity._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ActivityPage;
