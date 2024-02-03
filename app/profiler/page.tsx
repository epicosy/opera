'use client';
import React, {useState} from "react";

import "styles/tailwind.css";
import {GraphQLProvider} from "../../context/graphql";
import CardPieChart from "../../components/Cards/cardPieChart";
import {VULNS_BY_CWE, VULNS_BY_YEAR_QUERY, VULNS_BY_EXPLOITABILITY, GET_PROFILE} from "../../src/graphql/queries";
import {useQuery} from "@apollo/client";
import { Checkbox } from 'antd';
import type { GetProp } from 'antd';
import {SearchOutlined} from "@ant-design/icons";
import CardStats from "../../components/Cards/CardStats";

interface GrapheneCount {
    key: string;
    value: number;
}


interface YearFilter {
    startYear?: number;
    endYear?: number;
}

type CheckboxOptions = {
    hasCode: boolean;
    hasExploit: boolean;
    hasAdvisory: boolean;
}


function ProfilerBody() {
    const [yearFilter, setYearFilter] = useState<YearFilter>();
    const [cweFilter, setCweFilter] = useState<Array<number>>([]);
    const [checkboxOptions, setCheckboxOptions] = useState<CheckboxOptions>({
        hasCode: false,
        hasExploit: false,
        hasAdvisory: false
    });
    const { data, loading, error, refetch } = useQuery(GET_PROFILE, {
        variables: {
            cweIds: cweFilter,
            startYear: yearFilter?.startYear,
            endYear: yearFilter?.endYear,
            hasCode: checkboxOptions.hasCode,
            hasExploit: checkboxOptions.hasExploit,
            hasAdvisory: checkboxOptions.hasAdvisory
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

    const handleHasOptionsChange: GetProp<typeof Checkbox.Group, 'onChange'> = (checkedValues) => {
        setCheckboxOptions({
            hasCode: checkedValues.includes('hasCode'),
            hasExploit: checkedValues.includes('hasExploit'),
            hasAdvisory: checkedValues.includes('hasAdvisory')
        });

        refetch({ hasCode: checkboxOptions.hasCode,  hasExploit: checkboxOptions.hasExploit,
            hasAdvisory: checkboxOptions.hasExploit })
            .then((result) => {
                console.log('Refetch successful', result);
            })
            .catch((error) => {
                console.error('Refetch error', error);
            });
    };

    return (
        <div>
            <div className="flex flex-row mb-3">
                <div className="flex-col w-2/6">
                    <div className="flex flex-row">
                        <div key='total' className="flex w-6/12">
                            <CardStats
                                statSubtitle='Total'
                                statTitle={data?.profileCount.total}
                                icon={<SearchOutlined className="text-xl" />}
                                statIconColor='bg-teal-500'
                            />
                        </div>
                        <div key='checkbox' className="flex w-full bg-white shadow-lg items-center">
                            <Checkbox.Group onChange={handleHasOptionsChange} className="pl-2 inline-block">
                                <Checkbox value="hasCode" className="text-base font-semibold text-blueGray-700">
                                    Has Code
                                </Checkbox>
                                <Checkbox value="hasExploit" className="text-base font-semibold text-blueGray-700">
                                    Has Exploit
                                </Checkbox>
                                <Checkbox value="hasAdvisory" className="text-base font-semibold text-blueGray-700">
                                    Has Advisory
                                </Checkbox>
                            </Checkbox.Group>
                        </div>
                    </div>
                </div>
            </div>
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