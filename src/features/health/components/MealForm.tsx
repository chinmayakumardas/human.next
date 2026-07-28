"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";


export default function MealForm(){

  const [meal,setMeal] = useState("");


  function submit(){

    console.log({
      meal
    });

  }


  return (

    <div className="max-w-md space-y-4">


      <Input
        placeholder="Meal name"
        value={meal}
        onChange={
          e=>setMeal(e.target.value)
        }
      />


      <Input
        placeholder="Calories"
        type="number"
      />


      <Input
        placeholder="Protein"
        type="number"
      />


      <Input
        placeholder="Carbs"
        type="number"
      />


      <Input
        placeholder="Fat"
        type="number"
      />


      <Button onClick={submit}>
        Add Meal
      </Button>


    </div>

  );
}