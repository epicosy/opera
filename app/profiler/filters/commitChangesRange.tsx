import React from 'react';
import CardBarChart from "../../../components/Cards/CardBarChart";

interface Props {
    data: any;
    loading: boolean;
    minChanges: number;
    maxChanges: number;
    handleFilterChange: (lowValue: number, highValue: number) => void;
}

const CommitChangesRangeFilter: React.FC<Props> = ({ data, loading, minChanges, maxChanges, handleFilterChange }) => {
    const handleRangeChange = ({ chartWrapper, controlWrapper }: { chartWrapper: any, controlWrapper?: any }) => {
        const lowValue = controlWrapper?.getState().lowValue;
        const highValue = controlWrapper?.getState().highValue;
        handleFilterChange(lowValue, highValue);
    };

    return (
        <div className="flex-col w-2/6 mr-2">
            <CardBarChart
                data={data}
                fields={['Changes', 'Count']}
                title={"Distribution of number of changes per commit (<100)"}
                loading={loading}
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
                                callback: handleRangeChange
                            }
                        ]
                    },
                ]}
            />
        </div>
    );
};

export default CommitChangesRangeFilter;
