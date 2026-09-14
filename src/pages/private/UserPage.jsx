import { useState, useEffect } from 'react'
import axios from 'axios'
import service from '../../services/index.services'


function UserPage() {


  return (
    <div>
      <h1>User Profile</h1>

      <div>
<h3>Calories Consumed</h3>
<p>{totalCaloriesConsumed}kcal</p>
      </div>

          <div>
<h3>Calories burned</h3>
<p>{totalCaloriesBurned}kcal</p>
      </div>

    <div>
<h3>Calories Consumed</h3>
<p>{totalCaloriesLeft}kcal</p>
      </div>



    </div>
  )
}

export default UserPage
