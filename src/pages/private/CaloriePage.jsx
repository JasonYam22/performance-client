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
         if (error.response?.status === 400) {
    setErrorMessage(error.response?.data?.message || "Something went wrong");
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
  <div className="min-h-screen bg-[#0F172A] text-[#F8FAFC] p-6 sm:p-8">
    <div className="max-w-5xl mx-auto space-y-8">
      
      {/* Header Section */}
      <div className="flex items-center justify-between border-b border-[#94A3B8]/10 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#F8FAFC]">
            {mealId ? "Edit Calorie Log" : "Log Calories"}
          </h1>
          <p className="text-xs text-[#94A3B8] mt-1">
            {caloriesLeftSum}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#94A3B8] block">Total Logged</span>
            <span className="text-sm font-extrabold text-[#3B82F6]">{totalCaloriesConsumed} kcal</span>
          </div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/20">
            {mealId ? "Editing Mode" : "Create Mode"}
          </span>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold">
          {errorMessage}
        </div>
      )}

      {/* Dynamic Form Card */}
      <div className="bg-[#1E293B] border border-[#94A3B8]/10 rounded-2xl p-6 shadow-xl">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
          
          {/* Meal Name */}
          <div className="space-y-1.5 md:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
              Meal Name
            </label>
            <input
              type="text"
              placeholder="e.g. Oatmeal & Eggs"
              value={mealName}
              onChange={handleMealNameChange}
              className="w-full px-4 py-2.5 text-sm rounded-xl bg-[#0F172A] text-[#F8FAFC] border border-[#94A3B8]/20 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent transition-all placeholder-[#94A3B8]/40"
            />
          </div>

          {/* Calories Consumed */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
              Calories (kcal)
            </label>
            <input
              type="number"
              placeholder="0"
              value={caloriesConsumed}
              onChange={handleCaloriesConsumedChange}
              className="w-full px-4 py-2.5 text-sm rounded-xl bg-[#0F172A] text-[#F8FAFC] border border-[#94A3B8]/20 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent transition-all placeholder-[#94A3B8]/40"
            />
          </div>

          {/* Date */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={handleDateChange}
              className="w-full px-4 py-2.5 text-sm rounded-xl bg-[#0F172A] text-[#F8FAFC] border border-[#94A3B8]/20 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent transition-all [color-scheme:dark]"
            />
          </div>

          {/* Protein */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
              Protein (g)
            </label>
            <input
              type="number"
              placeholder="0"
              value={protein}
              onChange={handleProteinChange}
              className="w-full px-4 py-2.5 text-sm rounded-xl bg-[#0F172A] text-[#F8FAFC] border border-[#94A3B8]/20 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent transition-all placeholder-[#94A3B8]/40"
            />
          </div>

          {/* Carbs */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
              Carbs (g)
            </label>
            <input
              type="number"
              placeholder="0"
              value={carbs}
              onChange={handleCarbsChange}
              className="w-full px-4 py-2.5 text-sm rounded-xl bg-[#0F172A] text-[#F8FAFC] border border-[#94A3B8]/20 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent transition-all placeholder-[#94A3B8]/40"
            />
          </div>

          {/* Fat */}
          <div className="space-y-1.5 md:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
              Fat (g)
            </label>
            <input
              type="number"
              placeholder="0"
              value={fat}
              onChange={handleFatChange}
              className="w-full px-4 py-2.5 text-sm rounded-xl bg-[#0F172A] text-[#F8FAFC] border border-[#94A3B8]/20 focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:border-transparent transition-all placeholder-[#94A3B8]/40"
            />
          </div>

          {/* Form Actions */}
          <div className="md:col-span-2 flex items-center justify-end gap-3 pt-3">
            {mealId && (
              <button
                type="button"
                onClick={resetForm}
                className="px-5 py-2.5 text-xs font-semibold uppercase tracking-wider rounded-xl border border-[#94A3B8]/30 text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#94A3B8]/10 transition-all active:scale-95"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="px-6 py-2.5 text-xs font-bold uppercase tracking-wider rounded-xl bg-[#3B82F6] text-white hover:bg-[#2563EB] active:scale-95 shadow-lg shadow-[#3B82F6]/20 transition-all"
            >
              {mealId ? "Update Log" : "Add Log"}
            </button>
          </div>

        </form>
      </div>

      {/* History List */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-[#F8FAFC]">Logged History</h2>
        
        <div className="grid grid-cols-1 gap-4">
          {calorieList.length === 0 ? (
            <div className="bg-[#1E293B] border border-[#94A3B8]/10 rounded-2xl p-8 text-center text-[#94A3B8] text-sm">
              No food entries recorded yet.
            </div>
          ) : (
            calorieList.map((meal) => (
              <div
                key={meal._id}
                className="bg-[#1E293B] border border-[#94A3B8]/10 hover:border-[#3B82F6]/40 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h3 className="text-base font-bold text-[#F8FAFC]">
                      {meal.mealName}
                    </h3>
                    {meal.date && (
                      <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-[#0F172A] text-[#94A3B8] border border-[#94A3B8]/20">
                        {meal.date.slice(0, 10)}
                      </span>
                    )}
                  </div>
                  
                  <div className="text-xs text-[#94A3B8] pt-1">
                    Consumption: <strong className="text-[#F8FAFC]">{meal.caloriesConsumed}</strong> kcal
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={() => handleEditButton(meal)}
                    className="px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-lg border border-[#3B82F6]/40 text-[#3B82F6] hover:bg-[#3B82F6] hover:text-white transition-all active:scale-95"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteButton(meal._id)}
                    className="px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white transition-all active:scale-95"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  </div>
);
  
}

export default CaloriePage;
