import { useState, useEffect } from "react";
import service from "../../services/index.services";

function UserPage() {
  const [user, setUser] = useState(null);
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [goalWeight, setGoalWeight] = useState("");
  const [dailyCalorieGoal, setDailyCalorieGoal] = useState("");
  const [weeklyWorkoutGoal, setWeeklyWorkoutGoal] = useState("");

  const handleWeightChange = (e) => setWeight(e.target.value);
  const handleHeightChange = (e) => setHeight(e.target.value);
  const handleGoalWeightChange = (e) => setGoalWeight(e.target.value);
  const handleDailyCalorieGoalChange = (e) =>
    setDailyCalorieGoal(e.target.value);
  const handleWeeklyWorkoutGoalChange = (e) =>
    setWeeklyWorkoutGoal(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const body = {
      weight,
      height,
      goalWeight,
      dailyCalorieGoal,
      weeklyWorkoutGoal,
    };

    try {
      const response = await service.put("users", body);
      setUser(response.data);
    } catch (error) {
      console.log(error);
    }
  };

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

  useEffect(() => {
    if (user) {
      setWeight(user.weight);
      setHeight(user.height);
      setGoalWeight(user.goalWeight);
      setDailyCalorieGoal(user.dailyCalorieGoal);
      setWeeklyWorkoutGoal(user.weeklyWorkoutGoal);
    }
  }, [user]);

  return (
    <div>
      <h1>User Profile</h1>

      <div>
        <h3>Daily Calorie Goal</h3>
        <p>{user?.dailyCalorieGoal}kcal</p>
      </div>

      <div>
        <h3>Weekly Workout Goal</h3>
        <p>{user?.weeklyWorkoutGoal} (times per week)</p>
      </div>
      <form onSubmit={handleSubmit}>
        <label>Weight (kg)</label>
        <input
          type="number"
          name="weight"
          value={weight}
          onChange={handleWeightChange}
        />

        <br />

        <label>Height (cm)</label>
        <input
          type="number"
          name="height"
          value={height}
          onChange={handleHeightChange}
        />

        <br />

        <label>Goal Weight (kg)</label>
        <input
          type="number"
          name="goalWeight"
          value={goalWeight}
          onChange={handleGoalWeightChange}
        />

        <br />

        <label>Daily Calorie Goal</label>
        <input
          type="number"
          name="dailyCalorieGoal"
          value={dailyCalorieGoal}
          onChange={handleDailyCalorieGoalChange}
        />

        <br />

        <label>Weekly Workout Goal</label>
        <input
          type="number"
          name="weeklyWorkoutGoal"
          value={weeklyWorkoutGoal}
          onChange={handleWeeklyWorkoutGoalChange}
        />

        <br />

        <button type="submit">Save</button>
      </form>
    </div>
  );
}

export default UserPage;
