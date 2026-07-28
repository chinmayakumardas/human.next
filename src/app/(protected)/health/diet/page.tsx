import MealForm from "@/features/health/components/MealForm";


export default function DietPage(){

  return (

    <div className="p-6 space-y-6">

      <div>
        <h1 className="text-3xl font-bold">
          Diet & Nutrition
        </h1>

        <p className="text-muted-foreground">
          Track your daily meals and macros.
        </p>
      </div>


      <MealForm />

    </div>

  );
}