import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import service from "../../services/index.services";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import {
  ArrowLeft,
  Flame,
  Plus,
  Pencil,
  Trash2,
} from "lucide-react";

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

  async function handleSubmit(e) {
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
          })
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
  }

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
  
const todaysActivities = activityList.filter((activity) => {
  return activity.date && activity.date.slice(0, 10) === today
})

  const totalCaloriesConsumed = todaysMeals.reduce((acc, activity) => {
    return acc + (Number(activity.caloriesConsumed) || 0);
  }, 0);

  const totalCaloriesBurned = todaysActivities.reduce((acc, meal) => {
    return acc + (Number(meal.caloriesBurned) || 0);
  }, 0);

  const totalCaloriesLeft =
    (user?.dailyCalorieGoal ?? 0) - totalCaloriesConsumed + totalCaloriesBurned;

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
  <div className="relative min-h-screen overflow-hidden bg-[#15171B] text-[#F3F1ED]">
    {/* Ambient background */}
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -left-40 -top-40 h-[30rem] w-[30rem] rounded-full bg-[#FF5A36]/15 blur-[140px]" />
      <div className="absolute -right-40 top-1/3 h-[32rem] w-[32rem] rounded-full bg-[#4FA8FF]/10 blur-[140px]" />
      <div className="absolute bottom-[-12rem] left-1/3 h-[28rem] w-[28rem] rounded-full bg-[#33C97A]/10 blur-[140px]" />
    </div>

    <div className="relative mx-auto max-w-7xl px-6 py-10 lg:px-10">

      {/* Header */}
      <div className="mb-10 flex items-end justify-between gap-6">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#FF5A36]" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#A6ABB2]">
              Nutrition
            </span>
          </div>

          <h1
            className="text-5xl tracking-tight md:text-6xl"
            style={{ fontFamily: "'Archivo Black', sans-serif" }}
          >
            CALORIES
          </h1>

          <p className="mt-3 text-sm text-[#A6ABB2]">
            {caloriesLeftSum}
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 rounded-full border-2 border-[#3A3D42] px-5 py-2.5 text-sm font-semibold text-[#A6ABB2] transition-all hover:border-[#F3F1ED] hover:text-[#F3F1ED]"
        >
          <ArrowLeft size={16} />
          Back
        </button>
      </div>

      {errorMessage && (
        <div className="mb-6 rounded-2xl border-2 border-[#FF5A36]/30 bg-[#FF5A36]/10 px-5 py-4 text-sm font-semibold text-[#FF8A72]">
          {errorMessage}
        </div>
      )}

      {/* Stats */}
      <div className="grid gap-5 md:grid-cols-3">

        {/* Calories left */}
        <div className="relative overflow-hidden rounded-3xl border-2 border-[#FF5A36]/50 bg-[#1D2025] p-7 transition-all hover:border-[#FF5A36]">
          <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-[#FF5A36]/10 blur-[70px]" />

          <div className="relative flex items-start justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FF5A36]/10">
              <Flame className="h-6 w-6 text-[#FF5A36]" />
            </div>

            <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#A6ABB2]">
              Today
            </span>
          </div>

          <p
            className="relative mt-7 text-4xl"
            style={{ fontFamily: "'Archivo Black', sans-serif" }}
          >
            {totalCaloriesLeft}
          </p>

          <p className="mt-2 text-xs font-bold uppercase tracking-[0.15em] text-[#A6ABB2]">
            kcal balance
          </p>
        </div>

        {/* Consumed */}
        <div className="relative overflow-hidden rounded-3xl border-2 border-[#FFC94F]/50 bg-[#1D2025] p-7 transition-all hover:border-[#FFC94F]">
          <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-[#FFC94F]/10 blur-[70px]" />

          <div className="relative flex items-start justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFC94F]/10">
              <Flame className="h-6 w-6 text-[#FFC94F]" />
            </div>

            <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#A6ABB2]">
              Logged
            </span>
          </div>

          <p
            className="relative mt-7 text-4xl text-[#FFC94F]"
            style={{ fontFamily: "'Archivo Black', sans-serif" }}
          >
            {totalCaloriesConsumed}
          </p>

          <p className="mt-2 text-xs font-bold uppercase tracking-[0.15em] text-[#A6ABB2]">
            kcal consumed
          </p>
        </div>

        {/* Burned */}
        <div className="relative overflow-hidden rounded-3xl border-2 border-[#33C97A]/50 bg-[#1D2025] p-7 transition-all hover:border-[#33C97A]">
          <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-[#33C97A]/10 blur-[70px]" />

          <div className="relative flex items-start justify-between">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#33C97A]/10">
              <Flame className="h-6 w-6 text-[#33C97A]" />
            </div>

            <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#A6ABB2]">
              Activity
            </span>
          </div>

          <p
            className="relative mt-7 text-4xl text-[#33C97A]"
            style={{ fontFamily: "'Archivo Black', sans-serif" }}
          >
            {totalCaloriesBurned}
          </p>

          <p className="mt-2 text-xs font-bold uppercase tracking-[0.15em] text-[#A6ABB2]">
            kcal burned
          </p>
        </div>
      </div>

      {/* Form + Doughnut */}
      <div className="mt-8 grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">

        {/* Form */}
        <div className="rounded-3xl border-2 border-[#3A3D42] bg-[#1D2025] p-7 md:p-9">
          <div className="mb-7 flex items-end justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#A6ABB2]">
                Nutrition log
              </p>

              <h2
                className="mt-1 text-2xl"
                style={{ fontFamily: "'Archivo Black', sans-serif" }}
              >
                {mealId ? "EDIT MEAL" : "LOG FOOD"}
              </h2>
            </div>

            {mealId && (
              <span className="rounded-full bg-[#4FA8FF]/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-[#4FA8FF]">
                Editing
              </span>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-[0.15em] text-[#A6ABB2]">
                Meal Name
              </label>

              <input
                type="text"
                placeholder="e.g. Oatmeal & Eggs"
                value={mealName}
                onChange={handleMealNameChange}
                className="w-full rounded-2xl border-2 border-[#3A3D42] bg-[#22252B] px-4 py-3.5 text-sm text-[#F3F1ED] outline-none transition-colors placeholder:text-[#666B72] focus:border-[#FF5A36]"
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-[0.15em] text-[#A6ABB2]">
                  Calories (kcal)
                </label>

                <input
                  type="number"
                  placeholder="0"
                  value={caloriesConsumed}
                  onChange={handleCaloriesConsumedChange}
                  className="w-full rounded-2xl border-2 border-[#3A3D42] bg-[#22252B] px-4 py-3.5 text-sm text-[#F3F1ED] outline-none transition-colors placeholder:text-[#666B72] focus:border-[#FF5A36]"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-[0.15em] text-[#A6ABB2]">
                  Date
                </label>

                <input
                  type="date"
                  value={date}
                  onChange={handleDateChange}
                    required
                  className="w-full rounded-2xl border-2 border-[#3A3D42] bg-[#22252B] px-4 py-3.5 text-sm text-[#F3F1ED] outline-none [color-scheme:dark] focus:border-[#FF5A36]"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-[0.15em] text-[#A6ABB2]">
                  Protein (g)
                </label>

                <input
                  type="number"
                  placeholder="0"
                  value={protein}
                  onChange={handleProteinChange}
                  className="w-full rounded-2xl border-2 border-[#3A3D42] bg-[#22252B] px-4 py-3.5 text-sm text-[#F3F1ED] outline-none transition-colors placeholder:text-[#666B72] focus:border-[#4FA8FF]"
                />
              </div>

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-[0.15em] text-[#A6ABB2]">
                  Carbs (g)
                </label>

                <input
                  type="number"
                  placeholder="0"
                  value={carbs}
                  onChange={handleCarbsChange}
                  className="w-full rounded-2xl border-2 border-[#3A3D42] bg-[#22252B] px-4 py-3.5 text-sm text-[#F3F1ED] outline-none transition-colors placeholder:text-[#666B72] focus:border-[#FFC94F]"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-[0.15em] text-[#A6ABB2]">
                Fat (g)
              </label>

              <input
                type="number"
                placeholder="0"
                value={fat}
                onChange={handleFatChange}
                className="w-full rounded-2xl border-2 border-[#3A3D42] bg-[#22252B] px-4 py-3.5 text-sm text-[#F3F1ED] outline-none transition-colors placeholder:text-[#666B72] focus:border-[#FF5A36]"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              {mealId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-full border-2 border-[#3A3D42] px-5 py-2.5 text-sm font-semibold text-[#A6ABB2] transition-colors hover:border-[#F3F1ED] hover:text-[#F3F1ED]"
                >
                  Cancel
                </button>
              )}

              <button
                type="submit"
                className="flex items-center gap-2 rounded-full bg-[#FF5A36] px-6 py-2.5 text-sm font-bold text-[#15171B] shadow-[0_0_25px_-6px_#FF5A36] transition-all hover:bg-[#ff7355] active:scale-95"
              >
                <Plus size={16} />
                {mealId ? "Update Log" : "Add Log"}
              </button>
            </div>
          </form>
        </div>

        {/* Doughnut */}
        <div className="rounded-3xl border-2 border-[#3A3D42] bg-[#1D2025] p-7 md:p-9">
          <div className="mb-6">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#A6ABB2]">
              Today's intake
            </p>

            <h2
              className="mt-1 text-2xl"
              style={{ fontFamily: "'Archivo Black', sans-serif" }}
            >
              MACROS
            </h2>
          </div>

          <div className="mx-auto max-w-[280px]">
            <Doughnut
              data={macroChartData}
              options={{
                responsive: true,
                maintainAspectRatio: true,
                cutout: "68%",
                plugins: {
                  legend: {
                    position: "bottom",
                    labels: {
                      color: "#C4C9CE",
                      padding: 18,
                      usePointStyle: true,
                      font: {
                        size: 11,
                        weight: "600",
                      },
                    },
                  },
                },
              }}
            />
          </div>

          <div className="mt-6 grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="text-lg font-bold text-[#4FA8FF]">
                {totalProtein}g
              </p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#A6ABB2]">
                Protein
              </p>
            </div>

            <div>
              <p className="text-lg font-bold text-[#FFC94F]">
                {totalCarbs}g
              </p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#A6ABB2]">
                Carbs
              </p>
            </div>

            <div>
              <p className="text-lg font-bold text-[#FF6384]">
                {totalFat}g
              </p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#A6ABB2]">
                Fat
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Logged History */}
      <div className="mt-10">
        <div className="mb-5">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#A6ABB2]">
            Your entries
          </p>

          <h2
            className="mt-1 text-2xl"
            style={{ fontFamily: "'Archivo Black', sans-serif" }}
          >
            LOGGED HISTORY
          </h2>
        </div>

        <div className="space-y-4">
          {calorieList.length === 0 ? (
            <div className="rounded-3xl border-2 border-[#3A3D42] bg-[#1D2025] p-10 text-center">
              <Flame className="mx-auto h-8 w-8 text-[#FFC94F]" />

              <p className="mt-4 text-sm font-semibold text-[#A6ABB2]">
                No food entries recorded yet.
              </p>
            </div>
          ) : (
            calorieList.map((meal) => (
              <div
                key={meal._id}
                className="group rounded-3xl border-2 border-[#3A3D42] bg-[#1D2025] p-6 transition-all hover:border-[#4FA8FF]"
              >
                <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h3
                        className="text-xl"
                        style={{ fontFamily: "'Archivo Black', sans-serif" }}
                      >
                        {meal.mealName}
                      </h3>

                      {meal.date && (
                        <span className="rounded-full border border-[#3A3D42] bg-[#22252B] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#A6ABB2]">
                          {meal.date.slice(0, 10)}
                        </span>
                      )}
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="rounded-full bg-[#FF5A36]/10 px-3 py-1.5 text-xs font-bold text-[#FF5A36]">
                        {meal.caloriesConsumed} kcal
                      </span>

                      <span className="rounded-full bg-[#4FA8FF]/10 px-3 py-1.5 text-xs font-bold text-[#4FA8FF]">
                        {meal.protein}g protein
                      </span>

                      <span className="rounded-full bg-[#FFC94F]/10 px-3 py-1.5 text-xs font-bold text-[#FFC94F]">
                        {meal.carbs}g carbs
                      </span>

                      <span className="rounded-full bg-[#FF6384]/10 px-3 py-1.5 text-xs font-bold text-[#FF6384]">
                        {meal.fat}g fat
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-center">
                    <button
                      type="button"
                      onClick={() => handleEditButton(meal)}
                      className="flex items-center gap-2 rounded-full border-2 border-[#4FA8FF]/50 px-4 py-2 text-xs font-bold text-[#4FA8FF] transition-colors hover:bg-[#4FA8FF] hover:text-[#15171B]"
                    >
                      <Pencil size={14} />
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteButton(meal._id)}
                      className="flex items-center gap-2 rounded-full border-2 border-[#FF5A36]/40 px-4 py-2 text-xs font-bold text-[#FF5A36] transition-colors hover:bg-[#FF5A36] hover:text-white"
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>

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
