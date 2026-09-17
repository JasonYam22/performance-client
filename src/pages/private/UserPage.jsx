import { useState, useEffect } from "react";
import service from "../../services/index.services";
import { Scale, Target, Flame, Ruler, Dumbbell, Save } from "lucide-react";

function UserPage() {
  const [user, setUser] = useState(null);
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [goalWeight, setGoalWeight] = useState("");
  const [dailyCalorieGoal, setDailyCalorieGoal] = useState("");
  const [weeklyWorkoutGoal, setWeeklyWorkoutGoal] = useState("");
const [errorMessage, setErrorMessage] = useState("");

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

  if (weight < 0 || height < 0 || goalWeight < 0 || dailyCalorieGoal < 0 || weeklyWorkoutGoal < 0) {
      alert ("Please enter valid non negative numbers")
      return
    }

    try {
      const response = await service.put("users", body);
      setUser(response.data);
    } catch (error) {
      console.log(error);
        setErrorMessage("Could not update profile")
    } 
  };

  useEffect(() => {
    service
      .get("/users")
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
     console.log(error)
      setErrorMessage("Could not load user profile");
      });
  }, []);

  useEffect(() => {
    if (user) {
      setWeight(user.weight ?? "");
      setHeight(user.height ?? "");
      setGoalWeight(user.goalWeight ?? "");
      setDailyCalorieGoal(user.dailyCalorieGoal ?? "");
      setWeeklyWorkoutGoal(user.weeklyWorkoutGoal ?? "");
    }
  }, [user]);

return (
  <div className="relative min-h-screen bg-[#14161B] text-[#F3F1ED] overflow-hidden">
    <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#4FA8FF]/10 via-transparent to-[#33C97A]/10" />
    <div className="pointer-events-none absolute -top-32 -left-32 h-[32rem] w-[32rem] rounded-full bg-[#4FA8FF] opacity-25 blur-[150px]" />
    <div className="pointer-events-none absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-[#33C97A] opacity-20 blur-[140px]" />
    <div className="pointer-events-none absolute top-1/2 -right-32 h-80 w-80 rounded-full bg-[#FFC94F] opacity-[0.12] blur-[130px]" />

    <div className="relative max-w-3xl mx-auto px-6 py-16 space-y-10">
      <div className="text-center">
        <h1 className="text-4xl font-['Archivo_Black'] tracking-wide">User Profile</h1>
        <p className="mt-1 text-xs uppercase tracking-[0.2em] text-[#A6ABB2]">Your goals & body stats</p>
      </div>

      {/* Goal summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-3xl border-2 border-[#FFC94F]/50 bg-[#262A33]/80 backdrop-blur-sm p-6 flex items-center gap-4 shadow-[0_0_40px_-12px_#FFC94F]">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#FFC94F]/15">
            <Flame className="w-5 h-5 text-[#FFC94F]" />
          </div>
          <div>
            <h3 className="text-xs uppercase tracking-widest text-[#A6ABB2] font-semibold">Daily Calorie Goal</h3>
            <p className="text-2xl font-['Archivo_Black'] text-[#FFC94F]">{user?.dailyCalorieGoal != null ? user.weeklyCalorieGoal : "Not set"} (kcal)</p>
          </div>
        </div>

        <div className="rounded-3xl border-2 border-[#4FA8FF]/50 bg-[#262A33]/80 backdrop-blur-sm p-6 flex items-center gap-4 shadow-[0_0_40px_-12px_#4FA8FF]">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#4FA8FF]/15">
            <Dumbbell className="w-5 h-5 text-[#4FA8FF]" />
          </div>
          <div>
            <h3 className="text-xs uppercase tracking-widest text-[#A6ABB2] font-semibold">Weekly Workout Goal</h3>
            <p className="text-2xl font-['Archivo_Black'] text-[#4FA8FF]">{user?.weeklyWorkoutGoal != null ? user.weeklyCalorieGoal : "Not set"} (x / week)</p>
          </div>
        </div>
      </div>

      {/* Edit form */}
      <div className="rounded-3xl border-2 border-[#3A3D42] bg-[#262A33]/80 backdrop-blur-sm p-8 md:p-10 space-y-6">
        <h2 className="text-base font-bold">Edit Details</h2>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="flex items-center gap-1.5 text-xs uppercase tracking-widest mb-1 text-[#A6ABB2] font-semibold">
                <Scale className="w-3.5 h-3.5" />
                Weight (kg)
              </label>
              <input
                className="w-full p-2.5 text-sm rounded-lg bg-[#1B1E24] border-2 border-[#3A3D42] focus:outline-none focus:border-[#33C97A]"
                type="number" name="weight" value={weight} onChange={handleWeightChange}
              />
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-xs uppercase tracking-widest mb-1 text-[#A6ABB2] font-semibold">
                <Ruler className="w-3.5 h-3.5" />
                Height (cm)
              </label>
              <input
                className="w-full p-2.5 text-sm rounded-lg bg-[#1B1E24] border-2 border-[#3A3D42] focus:outline-none focus:border-[#4FA8FF]"
                type="number" name="height" value={height} onChange={handleHeightChange}
              />
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-xs uppercase tracking-widest mb-1 text-[#A6ABB2] font-semibold">
                <Target className="w-3.5 h-3.5" />
                Goal Weight (kg)
              </label>
              <input
                className="w-full p-2.5 text-sm rounded-lg bg-[#1B1E24] border-2 border-[#3A3D42] focus:outline-none focus:border-[#33C97A]"
                type="number" name="goalWeight" value={goalWeight} onChange={handleGoalWeightChange}
              />
            </div>

            <div>
              <label className="flex items-center gap-1.5 text-xs uppercase tracking-widest mb-1 text-[#A6ABB2] font-semibold">
                <Flame className="w-3.5 h-3.5" />
                Daily Calorie Goal
              </label>
              <input
                className="w-full p-2.5 text-sm rounded-lg bg-[#1B1E24] border-2 border-[#3A3D42] focus:outline-none focus:border-[#FFC94F]"
                type="number" name="dailyCalorieGoal" value={dailyCalorieGoal} onChange={handleDailyCalorieGoalChange}
              />
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center gap-1.5 text-xs uppercase tracking-widest mb-1 text-[#A6ABB2] font-semibold">
                <Dumbbell className="w-3.5 h-3.5" />
                Weekly Workout Goal
              </label>
              <input
                className="w-full p-2.5 text-sm rounded-lg bg-[#1B1E24] border-2 border-[#3A3D42] focus:outline-none focus:border-[#4FA8FF]"
                type="number" name="weeklyWorkoutGoal" value={weeklyWorkoutGoal} onChange={handleWeeklyWorkoutGoalChange}
              />
            </div>
          </div>

          <button
            className="flex items-center gap-2 bg-[#33C97A] text-[#0F1115] px-6 py-2.5 text-sm font-bold rounded-full shadow-[0_0_20px_-4px_#33C97A] hover:bg-[#4ee092] transition-colors"
            type="submit"
          >
            <Save className="w-4 h-4" />
            Save
          </button>
        </form>
      </div>
    </div>
  </div>
);
}

export default UserPage;
