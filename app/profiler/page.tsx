'use client';
import React, {useState} from "react";

import "styles/tailwind.css";
import {GraphQLProvider} from "../../context/graphql";
import CardPieChart from "../../components/Cards/cardPieChart";
import {VULNS_BY_CWE, VULNS_BY_YEAR_QUERY, VULNS_BY_EXPLOITABILITY, GET_PROFILE} from "../../src/graphql/queries";
import {useQuery} from "@apollo/client";

interface GrapheneCount {
    key: string;
    value: number;
}


interface YearFilter {
    startYear?: number;
    endYear?: number;
}




function ProfilerBody() {
    const [yearFilter, setYearFilter] = useState<YearFilter>();
    const [cweFilter, setCweFilter] = useState<Array<number>>([]);
    const { data, loading, error, refetch } = useQuery(GET_PROFILE, {
        variables: {
            cweIds: cweFilter,
            startYear: yearFilter?.startYear,
            endYear: yearFilter?.endYear
        }
    });

    if (loading) return <p>Loading...</p>;

    if (error){
        console.log("Error fetching profile : ", error);
    }

    const vulnsByYearDate = data?.profileCount.year.map((gc: GrapheneCount) => {
        return {
            key: gc.key,
            value: gc.value,
            Date: new Date(gc.key)
        }
    }) || [];

    const vulnsByCWE = data?.profileCount.cwe.map((gc: GrapheneCount) => {
        return {
            key: gc.key,
            value: gc.value
        }
    }) || [];

    const vulnsByExploitabilityData = data?.profileCount.score.map((gc: GrapheneCount) => {
        return {
            key: gc.key,
            value: gc.value,
            score: Number(gc.key)
        }
    }) || [];

    console.log("Total: ", data?.profileCount.total)

    const handleCweFilterChange = (newFilter: Array<number>) => {
        setCweFilter(newFilter);

        refetch({ cweIds: newFilter })
            .then((result) => {
                // Handle successful refetch
                console.log('Refetch successful', result);
            })
            .catch((error) => {
                // Handle refetch error
                console.error('Refetch error', error);
            });
    };

    const handleYearFilterChange = (startYear: number, endYear: number) => {
        setYearFilter({ startYear: startYear, endYear: endYear });

        refetch({ startYear: startYear, endYear: endYear })
            .then((result) => {
                // Handle successful refetch
                console.log('Refetch successful', result);
            })
            .catch((error) => {
                // Handle refetch error
                console.error('Refetch error', error);
            });
    }

    return (
        <div className="flex flex-row">
            <div className="flex-col w-2/6 mr-2">
                <CardPieChart data={vulnsByYearDate} title="Vulnerability Distribution by Year"
                              fields={["Year", "Count", "Date"]}
                              controls={[
                                  {
                                      controlType: "DateRangeFilter",
                                      options: {
                                          filterColumnLabel: "Date",
                                          ui: { format: { pattern: "yyyy" } },
                                      },
                                        controlEvents: [
                                            {
                                                eventName: "statechange",
                                                callback: ({ chartWrapper, controlWrapper }) => {
                                                    // extract the year from the dates
                                                    const startYear = controlWrapper?.getState().lowValue.getFullYear();
                                                    const endYear = controlWrapper?.getState().highValue.getFullYear();
                                                    handleYearFilterChange(startYear, endYear);
                                                }
                                            }
                                        ]
                                  },
                              ]}
                />
            </div>
            <div className="flex-col w-2/6 mr-2">
                <CardPieChart data={vulnsByCWE} fields={["CWE", "Count"]} title="Vulnerability Distribution by CWE"
                              controls={[
                                  {
                                      controlEvents: [
                                          {
                                              eventName: "statechange",
                                              callback: ({ chartWrapper, controlWrapper }) => {
                                                  // convert selected values to array of numbers
                                                  const selectedValues = controlWrapper?.getState().selectedValues.map((v: string) => parseInt(v));
                                                  handleCweFilterChange(selectedValues);
                                              }
                                          }
                                      ],
                                      controlType: "CategoryFilter",
                                      options: {
                                          filterColumnLabel: "CWE",
                                          ui: {
                                              labelStacking: "horizontal",
                                              label: "CWE Selection:",
                                              allowTyping: false,
                                              allowMultiple: true,
                                          },
                                      },
                                  },
                              ]}
                />
            </div>
            <div className="flex-col w-2/6">
                <CardPieChart data={vulnsByExploitabilityData} fields={["Score", "Count", "Num"]} title="Vulnerability Distribution by Exploitability"
                              controls={[
                                  {
                                      controlType: "NumberRangeFilter",
                                      options: {
                                          filterColumnLabel: "Num",
                                          minValue: 0,
                                          maxValue: 10,
                                      },
                                      controlEvents: [
                                            {
                                                eventName: "statechange",
                                                callback: ({ chartWrapper, controlWrapper , google}) => {
                                                    console.log("State changed to", controlWrapper?.getState().getSelection());
                                                }
                                            }
                                        ]
                                  },
                              ]}
                />
            </div>
            </div>
    );
}


export default function Profiler() {
    const graphqlUri = process.env.GRAPHQL_API || 'http://localhost:4000/graphql';

    let defaultHeaders: Record<string, any > = {
        'client-name': 'opera',
        'client-version': process.env.npm_package_version || ''
    };

    return (
        <>
            <div className="flex flex-wrap mt-4">
                <div className="w-full mb-12 px-4">
                    <GraphQLProvider uri={graphqlUri} headers={defaultHeaders}>
                        <ProfilerBody/>
                    </GraphQLProvider>
                </div>
            </div>
        </>
    )
}