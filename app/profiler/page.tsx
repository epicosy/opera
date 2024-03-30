'use client';
import React, {useEffect, useState} from "react";

import "styles/tailwind.css";
import {GraphQLProvider} from "../../context/graphql";
import {useMutation, useQuery} from "@apollo/client";
import {Checkbox, notification} from 'antd';
import {SearchOutlined} from "@ant-design/icons";
import CardStats from "../../components/Cards/CardStats";
import { Modal, Input } from 'antd';
import FloatingAddButton from "../../components/FloatingAddButton";
import {CREATE_PROFILE, GET_PROFILE} from "../../src/graphql/queries/profile";
import VulnerabilityCWEFilter from "./filters/vulnCWEDist";
import BFClassSelect from "./filters/bfClassSelect";
import RepositoryLanguageSelect from "./filters/repoLangSelect";
import CommitChangesRangeFilter from "./filters/commitChangesRange";
import VulnerabilityCommitCountSelect from "./filters/vulnCommitCount";
import CommitFilesRangeFilter from "./filters/commitFilesRange";
import CommitFileExtensionRangeFilter from "./filters/commitFileExtRange";
import CommitFileDiffBlockCountSelect from "./filters/commitFileDiffBlockCount";


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
    hasExploit: boolean;
    hasAdvisory: boolean;
}

interface FilterOptions {
    cweIds?: number[];
    bfClass?: string;
    hasExploit?: boolean;
    hasAdvisory?: boolean;
    patchCount?: number;
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
    const [bfClassFilter, setBFClassFilter] = useState<string>();
    const [patchCountFilter, setPatchCountFilter] = useState<number>();
    const [singleFile, setSingleFile] = useState<boolean>();
    const [repoLangFilter, setrepoLangFilter] = useState<string>();
    const [cweFilter, setCweFilter] = useState<Array<number>>([]);
    const [extensionsFilter, setExtensionsFilter] = useState<Array<string>>([]);
    const [changesFilter, setChangesFilter] = useState<ChangesFilter>();
    const [filesFilter, setFilesFilter] = useState<FilesFilter>();
    const [checkboxOptions, setCheckboxOptions] = useState<CheckboxOptions>({
        hasExploit: false,
        hasAdvisory: false
    });

    // Apollo automatically handles re-fetching the query when variables change.
    const { data, loading, error, refetch } = useQuery(GET_PROFILE, {
        variables: {
            bfClass: bfClassFilter,
            cweIds: cweFilter,
            language: repoLangFilter,
            hasExploit: checkboxOptions.hasExploit,
            hasAdvisory: checkboxOptions.hasAdvisory,
            patchCount: patchCountFilter,
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

    const vulnsByBFClass = data?.profileCount.classes.map((gc: GrapheneCount) => {
        return {
            key: gc.key,
            value: gc.value
        }
    }) || [];

    const vulnsByCWE = data?.profileCount.cwe.map((gc: GrapheneCount) => {
        return {
            key: gc.key,
            value: gc.value
        }
    }) || [];


    const repoLangs = data?.profileCount.languages.map((gc: GrapheneCount) => {
        return {
            key: gc.key,
            value: gc.value
        }
    }) || [];

    const patchCount = (data?.profileCount.patches || []).map((gc: GrapheneCount) => {
        return {
            key: gc.key,
            value: gc.value
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

    const diffBlocksCount = (data?.profileCount.diffBlocks || []).map((gc: GrapheneCount) => {
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

    const handleBFClassFilterChange = (select: string) => {
        setBFClassFilter(select);
    }

    const handlePatchCountChange = (select: number) => {
        setPatchCountFilter(select);
    }

    const handleRepoLangFilterChange = (select: string) => {
        setrepoLangFilter(select);
    }

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
            hasExploit: checkedValues.includes('hasExploit'),
            hasAdvisory: checkedValues.includes('hasAdvisory')
        });
    };

    const handleHasCommitOptionsChange = (checkedValues: Array<string>) => {
        setSingleFile(checkedValues.includes('singleFile'));
        if (checkedValues.includes('singleFile')) {
            setFilesFilter({ minFiles: 1, maxFiles: 1 });
        } else {
            setFilesFilter({ minFiles: minFiles, maxFiles: maxFiles });
        }
    }

    return (
        <div>
            <div className="flex flex-row mb-3">
                <div className="flex-col w-2/6 mr-2">
                    <div className="flex flex-row mr-2">
                        <div key='total' className="flex w-6/12">
                            <CardStats
                                statSubtitle='Total'
                                statTitle={data?.profileCount.total}
                                icon={<SearchOutlined className="text-xl" />}
                                statIconColor='bg-teal-500'
                            />
                        </div>
                        <div key='checkbox' className="flex w-full bg-white shadow-lg items-center px-2">
                            <Checkbox.Group onChange={handleHasOptionsChange} className="inline-block">
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
                <div className="flex-col w-2/6">
                    <div key='checkbox' className="flex w-full h-full bg-white shadow-lg items-center px-2">
                        <Checkbox.Group onChange={handleHasCommitOptionsChange} className="inline-block">
                            <Checkbox value="singleFile" className="text-base font-semibold text-blueGray-700">
                                Single File
                            </Checkbox>
                        </Checkbox.Group>
                    </div>
                </div>
            </div>
            <div className="flex flex-row">
                <BFClassSelect loading={loading} data={vulnsByBFClass} handleFilterChange={handleBFClassFilterChange} />
                <VulnerabilityCWEFilter data={vulnsByCWE} loading={loading}
                                        handleCweFilterChange={handleCweFilterChange} />
                <RepositoryLanguageSelect data={repoLangs} loading={loading}
                                         handleFilterChange={handleRepoLangFilterChange} />
            </div>
            <div className="flex flex-row">
                <VulnerabilityCommitCountSelect data={patchCount} loading={loading}
                                                handleFilterChange={handlePatchCountChange} />
                <CommitChangesRangeFilter loading={loading} data={changesCount} minChanges={minChanges}
                                            maxChanges={maxChanges} handleFilterChange={handleChangesFilterChange} />
                <CommitFilesRangeFilter loading={loading} data={filesCount} minFiles={minFiles}
                                        maxFiles={maxFiles} handleFilesFilterChange={handleFilesFilterChange} />
            </div>
            <div className="flex flex-row">
                    <CommitFileExtensionRangeFilter data={extensionsCount} loading={loading}
                                                    handleExtensionsFilterChange={handleExtensionsFilterChange} />
                    <CommitFileDiffBlockCountSelect data={diffBlocksCount} loading={loading}
                                                    handleFilterChange={() => {}} />
            </div>

            <AddModal profileOptions={{bfClass: bfClassFilter, cweIds: cweFilter, hasExploit: checkboxOptions.hasExploit,
                hasAdvisory: checkboxOptions.hasAdvisory, patchCount: patchCount, minChanges: changesFilter?.minChanges,
                extensions: extensionsFilter, maxChanges: changesFilter?.maxChanges, minFiles: filesFilter?.minFiles,
                maxFiles: filesFilter?.maxFiles,
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