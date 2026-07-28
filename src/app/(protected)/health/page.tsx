import HealthCard from "@/features/health/components/HealthCard";
import MacroCard from "@/features/health/components/MacroCard";

export default function HealthPage() {
  return (
    <div className="space-y-6 p-6">

      <div>
        <h1 className="text-3xl font-bold">
          Health Dashboard
        </h1>

        <p className="text-muted-foreground">
          Track your daily health progress.
        </p>
      </div>


      <div className="grid gap-4 md:grid-cols-4">

        <HealthCard
          title="Weight"
          value="72 kg"
        />

        <HealthCard
          title="Calories"
          value="1800 kcal"
        />

        <HealthCard
          title="Water"
          value="6 / 8 glasses"
        />

        <HealthCard
          title="Sleep"
          value="7 hours"
        />

      </div>


      <div className="grid gap-4 md:grid-cols-3">

        <MacroCard
          title="Protein"
          current={90}
          goal={120}
          unit="g"
        />

        <MacroCard
          title="Carbs"
          current={200}
          goal={250}
          unit="g"
        />

        <MacroCard
          title="Fat"
          current={50}
          goal={70}
          unit="g"
        />

      </div>

    </div>
  );
}