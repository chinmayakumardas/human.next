


// import {
//   Activity,
//   Apple,
//   ArrowRight,
//   Calendar,
//   Droplets,
//   Dumbbell,
//   Flame,
//   Heart,
//   Ruler,
//   Scale,
//   Target,
//   Timer,
//   User,
//   Utensils,
// } from "lucide-react";
// import Link from "next/link";

// import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Progress } from "@/components/ui/progress";
// import { Separator } from "@/components/ui/separator";

// const kpiData = [
//   {
//     title: "Age",
//     value: "28",
//     description: "Years old",
//     icon: User,
//   },
//   {
//     title: "Height",
//     value: "178 cm",
//     description: "5'10\"",
//     icon: Ruler,
//   },
//   {
//     title: "Current Weight",
//     value: "82 kg",
//     description: "180.8 lbs",
//     icon: Scale,
//   },
//   {
//     title: "Target Weight",
//     value: "72 kg",
//     description: "158.7 lbs",
//     icon: Target,
//   },
//   {
//     title: "BMI",
//     value: "25.9",
//     description: "Overweight",
//     icon: Activity,
//   },
//   {
//     title: "Body Fat",
//     value: "18.4%",
//     description: "Athletic range",
//     icon: Flame,
//   },
//   {
//     title: "Blood Pressure",
//     value: "118/76",
//     description: "Optimal",
//     icon: Heart,
//   },
//   {
//     title: "Heart Rate",
//     value: "62 bpm",
//     description: "Resting",
//     icon: Activity,
//   },
// ];

// const quickStats = [
//   {
//     title: "Daily Calories",
//     value: "2,200 kcal",
//     icon: Flame,
//     description: "Target intake",
//   },
//   {
//     title: "Protein",
//     value: "160 g",
//     icon: Apple,
//     description: "Daily goal",
//   },
//   {
//     title: "Water",
//     value: "3.5 L",
//     icon: Droplets,
//     description: "Hydration target",
//   },
//   {
//     title: "Monthly Food Budget",
//     value: "$320",
//     icon: Utensils,
//     description: "Grocery allowance",
//   },
//   {
//     title: "Workout Duration",
//     value: "75 min",
//     icon: Timer,
//     description: "Average session",
//   },
// ];

// export default function HealthDashboardPage() {
//   return (
//     <div className="min-h-screen bg-background">
//       <div className="mx-auto max-w-7xl space-y-8 p-6 md:p-8 lg:p-10">
//         <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//           <div className="space-y-1">
//             <h1 className="text-3xl font-semibold tracking-tight text-foreground">
//               Health Overview
//             </h1>
//             <p className="text-muted-foreground">
//               Your personal health metrics and progress at a glance
//             </p>
//           </div>
//           <div className="flex items-center gap-3">
//             <Avatar className="h-10 w-10 border">
//               <AvatarFallback className="bg-muted text-sm font-medium">
//                 JD
//               </AvatarFallback>
//             </Avatar>
//             <div className="hidden sm:block">
//               <p className="text-sm font-medium">John Doe</p>
//               <p className="text-xs text-muted-foreground">Last updated today</p>
//             </div>
//           </div>
//         </div>

//         <section>
//           <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
//             {kpiData.map((kpi) => {
//               const Icon = kpi.icon;
//               return (
//                 <Card
//                   key={kpi.title}
//                   className="rounded-xl border bg-card shadow-sm transition-shadow hover:shadow-md"
//                 >
//                   <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//                     <CardTitle className="text-sm font-medium text-muted-foreground">
//                       {kpi.title}
//                     </CardTitle>
//                     <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
//                       <Icon className="h-4 w-4 text-muted-foreground" />
//                     </div>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="text-2xl font-semibold tracking-tight">
//                       {kpi.value}
//                     </div>
//                     <p className="mt-1 text-xs text-muted-foreground">
//                       {kpi.description}
//                     </p>
//                   </CardContent>
//                 </Card>
//               );
//             })}
//           </div>
//         </section>

//         <section className="grid gap-6 lg:grid-cols-3">
//           <Card className="rounded-xl border shadow-sm lg:col-span-1">
//             <CardHeader>
//               <div className="flex items-center justify-between">
//                 <CardTitle className="text-lg font-semibold">
//                   Current Goal
//                 </CardTitle>
//                 <Badge variant="secondary" className="rounded-full">
//                   Active
//                 </Badge>
//               </div>
//               <CardDescription>Primary focus for this period</CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-6">
//               <div>
//                 <h3 className="text-xl font-semibold">Lose Weight</h3>
//                 <p className="mt-1 text-sm text-muted-foreground">
//                   82 kg → 72 kg
//                 </p>
//               </div>
//               <div className="space-y-2">
//                 <div className="flex items-center justify-between text-sm">
//                   <span className="text-muted-foreground">Progress</span>
//                   <span className="font-medium">80%</span>
//                 </div>
//                 <Progress value={80} className="h-2" />
//               </div>
//               <div className="flex items-center gap-2 text-sm text-muted-foreground">
//                 <Calendar className="h-4 w-4" />
//                 <span>Deadline: 31 Dec 2026</span>
//               </div>
//             </CardContent>
//           </Card>

//           <div className="grid gap-4 sm:grid-cols-2 lg:col-span-2">
//             <Card className="rounded-xl border shadow-sm">
//               <CardHeader className="pb-3">
//                 <div className="flex items-center gap-3">
//                   <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
//                     <Utensils className="h-5 w-5 text-muted-foreground" />
//                   </div>
//                   <div>
//                     <CardTitle className="text-base font-semibold">
//                       Diet Plan
//                     </CardTitle>
//                     <CardDescription>Weight Loss Diet</CardDescription>
//                   </div>
//                 </div>
//               </CardHeader>
//               <CardContent className="space-y-3">
//                 <div className="flex items-center justify-between text-sm">
//                   <span className="text-muted-foreground">Calories</span>
//                   <span className="font-medium">2,200 kcal</span>
//                 </div>
//                 <Separator />
//                 <div className="flex items-center justify-between text-sm">
//                   <span className="text-muted-foreground">Protein</span>
//                   <span className="font-medium">160 g</span>
//                 </div>
//               </CardContent>
//               <CardFooter>
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   className="w-full justify-between"
//                   asChild
//                 >
//                   <Link href="/health/diet">
//                     View plan
//                     <ArrowRight className="h-4 w-4" />
//                   </Link>
//                 </Button>
//               </CardFooter>
//             </Card>

//             <Card className="rounded-xl border shadow-sm">
//               <CardHeader className="pb-3">
//                 <div className="flex items-center gap-3">
//                   <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted">
//                     <Dumbbell className="h-5 w-5 text-muted-foreground" />
//                   </div>
//                   <div>
//                     <CardTitle className="text-base font-semibold">
//                       Exercise Plan
//                     </CardTitle>
//                     <CardDescription>Push Pull Legs</CardDescription>
//                   </div>
//                 </div>
//               </CardHeader>
//               <CardContent className="space-y-3">
//                 <div className="flex items-center justify-between text-sm">
//                   <span className="text-muted-foreground">Frequency</span>
//                   <span className="font-medium">6 Days</span>
//                 </div>
//                 <Separator />
//                 <div className="flex items-center justify-between text-sm">
//                   <span className="text-muted-foreground">Goal</span>
//                   <span className="font-medium">Lose Fat & Gain Muscle</span>
//                 </div>
//               </CardContent>
//               <CardFooter>
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   className="w-full justify-between"
//                   asChild
//                 >
//                   <Link href="/health/exercise">
//                     View plan
//                     <ArrowRight className="h-4 w-4" />
//                   </Link>
//                 </Button>
//               </CardFooter>
//             </Card>
//           </div>
//         </section>

//         <section>
//           <h2 className="mb-4 text-lg font-semibold tracking-tight">
//             Quick Stats
//           </h2>
//           <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
//             {quickStats.map((stat) => {
//               const Icon = stat.icon;
//               return (
//                 <Card
//                   key={stat.title}
//                   className="rounded-xl border bg-card shadow-sm"
//                 >
//                   <CardContent className="flex flex-col items-start gap-3 p-5">
//                     <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
//                       <Icon className="h-4 w-4 text-muted-foreground" />
//                     </div>
//                     <div>
//                       <p className="text-xs text-muted-foreground">
//                         {stat.title}
//                       </p>
//                       <p className="mt-0.5 text-lg font-semibold tracking-tight">
//                         {stat.value}
//                       </p>
//                       <p className="mt-0.5 text-xs text-muted-foreground">
//                         {stat.description}
//                       </p>
//                     </div>
//                   </CardContent>
//                 </Card>
//               );
//             })}
//           </div>
//         </section>

//         <section>
//           <h2 className="mb-4 text-lg font-semibold tracking-tight">
//             Quick Navigation
//           </h2>
//           <div className="grid gap-4 sm:grid-cols-2">
//             <Link href="/health/diet" className="group">
//               <Card className="rounded-xl border shadow-sm transition-all hover:border-foreground/20 hover:shadow-md">
//                 <CardContent className="flex items-center gap-5 p-6">
//                   <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-muted">
//                     <Utensils className="h-6 w-6 text-muted-foreground" />
//                   </div>
//                   <div className="flex-1 space-y-1">
//                     <h3 className="text-lg font-semibold tracking-tight">
//                       Diet Planner
//                     </h3>
//                     <p className="text-sm text-muted-foreground">
//                       Meal plans, macros, shopping list & budget
//                     </p>
//                   </div>
//                   <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
//                 </CardContent>
//               </Card>
//             </Link>

//             <Link href="/health/exercise" className="group">
//               <Card className="rounded-xl border shadow-sm transition-all hover:border-foreground/20 hover:shadow-md">
//                 <CardContent className="flex items-center gap-5 p-6">
//                   <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-muted">
//                     <Dumbbell className="h-6 w-6 text-muted-foreground" />
//                   </div>
//                   <div className="flex-1 space-y-1">
//                     <h3 className="text-lg font-semibold tracking-tight">
//                       Exercise Planner
//                     </h3>
//                     <p className="text-sm text-muted-foreground">
//                       Workout split, weekly volume & training notes
//                     </p>
//                   </div>
//                   <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
//                 </CardContent>
//               </Card>
//             </Link>
//           </div>
//         </section>
//       </div>
//     </div>
//   );
// }



import HealthDashboard from "@/features/health/health-dashboard";
export default function HealthPage() {
  return <HealthDashboard />;
}