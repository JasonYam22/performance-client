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
const [editingId, setEditingId] = useState(null)
const [errorMessage, setErrorMessage] = useState(null)
const [date, setDate] = useState("")

const handleMealNameChange = (e) => setMealName(e.target.value)
const handleCalorieChange = (e) => setCalories(e.target.value)
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
  setEditingId(null)
setErrorMessage("")
}

const getCalories = async () => {
  try{
    const response = await service.get("/calories")
    setCalorieList(response.data)
  } catch (error) {
    console.log(error)
    setErrorMessage("Failed to load calorie log")
  }
}
useEffect(() => {
  getCalories()
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
  const response = await service.post("/calories", body)
  setCalorieList([...calorieList, response.data])
resetForm()
} catch (error) {
  console.log(error)
        navigate("/error")
}
}


  return (
    <div>
      <h1>CALORIE PAGE</h1>
    </div>
  )
}

export default CaloriePage
