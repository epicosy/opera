import React from "react";
import { Chart } from "react-google-charts";
import { ApolloClient, gql, InMemoryCache } from "@apollo/client";


const fetchCWECounts = async () => {

  const client = new ApolloClient({
    uri: `http://localhost:3001/graphql`,
    cache: new InMemoryCache()
  });

  const { data } = await client.query({
    query: gql`
        query {
          counts {
            cwe
            count
          }
        }
        `
  })

  return data.counts
}

export const options = {
  pieHole: 0.40,
  is3D: false,
};

export default async function CardBarChart() {

  const cwe_counts = await fetchCWECounts()

  const data = cwe_counts.map((value) => {
      return [`CWE-${value.cwe}`, value.count]
  })
  data.unshift(["CWE", "Count"]);

  return (
    <>
      <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
        <div className="rounded-t mb-0 px-4 py-3 bg-transparent">
          <div className="flex flex-wrap items-center">
            <div className="relative w-full max-w-full flex-grow flex-1">
              <h6 className="uppercase text-gray-400 mb-1 text-xs font-semibold">
                Stats
              </h6>
              <h2 className="text-gray-700 text-xl font-semibold">
                CWE Distribution
              </h2>
            </div>
          </div>
        </div>
        <div className="p-4 flex-auto">
          {/* Chart */}
          <div className="relative h-350-px">
            <Chart chartType="PieChart" width="100%" height="100%" data={data} options={options}/>
          </div>
        </div>
      </div>
    </>
  );
}
