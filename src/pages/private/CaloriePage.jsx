import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import service from "../../services/index.services";


function CaloriePage() {

  const navigate = useNavigate()

  const [protein, setProtein] = useState("")
  const [fat, setFat] = useState("")
  const [carbs, setCarbs] = useState("")
  const [calorieList, setCalorieList] = useState([])
const [calories, setCalories] = useState("")
const [mealName, setMealName] = useState("")
const [mealId, setMealId] = useState(null)
const [errorMessage, setErrorMessage] = useState(null)
const [date, setDate] = useState("")

const handleMealNameChange = (e) => setMealName(e.target.value)
const handleCaloriesChange = (e) => setCalories(e.target.value)
const handleDateChange = (e) => setDate(e.target.value)
const handleProteinChange = (e) => setProtein(e.target.value)
const handleCarbsChange = (e) => setCarbs(e.target.value)
const handleFatChange = (e) => setFat(e.target.value)


const resetForm = () => {
  setMealName("")
  setCalories("")
  setCarbs("")
  setDate("")
  setFat("")
  setProtein("")
  setMealId(null)
setErrorMessage(null)
}

const getMeals = async () => {
  try{
    const response = await service.get("/calories")
    setCalorieList(response.data)
  } catch (error) {
    console.log(error)
    setErrorMessage("Failed to load calorie log")
  }
}
useEffect(() => {
  getMeals()
},[])

const handleSubmit = async (e) => {
  e.preventDefault()

  const body = {
  mealName,
  calories,
  protein,
  fat,
  carbs,
date
}

  if (calories < 0 || protein < 0 || fat < 0 || carbs < 0) {
    alert ("Please fill fields with valid numbers")
    return
  }
  if (!mealName) {
    alert("Please add a meal name")
  return
  }

try {
  if (mealId) {
    const response = await service.put(`/calories/${mealId}`, body)
    setCalorieList(
      calorieList.map((meal) => {
        if (meal._id === mealId) {
          return response.data
        } else {
          return meal
        }
      })
    )
  } else {
  const response = await service.post("/calories", body)
  setCalorieList([...calorieList, response.data])
  }
resetForm()
} catch (error) {
  console.log(error)
  if (error.response && error.response.status === 400) {
    setErrorMessage("Could not save meal")
  } else {
        navigate("/error")
}
}
}

  const handleEditButton = (calories) => {
    setMealName(calories.mealName);
    setProtein(calories.protein);
    setCarbs(calories.carbs)
setFat(calories.fat)
setCalories(calories.calories);
    setMealId(calories._id)
    if (meal.date) {
      setDate(meal.date.slice(0,10))
    } else {
      setData("")
    }
    setMealId(meal._id)
  };

 const handleDeleteButton = async (mealId) => {
    await service.delete(`/calories/${mealId}`);
    setCalories(
      calories.filter((meal) => {
        return meal._id !== mealId;
      }),
    );
  };

  return (
    <div>
      <h1>CALORIE PAGE</h1>
<form onSubmit={handleSubmit} >
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
name="calories"
value={calories}
onChange={handleCaloriesChange}
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

  {calorieList.map((calorie) => (
        <div key={calorie._id}>
          <h3>{calorie.mealName}</h3>
          <p>calories: {calorie.calories}g</p>
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
  )
}

export default CaloriePage
