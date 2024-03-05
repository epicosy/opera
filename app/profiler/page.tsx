'use client';
import React, {useCallback, useEffect, useState} from "react";

import "styles/tailwind.css";
import {GraphQLProvider} from "../../context/graphql";
import CardPieChart from "../../components/Cards/cardPieChart";
import {useMutation, useQuery} from "@apollo/client";
import {Checkbox, notification} from 'antd';
import {SearchOutlined} from "@ant-design/icons";
import CardStats from "../../components/Cards/CardStats";
import { Modal, Input } from 'antd';
import FloatingAddButton from "../../components/FloatingAddButton";
import CardBarChart from "../../components/Cards/CardBarChart";
import {CREATE_PROFILE, GET_PROFILE} from "../../src/graphql/queries/profile";


interface GrapheneCount {
    key: string;
    value: number;
}


interface YearFilter {
    startYear?: number;
    endYear?: number;
}

interface ChangesFilter {
    minChanges?: number;
    maxChanges?: number;
}

interface FilesFilter {
    minFiles?: number;
    maxFiles?: number;
}


type CheckboxOptions = {
    hasCode: boolean;
    hasExploit: boolean;
    hasAdvisory: boolean;
}

interface FilterOptions {
    cweIds?: number[];
    startYear?: number;
    endYear?: number;
    hasCode?: boolean;
    hasExploit?: boolean;
    hasAdvisory?: boolean;
    minChanges?: number;
    maxChanges?: number;
    minFiles?: number;
    maxFiles?: number;
    extensions?: string[];
}

interface AddModalProps {
    profileOptions: FilterOptions;
}


const AddModal: React.FC<AddModalProps> = ({ profileOptions }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [createProfile, { loading, error }] = useMutation(CREATE_PROFILE);

    if (error){
        console.log("Error creating profile: ", error);
    }

    const handleOk = () => {
        createProfile({ variables: { name: inputValue, ...profileOptions} })
            .then(() => {
                notification.success({
                    message: 'Success',
                    description: `Profile "${inputValue}" created successfully`
                });
                setIsModalVisible(false);
            })
            .catch((error) => {
                notification.error({
                    message: 'Error',
                    description: error.message
                });
            });
    };

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        // Close the modal without taking any action
        setIsModalVisible(false);
    };

    return (
        <>
            <FloatingAddButton onClick={showModal} />
            <Modal
                title="Enter Profile Name"
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                cancelButtonProps={{disabled: true, style: { display: 'none' }}}
                okButtonProps={{ style: { backgroundColor: '#042F2E'} }}
                okText="Create"
                width={300}
                style={{top: '70vh', right: '9vh', position: 'fixed',}}
            >
                <Input
                    placeholder="Profile Name" required={true}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                />
            </Modal>
        </>
    );
};



function ProfilerBody() {
    const [yearFilter, setYearFilter] = useState<YearFilter>();
    const [cweFilter, setCweFilter] = useState<Array<number>>([]);
    const [extensionsFilter, setExtensionsFilter] = useState<Array<string>>([]);
    const [changesFilter, setChangesFilter] = useState<ChangesFilter>();
    const [filesFilter, setFilesFilter] = useState<FilesFilter>();
    const [checkboxOptions, setCheckboxOptions] = useState<CheckboxOptions>({
        hasCode: false,
        hasExploit: false,
        hasAdvisory: false
    });

    // Apollo automatically handles re-fetching the query when variables change.
    const { data, loading, error, refetch } = useQuery(GET_PROFILE, {
        variables: {
            cweIds: cweFilter,
            startYear: yearFilter?.startYear,
            endYear: yearFilter?.endYear,
            hasCode: checkboxOptions.hasCode,
            hasExploit: checkboxOptions.hasExploit,
            hasAdvisory: checkboxOptions.hasAdvisory,
            minChanges: changesFilter?.minChanges,
            maxChanges: changesFilter?.maxChanges,
            minFiles: filesFilter?.minFiles,
            maxFiles: filesFilter?.maxFiles,
            extensions: extensionsFilter
        }
    });

    useEffect(() => {
        if (error) {
            console.log("Error fetching profile: ", error);
        }
    }, [error]);

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

    const changesCount = (data?.profileCount.changes || []).map((gc: GrapheneCount) => {
        const key = Number(gc.key);
        const value = gc.value;
        if (key <= 100) {
            return { key, value };
        }
        return null; // Skip this entry
    }).filter(Boolean);

    const filesCount = (data?.profileCount.files || []).map((gc: GrapheneCount) => {
        const key = Number(gc.key);
        const value = gc.value;
        if (key <= 20) {
            return { key, value };
        }
        return null; // Skip this entry
    }).filter(Boolean);

    const extensionsCount = (data?.profileCount.extensions || []).map((gc: GrapheneCount) => {
        return {
            key: gc.key,
            value: gc.value
        }
    }) || [];

    // find the minimum and maximum number of changes in changesCount, by the key value
    const minChanges = Math.min(...changesCount.map((gc: GrapheneCount) => gc.key)) || 0;
    const maxChanges = Math.max(...changesCount.map((gc: GrapheneCount) => gc.key)) || 0;


    const minFiles = Math.min(...filesCount.map((gc: GrapheneCount) => gc.key)) || 0;
    const maxFiles = Math.max(...filesCount.map((gc: GrapheneCount) => gc.key)) || 0;

    const handleCweFilterChange = (newFilter: Array<number>) => {
        setCweFilter(newFilter);
    };

    const handleYearFilterChange = (startYear: number, endYear: number) => {
        setYearFilter({ startYear, endYear });
    };

    const handleChangesFilterChange = (minChanges: number, maxChanges: number) => {
        setChangesFilter({ minChanges, maxChanges });
    }

    const handleFilesFilterChange = (minFiles: number, maxFiles: number) => {
        setFilesFilter({ minFiles, maxFiles });
    }

    const handleExtensionsFilterChange = (newFilter: Array<string>) => {
        setExtensionsFilter(newFilter);
    }

    const handleHasOptionsChange = (checkedValues: Array<string>) => {
        setCheckboxOptions({
            hasCode: checkedValues.includes('hasCode'),
            hasExploit: checkedValues.includes('hasExploit'),
            hasAdvisory: checkedValues.includes('hasAdvisory')
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
                                  fields={["Year", "Count", "Date"]} loading={loading}
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
                                  loading={loading}
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
                    <CardPieChart data={vulnsByExploitabilityData} fields={["Score", "Count", "Num"]}
                                  title="Vulnerability Distribution by Exploitability" loading={loading}
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
                                                        console.log("State changed to", controlWrapper?.getState().lowValue);
                                                        console.log("State changed to", controlWrapper?.getState().highValue);
                                                    }
                                                }
                                            ]
                                      },
                                  ]}
                    />
                </div>
            </div>
            {checkboxOptions.hasCode  ? (
            <div className="flex flex-row">
                <div className="flex-col w-2/6 mr-2">
                    <CardBarChart data={changesCount} fields={['Changes', 'Count']} loading={loading}
                                  title="Distribution of number of changes per commit (<100)"
                                  controls={[
                                      {
                                          controlType: "NumberRangeFilter",
                                          options: {
                                              filterColumnLabel: "Changes",
                                              minValue: minChanges,
                                              maxValue: maxChanges,
                                          },
                                          controlEvents: [
                                              {
                                                  eventName: "statechange",
                                                  callback: ({ chartWrapper, controlWrapper , google}) => {
                                                      const lowValue = controlWrapper?.getState().lowValue;
                                                      const highValue = controlWrapper?.getState().highValue;
                                                      handleChangesFilterChange(lowValue, highValue);
                                                  }
                                              }
                                          ]
                                      }
                                  ]}
                    />
                </div>
                <div className="flex-col w-2/6 mr-2">
                    <CardBarChart data={filesCount} fields={['Files', 'Count']} loading={loading}
                                  title="Distribution of number of files per commit (<20)"
                                  controls={[
                                      {
                                          controlType: "NumberRangeFilter",
                                          options: {
                                              filterColumnLabel: "Files",
                                              minValue: minFiles,
                                              maxValue: maxFiles,
                                          },
                                          controlEvents: [
                                              {
                                                  eventName: "statechange",
                                                  callback: ({ chartWrapper, controlWrapper , google}) => {
                                                      const lowValue = controlWrapper?.getState().lowValue;
                                                      const highValue = controlWrapper?.getState().highValue;
                                                      handleFilesFilterChange(lowValue, highValue);
                                                  }
                                              }
                                          ]
                                      }
                                  ]}
                    />
                </div>
                <div className="flex-col w-2/6 mr-2">
                    <CardPieChart data={extensionsCount} fields={["Extension", "Count"]} loading={loading}
                                  title="Distribution of files by extension"
                                  controls={[
                                      {
                                          controlEvents: [
                                              {
                                                  eventName: "statechange",
                                                  callback: ({ chartWrapper, controlWrapper }) => {
                                                      // convert selected values to array of numbers
                                                      const selectedValues = controlWrapper?.getState().selectedValues;
                                                      handleExtensionsFilterChange(selectedValues);
                                                  }
                                              }
                                          ],
                                          controlType: "CategoryFilter",
                                          options: {
                                              filterColumnLabel: "Extension",
                                              ui: {
                                                  labelStacking: "horizontal",
                                                  label: "Extension Selection:",
                                                  allowTyping: false,
                                                  allowMultiple: true,
                                              },
                                          },
                                      },
                                  ]}
                    />
                </div>
            </div>)
            : null}
            <AddModal profileOptions={{startYear: yearFilter?.startYear, endYear: yearFilter?.endYear,
                cweIds: cweFilter, hasCode: checkboxOptions.hasCode, hasExploit: checkboxOptions.hasExploit,
                hasAdvisory: checkboxOptions.hasAdvisory, minChanges: changesFilter?.minChanges, extensions: extensionsFilter,
                maxChanges: changesFilter?.maxChanges, minFiles: filesFilter?.minFiles, maxFiles: filesFilter?.maxFiles,
            }} />
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