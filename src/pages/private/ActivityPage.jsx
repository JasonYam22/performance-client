import React, { useEffect, useState } from "react";
import service from "../../services/index.services";
import { useNavigate, Link } from "react-router-dom";

function ActivityPage() {
  const navigate = useNavigate();

  const [activities, setActivities] = useState([]);
  const [title, setTitle] = useState("");
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [caloriesBurned, setCaloriesBurned] = useState("");
  const [date, setDate] = useState("")
const [editingId, setEditingId] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null);

  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleDurationChange = (e) => setDuration(e.target.value);
  const handleDistanceChange = (e) => setDistance(e.target.value);
  const handlecaloriesBurnedChange = (e) => setCaloriesBurned(e.target.value);
    const handleDateChange = (e) => setDate(e.target.value);
  

  const handleUpdateButton = async (e) => {
    e.preventDefault();

    const body = {
      title,
      duration,
      distance,
      caloriesBurned,
      date
    };
    const response = await service.put(`/activities/${editingId}`, body)
setActivities(
  activities.map((activity) => {
    if (activity._id === editingId) {
      return response.data
    } else {
      return activity
    }
  }),
)
setEditingId(null);
setTitle("")
setDistance("")
setDuration("")
setCaloriesBurned("")
setDate("")
}

const handleActivity = async (e) => {
  e.preventDefault()
  if (distance < 0 || duration < 0 || caloriesBurned < 0){
    alert("Please fill in all fields with valid numbers") 
return 
    }
    if (!title) {
      alert("Please add a title to the activity")
      return
    }


 const body = {
      title,
      distance,
         duration,
      caloriesBurned,
      date
    };
    try{
      const response = await service.post("/activities", body)
      setActivities([...activities, response.data])
      setTitle("")
      setDistance("")
      setDuration("")
setCaloriesBurned("")
setDate("")
    } catch (error) {
      console.log(error)
      if (error.response.status === 400) {
        setErrorMessage(error.response.data.errorMessage)
      } else {
        navigate("/error")
      }
    }
  }
  const handleDeleteButton = async (activityId) => {
    await service.delete(`/activities/${activityId}`);
    setActivities(
      activities.filter((activity) => {
        return activity._id !== activityId;
      }),
    );
  };

  const handleEditButton = (activity) => {
   setTitle(activity.title)
   setDistance(activity.distance)
setDuration(activity.duration)
   setCaloriesBurned(activity.caloriesBurned)
   setEditingId(activity._id)
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
    <div>
      <Link to="/">
        <h1>Back to HOMEPAGE</h1>
      </Link>
      <h1>THIS IS THE ACTIVITY PAGE</h1>

      <form onSubmit={handleActivity}>
        <label>Title</label>
        <input
          type="text"
          name="title"
          value={title}
          onChange={handleTitleChange}
        />

        <br />

        <label>Distance:</label>
        <input
          type="number"
          name="distance"
          value={distance}
          onChange={handleDistanceChange}
        />

        <br />

        <label>Duration</label>
        <input
          type="number"
          name="duration"
          value={duration}
          onChange={handleDurationChange}
        />

        <br />

        <label>Burned Calories</label>
        <input
          type="number"
          name="caloriesBurned"
          value={caloriesBurned}
          onChange={handlecaloriesBurnedChange}
        />
        <br />

            <label>Date:</label>
        <input
          type="date"
          name="date"
          placeholder="YYYY/MM/DD"
          value={date}
          onChange={handleDateChange}
        />
{ editingId ? (
        <button type="button" onClick={handleUpdateButton}>Update</button>
) : (
  <button type="submit">Save</button>
)}
        {errorMessage && <p>{errorMessage}</p>}
      </form>

      {activities.map((activity) => (
        <div key={activity._id}>
          <h3>{activity.title}</h3>
          <p>Distance: {activity.distance} km</p>
            <p>Duration: {activity.duration} mins</p>
          <p>Calories burned: {activity.caloriesBurned} ckal</p>
          <p>Date: {activity.date ? activity.date.slice(0, 10).split("-").reverse().join(".") : ""}</p>
          <button onClick={() => handleDeleteButton(activity._id)}>
            Delete activity
          </button>
          <button onClick={() => handleEditButton(activity)}>
            Edit activity
          </button>
        </div>
      ))}
    </div>
  );
}

export default ActivityPage;
