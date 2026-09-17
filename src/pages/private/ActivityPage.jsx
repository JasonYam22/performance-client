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
  Activity,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Flame,
  Plus,
  Pencil,
  Route,
  Target,
  Trash2,
  UserCog,
  Scale,
  Dumbbell,
} from "lucide-react";
import LoadingSpinner from "../../components/LoadingSpinner";

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

  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
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
        setErrorMessage(
          error.response?.data?.message || "Something went wrong",
        );
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
    }
  };
  useEffect(() => {
    service
      .get("/activities")
      .then((response) => {
        setActivities(response.data);
        setIsLoading(false)
      })
      .catch((error) => {
        console.log(error);
        setErrorMessage("Could not load activities");
      });
  }, []);

  useEffect(() => {
    service
      .get("/users")
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const currentWeight = Number(user?.weight) || 0;
  const goalWeight = Number(user?.goalWeight) || 0;
  const weightDifference =
    currentWeight && goalWeight ? Math.abs(currentWeight - goalWeight) : 0;

  const startingWeight = Number(user?.weight) || 0;
  const weightToLose = Math.round(weightDifference * 10) / 10;
  const weightLost = 0;
  const weightProgress =
    weightToLose > 0 ? Math.min((weightLost / weightToLose) * 100, 100) : 0;

  const mondayNow = new Date();
  mondayNow.setDate(
    mondayNow.getDate() -
      (mondayNow.getDay() === 0 ? 6 : mondayNow.getDay() - 1),
  );
  const sundayNow = new Date(mondayNow);
  sundayNow.setDate(mondayNow.getDate() + 6);

  const workoutsThisWeek = activities.filter(
    (a) =>
      a.date &&
      a.date.slice(0, 10) >= mondayNow.toISOString().slice(0, 10) &&
      a.date.slice(0, 10) <= sundayNow.toISOString().slice(0, 10),
  ).length;

  const workoutGoal = user?.weeklyWorkoutGoal ?? null;
  const workoutProgressPercent = workoutGoal
    ? Math.min((workoutsThisWeek / workoutGoal) * 100, 100)
    : 0;

if (isLoading) {
  return <LoadingSpinner />;
}

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#15171B] text-[#F3F1ED]">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[32rem] w-[32rem] rounded-full bg-[#FF5A36]/20 blur-[140px]" />
        <div className="absolute -right-40 top-1/3 h-[34rem] w-[34rem] rounded-full bg-[#4FA8FF]/15 blur-[140px]" />
        <div className="absolute bottom-[-12rem] left-1/3 h-[32rem] w-[32rem] rounded-full bg-[#33C97A]/10 blur-[140px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-10 lg:px-10">
        {/* Header */}
        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#FF5A36]" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#A6ABB2]">
                Performance
              </span>
            </div>

            <h1 className="font-['Archivo_Black'] text-5xl tracking-tight md:text-6xl">
              ACTIVITY
            </h1>

            <p className="mt-3 text-sm text-[#A6ABB2]">
              Your training, tracked.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 rounded-full border-2 border-[#3A3D42] px-5 py-2.5 text-sm font-bold text-[#A6ABB2] transition-colors hover:border-[#F3F1ED] hover:text-[#F3F1ED]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>

            <button
              type="button"
              onClick={() => setShowForm((v) => !v)}
              className="flex items-center gap-2 rounded-full bg-[#FF5A36] px-5 py-2.5 text-sm font-bold text-white shadow-[0_0_30px_-6px_#FF5A36] transition-all hover:bg-[#ff7355]"
            >
              <Plus className="h-4 w-4" />
              {showForm ? "Close Form" : "Log New Run"}
            </button>

            <Link
              to="/private/user"
              className="flex items-center gap-2 rounded-full border-2 border-[#4FA8FF]/60 px-5 py-2.5 text-sm font-bold text-[#4FA8FF] transition-colors hover:bg-[#4FA8FF] hover:text-[#15171B]"
            >
              <UserCog className="h-4 w-4" />
              Edit Profile
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-5 md:grid-cols-2">
          {/* Distance */}
          <div className="group relative overflow-hidden rounded-3xl border-2 border-[#FF5A36]/50 bg-[#1D2025] p-7 transition-all hover:border-[#FF5A36]">
            <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-[#FF5A36]/10 blur-[70px]" />

            <div className="relative flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FF5A36]/10">
                <Route className="h-6 w-6 text-[#FF5A36]" />
              </div>

              <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#A6ABB2]">
                Distance
              </span>
            </div>

            <div className="relative mt-8">
              <p className="font-['Archivo_Black'] text-5xl text-[#FF5A36]">
                {totalDistanceFilter}
              </p>
              <p className="mt-2 text-xs font-bold uppercase tracking-[0.18em] text-[#A6ABB2]">
                kilometers
              </p>
            </div>
          </div>

          {/* Calories */}
          <div className="group relative overflow-hidden rounded-3xl border-2 border-[#FFC94F]/50 bg-[#1D2025] p-7 transition-all hover:border-[#FFC94F]">
            <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-[#FFC94F]/10 blur-[70px]" />

            <div className="relative flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFC94F]/10">
                <Flame className="h-6 w-6 text-[#FFC94F]" />
              </div>

              <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#A6ABB2]">
                Calories
              </span>
            </div>

            <div className="relative mt-8">
              <p className="font-['Archivo_Black'] text-5xl text-[#FFC94F]">
                {totalCaloriesBurnedThisWeek}
              </p>
              <p className="mt-2 text-xs font-bold uppercase tracking-[0.18em] text-[#A6ABB2]">
                kcal burned
              </p>
            </div>
          </div>
        </div>

        {/* Weight card */}
        {user && (
          <div className="mt-5 rounded-3xl border-2 border-[#33C97A]/50 bg-[#1D2025] p-7 transition-all hover:border-[#33C97A]">
            <div className="flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#33C97A]/10">
                <span className="text-xl font-bold text-[#33C97A]">kg</span>
              </div>

              <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#A6ABB2]">
                Weight Goal
              </span>
            </div>

            <div className="mt-8">
              <p className="font-['Archivo_Black'] text-5xl text-[#33C97A]">
                {user.weight != null ? user.weight : "—"} →{" "}
                {user.goalWeight != null ? user.goalWeight : "—"} kg
              </p>

              <p className="mt-2 text-xs font-bold uppercase tracking-[0.18em] text-[#A6ABB2]">
                Current → Goal
              </p>
            </div>

        {/* Weight goal remaining */}
      <div className="mt-6 flex justify-between text-xs font-semibold">
        <span className="text-[#A6ABB2] text-xl">Weight goal</span>
        <span className="text-[#33C97A] text-xl">{weightToLose} kg to go</span>
      </div>
    </div>
  )}

        {/* Workout goal */}
        {workoutGoal != null && (
          <div className="mt-5 rounded-3xl border-2 border-[#4FA8FF]/50 bg-[#1D2025] p-7 transition-all hover:border-[#4FA8FF]">
            <div className="flex items-start justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#4FA8FF]/10">
                <Dumbbell className="h-6 w-6 text-[#4FA8FF]" />
              </div>
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#A6ABB2]">
                Weekly Goal
              </span>
            </div>

            <div className="mt-8">
              <p className="font-['Archivo_Black'] text-5xl text-[#4FA8FF]">
                {workoutsThisWeek} / {workoutGoal}
              </p>
              <p className="mt-2 text-xs font-bold uppercase tracking-[0.18em] text-[#A6ABB2]">
                Workouts logged this week
              </p>
            </div>

            <div className="mt-6">
              <div className="h-2 overflow-hidden rounded-full bg-[#3A3D42]">
                <div
                  className="h-full rounded-full bg-[#4FA8FF]"
                  style={{ width: `${workoutProgressPercent}%` }}
                />
              </div>
              <div className="mt-3 flex justify-between text-xs font-semibold">
                <span className="text-[#A6ABB2] text-xl">Progress</span>
                <span className="text-[#4FA8FF] text-xl">
                  {workoutsThisWeek >= workoutGoal
                    ? "Goal reached!"
                    : `${workoutGoal - workoutsThisWeek} to go`}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Chart */}
        <div className="mt-8 rounded-3xl border-2 border-[#3A3D42] bg-[#1D2025] p-7 md:p-9">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#A6ABB2]">
                Training volume
              </p>

              <h2 className="mt-1 font-['Archivo_Black'] text-2xl">Distance</h2>
            </div>

            <select
              className="rounded-full border-2 border-[#3A3D42] bg-[#22252B] px-4 py-2 text-sm font-semibold text-[#F3F1ED] outline-none transition-colors focus:border-[#FF5A36]"
              value={viewMode}
              onChange={handleViewModeChange}
            >
              <option value="weekly">Weekly</option>
              <option value="daily">Daily</option>
            </select>
          </div>

          <div className="h-80">
            <Bar data={activityChartData} options={chartOptions} />
          </div>

          {viewMode === "weekly" && (
            <div className="mt-7 flex flex-wrap gap-3 border-t-2 border-[#3A3D42] pt-6">
              <button
                type="button"
                onClick={() => setWeekFilter(weekFilter + 1)}
                className="flex items-center gap-2 rounded-full border-2 border-[#3A3D42] px-5 py-2.5 text-sm font-bold text-[#A6ABB2] transition-colors hover:border-[#FF5A36] hover:text-[#FF5A36]"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous Week
              </button>

              <button
                type="button"
                onClick={() => setWeekFilter(weekFilter - 1)}
                className="flex items-center gap-2 rounded-full border-2 border-[#3A3D42] px-5 py-2.5 text-sm font-bold text-[#A6ABB2] transition-colors hover:border-[#FF5A36] hover:text-[#FF5A36]"
              >
                Next Week
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        {/* Form */}
        {showForm && (
          <div className="mt-8 rounded-3xl border-2 border-[#3A3D42] bg-[#1D2025] p-7 md:p-9">
            <div className="mb-7">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#A6ABB2]">
                Activity
              </p>

              <h2 className="mt-1 font-['Archivo_Black'] text-2xl">
                {activityId ? "Edit Activity" : "Log Activity"}
              </h2>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-[#A6ABB2]">
                  Title
                </label>

                <input
                  className="w-full rounded-2xl border-2 border-[#3A3D42] bg-[#22252B] p-3.5 text-sm text-[#F3F1ED] outline-none transition-colors focus:border-[#FF5A36]"
                  type="text"
                  name="title"
                  value={title}
                  onChange={handleTitleChange}
                />
              </div>

              <div className="grid gap-5 md:grid-cols-3">
                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-[#A6ABB2]">
                    Date
                  </label>

                  <input
                    className="w-full rounded-2xl border-2 border-[#3A3D42] bg-[#22252B] p-3.5 text-sm text-[#F3F1ED] outline-none focus:border-[#FF5A36]"
                    type="date"
                    name="date"
                    value={date}
                    onChange={handleDateChange}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-[#A6ABB2]">
                    Distance
                  </label>

                  <input
                    className="w-full rounded-2xl border-2 border-[#3A3D42] bg-[#22252B] p-3.5 text-sm text-[#F3F1ED] outline-none focus:border-[#FF5A36]"
                    type="number"
                    name="distance"
                    value={distance}
                    onChange={handleDistanceChange}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-[#A6ABB2]">
                    Duration
                  </label>

                  <input
                    className="w-full rounded-2xl border-2 border-[#3A3D42] bg-[#22252B] p-3.5 text-sm text-[#F3F1ED] outline-none focus:border-[#FF5A36]"
                    type="number"
                    name="duration"
                    value={duration}
                    onChange={handleDurationChange}
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-[#A6ABB2]">
                  Burned Calories
                </label>

                <input
                  className="w-full rounded-2xl border-2 border-[#3A3D42] bg-[#22252B] p-3.5 text-sm text-[#F3F1ED] outline-none focus:border-[#FFC94F]"
                  type="number"
                  name="caloriesBurned"
                  value={caloriesBurned}
                  onChange={handleCaloriesBurnedChange}
                />
              </div>

              {errorMessage && (
                <p className="text-sm font-semibold text-[#FFC94F]">
                  {errorMessage}
                </p>
              )}

              <div className="flex justify-end">
                {activityId ? (
                  <button
                    className="rounded-full bg-[#FF5A36] px-7 py-3 text-sm font-bold text-white shadow-[0_0_25px_-5px_#FF5A36] transition-all hover:bg-[#ff7355]"
                    type="button"
                    onClick={handleUpdateButton}
                  >
                    Update
                  </button>
                ) : (
                  <button
                    className="rounded-full bg-[#FF5A36] px-7 py-3 text-sm font-bold text-white shadow-[0_0_25px_-5px_#FF5A36] transition-all hover:bg-[#ff7355]"
                    type="submit"
                  >
                    Save Activity
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

        {/* History */}
        <div className="mt-12">
          <div className="mb-6">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#A6ABB2]">
              Your records
            </p>

            <h2 className="mt-1 font-['Archivo_Black'] text-3xl">
              Running History
            </h2>
          </div>

          {activities.length === 0 && (
            <div className="rounded-3xl border-2 border-dashed border-[#3A3D42] bg-[#1D2025] p-12 text-center">
              <Route className="mx-auto h-8 w-8 text-[#5A5F66]" />

              <p className="mt-4 text-sm text-[#A6ABB2]">
                No activities logged yet — add your first run above.
              </p>
            </div>
          )}

          <div className="space-y-3">
            {activities.map((activity) => (
              <div
                key={activity._id}
                className="group rounded-3xl border-2 border-[#3A3D42] bg-[#1D2025] p-5 transition-all hover:border-[#5A5F66]"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center">
                  <div className="flex items-center gap-4 lg:w-64">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#FF5A36]/10">
                      <Route className="h-5 w-5 text-[#FF5A36]" />
                    </div>

                    <div>
                      <p className="font-bold text-[#F3F1ED]">
                        {activity.title}
                      </p>

                      <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#6E7277]">
                        {activity.date
                          ? activity.date
                              .slice(0, 10)
                              .split("-")
                              .reverse()
                              .join(".")
                          : ""}
                      </p>
                    </div>
                  </div>

                  <div className="grid flex-1 grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.14em] text-[#6E7277]">
                        Distance
                      </p>
                      <p className="mt-1 font-bold text-[#FF5A36]">
                        {activity.distance} km
                      </p>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-[0.14em] text-[#6E7277]">
                        Duration
                      </p>
                      <p className="mt-1 font-bold text-[#F3F1ED]">
                        {activity.duration} mins
                      </p>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-[0.14em] text-[#6E7277]">
                        Calories
                      </p>
                      <p className="mt-1 font-bold text-[#FFC94F]">
                        {activity.caloriesBurned} kcal
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 lg:ml-auto">
                    <button
                      className="flex items-center gap-1.5 text-m font-bold text-[#4FA8FF] transition-colors hover:text-[#7cc0ff]"
                      onClick={() => handleEditButton(activity)}
                    >
                      <Pencil className="h-5.5 w-5.5" />
                      Edit
                    </button>

                    <button
                      className="flex items-center gap-1.5 text-m font-bold text-[#FF5A36] transition-colors hover:text-[#ff8266]"
                      onClick={() => handleDeleteButton(activity._id)}
                    >
                      <Trash2 className="h-5.5 w-5.5" />
                      Delete
                    </button>
                  </div>
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
