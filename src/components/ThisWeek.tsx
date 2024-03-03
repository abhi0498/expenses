import { supabase } from "@/utils/supabase/client";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryLine,
  VictoryPie,
  VictoryTheme,
} from "victory";
import Loader from "./Loader";

const options = {
  chart: {},
};

const initialDaysArray = [
  {
    day: "Sun",
    rupees: 0,
  },
  {
    day: "Mon",
    rupees: 0,
  },
  {
    day: "Tue",
    rupees: 0,
  },
  {
    day: "Wed",
    rupees: 0,
  },
  {
    day: "Thu",
    rupees: 0,
  },
  {
    day: "Fri",
    rupees: 0,
  },
  {
    day: "Sat",
    rupees: 0,
  },
];

const initialMonthsArray = [
  {
    day: "Jan",
    rupees: 0,
  },
  {
    day: "Feb",
    rupees: 0,
  },
  {
    day: "Mar",
    rupees: 0,
  },
  {
    day: "Apr",
    rupees: 0,
  },
  {
    day: "May",
    rupees: 0,
  },
  {
    day: "Jun",
    rupees: 0,
  },
  {
    day: "Jul",
    rupees: 0,
  },
  {
    day: "Aug",
    rupees: 0,
  },
  {
    day: "Sep",
    rupees: 0,
  },
  {
    day: "Oct",
    rupees: 0,
  },
  {
    day: "Nov",
    rupees: 0,
  },
  {
    day: "Dec",
    rupees: 0,
  },
];

const DATE_FORMAT = "YYYY-MM-DD";
const ThisWeek = () => {
  const [expenses, setExpenses] = useState<Array<any>>([]);
  const [pieExpenses, setPieExpenses] = useState<Array<any>>([]);
  const [selected, setSelected] = useState("This week");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    (async () => {
      setLoading(true);
      let format, start, end, initialArray: any;
      switch (selected) {
        case "This week":
          format = "ddd";
          start = dayjs().startOf("week").format(DATE_FORMAT);
          end = dayjs().endOf("week").format(DATE_FORMAT);
          initialArray = initialDaysArray;
          break;

        case "Last week":
          format = "ddd";
          start = dayjs()
            .subtract(1, "week")
            .startOf("week")
            .format(DATE_FORMAT);
          end = dayjs().subtract(1, "week").endOf("week").format(DATE_FORMAT);
          initialArray = initialDaysArray;
          break;

        case "This month":
          format = "D";
          start = dayjs().startOf("month").format(DATE_FORMAT);
          end = dayjs().endOf("month").format(DATE_FORMAT);
          initialArray = Array.from(
            { length: dayjs().endOf("month").date() },
            (_, i) => ({
              day: i + 1,
              rupees: 0,
            })
          );
          break;

        case "Last month":
          format = "D";
          start = dayjs()
            .subtract(1, "month")
            .startOf("month")
            .format(DATE_FORMAT);
          end = dayjs().subtract(1, "month").endOf("month").format(DATE_FORMAT);
          initialArray = Array.from(
            { length: dayjs().endOf("month").date() },
            (_, i) => ({
              day: i + 1,
              rupees: 0,
            })
          );
          break;

        case "This year":
          format = "MMM";
          start = dayjs().startOf("year").format(DATE_FORMAT);
          end = dayjs().endOf("year").format(DATE_FORMAT);
          initialArray = initialMonthsArray;
          break;

        case "Last year":
          format = "MMM";
          start = dayjs()
            .subtract(1, "year")
            .startOf("year")
            .format(DATE_FORMAT);
          end = dayjs().subtract(1, "year").endOf("year").format(DATE_FORMAT);
          initialArray = initialMonthsArray;
          break;
      }
      const { data, error } = await supabase
        .from("expenses")
        .select("date, price, category:categories(name)")
        .eq("created_by", (await supabase.auth.getUser())?.data?.user?.id!)
        .gte("date", start)
        .lte("date", end);
      if (error) {
        throw error;
      }

      setExpenses(
        data.reduce(
          (acc: any[], expense: any) => {
            let date: string | number = dayjs(expense.date).format(format!);
            if (selected.includes("month")) {
              date = parseInt(date);
            }
            const index = acc.findIndex((item) => item.day === date);
            if (index === -1) {
              return acc.concat({ day: date, rupees: expense.price });
            }
            acc[index].rupees += expense.price;
            return acc;
          },
          initialArray?.map((e: any) => ({ ...e }))
        ) as any
      );

      const categories = new Set(
        data.map((expense: any) => expense.category.name)
      ).values();

      const pieExpenses = Array.from(categories).map((category: string) => {
        const rupees = data
          .filter((expense: any) => expense.category.name === category)
          .reduce((acc: number, expense: any) => acc + expense.price, 0);
        return { x: category, y: rupees, label: `${category}` };
      });
      setPieExpenses(pieExpenses);

      setLoading(false);
    })();
  }, [selected]);

  const totalWeekly = useMemo(
    () =>
      expenses
        .map((expense) => expense.rupees)
        .reduce((acc, rupees) => acc + rupees, 0),

    [expenses]
  );

  return (
    <>
      {loading && <Loader />}
      <div className="flex flex-col w-full h-[40vh]">
        <div className="flex gap-4 items-center">
          <h1 className="text-2xl font-bold mt-4">
            Total spendings: ₹{totalWeekly.toFixed(2)}
          </h1>

          <select
            className="select select-bordered w-2/5 ml-auto"
            onChange={(event) => {
              setSelected(event.target.value);
            }}
          >
            <option>This week</option>
            <option>Last week</option>
            <option>This month</option>
            <option>Last month</option>
            <option>This year</option>
            <option>Last year</option>
          </select>
        </div>

        {/* <ResponsiveBar
        data={expenses}
        keys={["rupees"]}
        theme={{
          text: { fill: "#fff" },
        }}
        colors={{ scheme: "nivo" }}
        indexBy="day"
        margin={{ top: 50, right: 50, bottom: 50, left: 60 }}
        padding={0.4}
        valueScale={{ type: "linear" }}
        animate={true}
        enableLabel={false}
        axisTop={null}
        axisRight={null}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "Rupees",
          legendPosition: "middle",
          legendOffset: -40,
        }}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: -45,
        }}
      /> */}

        <VictoryChart
          theme={VictoryTheme.material}
          // x axis rotated
          domainPadding={20}
        >
          <VictoryAxis
            style={{
              grid: { stroke: "#B3E5FC", strokeWidth: 0.25 },
            }}
            dependentAxis
          />
          <VictoryAxis
            style={{
              grid: { stroke: "#B3E5FC", strokeWidth: 0.25 },
              tickLabels: { angle: -40, padding: 10 },
            }}
          />
          <VictoryLine
            interpolation="natural"
            style={{
              data: { stroke: "#c43a31" },
              parent: { border: "1px solid #ccc" },
            }}
            data={expenses}
            x="day"
            y="rupees"
          />
        </VictoryChart>
      </div>

      <div className="flex flex-col w-full h-[40vh] mt-24">
        <h1 className="text-2xl font-bold mt-4">Spendings by Category</h1>
        <VictoryPie
          data={pieExpenses}
          padAngle={({ datum }) => datum.y}
          // innerRadius={100}
          colorScale={"heatmap"}
          style={{
            labels: {
              fill: "white",
            },
            parent: {
              padding: 20,
            },
          }}
        />
      </div>
    </>
  );
};

export default ThisWeek;
