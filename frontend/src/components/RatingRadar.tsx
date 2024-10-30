import "../styles/radar.css";

import Radar from "react-d3-radar";

interface RatingRadarProps {
  scores: Map<string, number>;
}

export function RatingRadar({ scores }: RatingRadarProps) {
  const toTitleCase = (s: string) => {
    return s.charAt(0).toUpperCase() + s.slice(1);
  };
  const variables = Array.from(scores.keys()).map((key) => {
    return { key: key, label: toTitleCase(key) };
  });
  console.log("variables", variables);
  const values = Object.fromEntries(scores);
  console.log("values", values);

  return (
    <div className="radar-chart mx-auto block h-32 w-32">
      <Radar
        width={100}
        height={100}
        padding={0}
        domainMax={10}
        style={{
          numRings: 5,
        }}
        data={{
          variables: variables,
          sets: [
            {
              key: "me",
              label: "My Scores",
              values: values,
            },
          ],
        }}
      />
    </div>
  );
}
