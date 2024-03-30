import React from 'react';
import CardBarChart from "../../../components/Cards/CardBarChart";

interface Props {
    data: any;
    loading: boolean;
    minFiles: number;
    maxFiles: number;
    handleFilesFilterChange: (lowValue: number, highValue: number) => void;
}

const CommitFilesRangeFilter: React.FC<Props> = ({ data, loading, minFiles, maxFiles, handleFilesFilterChange }) => {
    const handleRangeChange = ({ chartWrapper, controlWrapper }: { chartWrapper: any, controlWrapper?: any }) => {
        const lowValue = controlWrapper?.getState().lowValue;
        const highValue = controlWrapper?.getState().highValue;
        handleFilesFilterChange(lowValue, highValue);
    };

    return (
        <div className="flex-col w-2/6 mr-2">
            <CardBarChart
                data={data}
                fields={['Files', 'Count']}
                title={"Distribution of number of files per commit (<20)"}
                loading={loading}
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
                                callback: handleRangeChange
                            }
                        ]
                    },
                ]}
            />
        </div>
    );
};

export default CommitFilesRangeFilter;
