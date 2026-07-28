import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";


interface HealthCardProps {
  title: string;
  value: string;
  description?: string;
  icon?: React.ReactNode;
}


export default function HealthCard({
  title,
  value,
  description,
  icon,
}: HealthCardProps) {
  return (
    <Card className="rounded-xl">

      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">

        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>

        {icon && (
          <div className="text-muted-foreground">
            {icon}
          </div>
        )}

      </CardHeader>


      <CardContent>

        <div className="text-3xl font-bold">
          {value}
        </div>


        {description && (
          <p className="mt-1 text-xs text-muted-foreground">
            {description}
          </p>
        )}

      </CardContent>

    </Card>
  );
}