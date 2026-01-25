import { ResponsiveRadar } from "@nivo/radar";

interface RatingRadarProps {
  scores: Map<string, number>;
}

export function RatingRadar({ scores }: RatingRadarProps) {
  const toTitleCase = (s: string) => {
    return s.charAt(0).toUpperCase() + s.slice(1);
  };

  const data = Array.from(scores.entries()).map(([key, value]) => ({
    category: toTitleCase(key),
    score: value,
  }));

  return (
    <div className="h-[200px] w-[260px]">
      <ResponsiveRadar
        data={data}
        keys={["score"]}
        indexBy="category"
        maxValue={10}
        margin={{ top: 20, right: 70, bottom: 20, left: 70 }}
        gridLabelOffset={6}
        gridLevels={5}
        gridShape="circular"
        curve="cardinalClosed"
        dotSize={6}
        dotColor={{ from: "color" }}
        dotBorderWidth={1}
        dotBorderColor={{ from: "color", modifiers: [["darker", 0.3]] }}
        colors={["#6283c0"]}
        fillOpacity={0.25}
        borderWidth={2}
        borderColor={{ from: "color" }}
        enableDotLabel={false}
        theme={{
          text: {
            fontFamily: "Raleway",
            fontSize: 11,
          },
        }}
      />
    </div>
  );
}
