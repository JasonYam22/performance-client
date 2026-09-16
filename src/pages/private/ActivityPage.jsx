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
      },
    ],
  };

  return { activityChartData, totalCaloriesBurnedThisWeek };
}

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
  <div className="p-6 space-y-6">
    <div className="flex items-center gap-4">
      <button className="px-3 py-1 text-sm" type="button" onClick={() => navigate(-1)}>Back</button>
      <h1 className="text-2xl font-bold">ACTIVITY</h1>
    </div>

    <div>
      <div className="flex gap-4">
        <h4 className="text-sm font-semibold">Total Distance</h4>
        <p>{totalDistanceFilter} km</p>
      </div>
      <div>
        <h4>Calories Burned</h4>
        <p>{totalCaloriesBurnedThisWeek} kcal</p>
      </div>
    </div>

    <select value={viewMode} onChange={handleViewModeChange}>
      <option value="weekly">Weekly</option>
      <option value="daily">Daily</option>
    </select>

    {viewMode === "weekly" && (
      <div className="flex">
        <button type="button" onClick={() => setWeekFilter(weekFilter + 1)}>Previous Week</button>
        <button type="button" onClick={() => setWeekFilter(weekFilter - 1)}>Next Week</button>
     </div>
    )}

    <Bar data={activityChartData} />

    <form className="flex flex-col" onSubmit={handleSubmit}>
      <label>Title</label>
      <input type="text" name="title" value={title} onChange={handleTitleChange} />
      <br />
      <label>Distance:</label>
      <input type="number" name="distance" value={distance} onChange={handleDistanceChange} />
      <br />
      <label>Duration</label>
      <input type="number" name="duration" value={duration} onChange={handleDurationChange} />
      <br />
      <label>Burned Calories</label>
      <input type="number" name="caloriesBurned" value={caloriesBurned} onChange={handleCaloriesBurnedChange} />
      <br />
      <label>Date:</label>
      <input type="date" name="date" placeholder="Date" value={date} onChange={handleDateChange} />
      {activityId ? (
        <button type="button" onClick={handleUpdateButton}>Update</button>
      ) : (
        <button type="submit">Save</button>
      )}
      {errorMessage && <p>{errorMessage}</p>}
    </form>

    <h2>Running History</h2>
    <table className="w-full">
      <thead>
        <tr>
          <th>Date</th>
          <th>Title</th>
          <th>Distance</th>
          <th>Duration</th>
          <th>Calories</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {activities.map((activity) => (
          <tr key={activity._id}>
            <td>{activity.date ? activity.date.slice(0, 10).split("-").reverse().join(".") : ""}</td>
            <td>{activity.title}</td>
            <td>{activity.distance} km</td>
            <td>{activity.duration} mins</td>
            <td>{activity.caloriesBurned} kcal</td>
            <td>
              <button onClick={() => handleEditButton(activity)}>Edit</button>
              <button onClick={() => handleDeleteButton(activity._id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)
}

export default ActivityPage;
