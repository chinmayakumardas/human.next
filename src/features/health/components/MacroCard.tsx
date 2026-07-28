import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";


interface Props {
  title:string;
  current:number;
  goal:number;
  unit:string;
}


export default function MacroCard({
  title,
  current,
  goal,
  unit,
}:Props){

  const percentage =
    Math.min((current / goal) * 100,100);


  return (

    <Card>

      <CardHeader>
        <CardTitle>
          {title}
        </CardTitle>
      </CardHeader>


      <CardContent>

        <div className="text-2xl font-bold">
          {current}{unit}
          <span className="text-sm text-muted-foreground">
            {" "}/ {goal}{unit}
          </span>
        </div>


        <div className="mt-3 h-2 rounded-full bg-muted">

          <div
            className="h-full rounded-full bg-primary"
            style={{
              width:`${percentage}%`
            }}
          />

        </div>

      </CardContent>

    </Card>

  );
}