import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import service from "../../services/index.services";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

function CaloriePage() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [protein, setProtein] = useState("");
  const [fat, setFat] = useState("");
  const [carbs, setCarbs] = useState("");
  const [caloriesConsumed, setCaloriesConsumed] = useState("");
  const [mealName, setMealName] = useState("");
  const [mealId, setMealId] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [date, setDate] = useState("");
  /* const [loading, isLoading] = useState(true) */

  const [activityList, setActivityList] = useState([]);
  const [calorieList, setCalorieList] = useState([]);

  const handleMealNameChange = (e) => setMealName(e.target.value);
  const handleCaloriesConsumedChange = (e) =>
    setCaloriesConsumed(e.target.value);
  const handleDateChange = (e) => setDate(e.target.value);
  const handleProteinChange = (e) => setProtein(e.target.value);
  const handleCarbsChange = (e) => setCarbs(e.target.value);
  const handleFatChange = (e) => setFat(e.target.value);

  const resetForm = () => {
    setMealName("");
    setCaloriesConsumed("");
    setCarbs("");
    setDate("");
    setFat("");
    setProtein("");
    setMealId(null);
    setErrorMessage(null);
  };

  const getMeals = async () => {
    try {
      const response = await service.get("/calories");
      setCalorieList(response.data);
    } catch (error) {
      console.log(error);
      setErrorMessage("Failed to load calorie log");
    }
  };
  useEffect(() => {
    getMeals();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const body = {
      mealName,
      caloriesConsumed,
      protein,
      fat,
      carbs,
      date,
    };

    if (caloriesConsumed < 0 || protein < 0 || fat < 0 || carbs < 0) {
      alert("Please fill fields with valid numbers");
      return;
    }
    if (!mealName) {
      alert("Please add a meal name");
      return;
    }

    try {
      if (mealId) {
        const response = await service.put(`/calories/${mealId}`, body);
        setCalorieList(
          calorieList.map((meal) => {
            if (meal._id === mealId) {
              return response.data;
            } else {
              return meal;
            }
          }),
        );
      } else {
        const response = await service.post("/calories", body);
        setCalorieList([...calorieList, response.data]);
      }
      resetForm();
    } catch (error) {
      console.log(error);
      if (error.response && error.response.status === 400) {
        setErrorMessage("Could not save meal");
      } else {
        navigate("/error");
      }
    }
  };

  const handleEditButton = (calories) => {
    setMealName(calories.mealName);
    setProtein(calories.protein);
    setCarbs(calories.carbs);
    setFat(calories.fat);
    setCaloriesConsumed(calories.caloriesConsumed);
    setMealId(calories._id);
    if (calories.date) {
      setDate(calories.date.slice(0, 10));
    } else {
      setDate("");
    }
  };

  const handleDeleteButton = async (mealId) => {
    await service.delete(`/calories/${mealId}`);
    setCalorieList(
      calorieList.filter((meal) => {
        return meal._id !== mealId;
      }),
    );
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const caloriesResponse = await service.get("/calories");
        const activitiesResponse = await service.get("/activities");

        setCalorieList(caloriesResponse.data);
        setActivityList(activitiesResponse.data);
      } catch (error) {
        console.log(error);
        if (error.status && error.response.status === 400) {
          setErrorMessage(error.response.data.errorMessage);
        } else {
          navigate("/error");
        }
      }
    };
    getData();
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

  const today = new Date().toISOString().slice(0, 10);
  const todaysMeals = calorieList.filter((meal) => {
    return meal.date && meal.date.slice(0, 10) === today;
  });

  const totalCaloriesConsumed = calorieList.reduce((acc, meal) => {
    return acc + (Number(meal.caloriesConsumed) || 0);
  }, 0);

  const totalCaloriesBurned = activityList.reduce((acc, activity) => {
    return acc + (Number(activity.caloriesBurned) || 0);
  }, 0);

  const totalCaloriesBurnedThisWeek = currentWeekActivities.reduce((acc, activity) => {
  return acc + (Number(activity.caloriesBurned) || 0)
}, 0)

  const totalCaloriesLeft =
    user?.dailyCalorieGoal - totalCaloriesConsumed + totalCaloriesBurned;

  const totalProtein = todaysMeals.reduce((acc, meal) => {
    return acc + (Number(meal.protein) || 0);
  }, 0);

  const totalCarbs = todaysMeals.reduce((acc, meal) => {
    return acc + (Number(meal.carbs) || 0);
  }, 0);

  const totalFat = todaysMeals.reduce((acc, meal) => {
    return acc + (Number(meal.fat) || 0);
  }, 0);

  const caloriesLeftSum =totalCaloriesLeft >= 0
      ? `${totalCaloriesLeft} kcal left for today`
      : `${Math.abs(totalCaloriesLeft)} kcal over for today`;

  const macroChartData = {
    labels: ["Protein(g)", "Carbs(g)", "Fat(g)"],
    datasets: [
      {
        label: "macros",
        data: [totalProtein, totalCarbs, totalFat],
        backgroundColor: ["#36A2EB", "#FFCE56", "#FF6384"],
      },
    ],
  };


  return (
    <div>
      <h1>CALORIE PAGE</h1>
      <form onSubmit={handleSubmit}>
        <label>Meal Name</label>
        <input
          type="text"
          name="mealName"
          value={mealName}
          onChange={handleMealNameChange}
        />

        <br />

        <label>Calories</label>
        <input
          type="number"
          name="caloriesConsumed"
          value={caloriesConsumed}
          onChange={handleCaloriesConsumedChange}
        />

        <br />

        <label>Protein</label>
        <input
          type="number"
          name="Protein"
          value={protein}
          onChange={handleProteinChange}
        />

        <br />

        <label>Carbs</label>
        <input
          type="number"
          name="Carbs"
          value={carbs}
          onChange={handleCarbsChange}
        />

        <br />

        <label>Fat</label>
        <input
          type="number"
          name="Fat"
          value={fat}
          onChange={handleFatChange}
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
        <button type="submit">{mealId ? "Update" : "Save"}</button>

        {errorMessage && <p>{errorMessage}</p>}
      </form>

      <div>
        <h3>CALORIE TOTAL</h3>
        <p>Consumed: {totalCaloriesConsumed} kcal</p>
        <p>Burned: {totalCaloriesBurned} kcal</p>
        <p>{caloriesLeftSum}</p>
      </div>

      <div style={{ width: "200px", height: "200px", margin: "0 auto" }}>
        <Doughnut
          data={macroChartData}
          options={{ responsive: true, maintainAspectRatio: false }}
        />
      </div>

      {calorieList.map((calorie) => (
        <div key={calorie._id}>
          <h3>{calorie.mealName}</h3>
          <p>calories: {calorie.caloriesConsumed}g</p>
          <p>Protein: {calorie.protein}p</p>
          <p>Carbs:{calorie.carbs}c</p>
          <p>Fat: {calorie.fat}f</p>
          <p>
            Date:{" "}
            {calorie.date
              ? calorie.date.slice(0, 10).split("-").reverse().join(".")
              : ""}
          </p>
          <button onClick={() => handleDeleteButton(calorie._id)}>
            Delete calorie
          </button>
          <button onClick={() => handleEditButton(calorie)}>
            Edit calorie
          </button>
        </div>
      ))}
    </div>
  );
}

export default CaloriePage;
