import React from 'react';
import CardPieChart from "../../../components/Cards/cardPieChart";

interface Props {
    data: any;
    loading: boolean;
    handleStateChange: (lowValue: number, highValue: number) => void;
}

const VulnerabilityScoreRangeFilter: React.FC<Props> = ({ data, loading, handleStateChange }) => {
    const handleRangeChange = ({ chartWrapper, controlWrapper }: { chartWrapper: any, controlWrapper?: any }) => {
        const lowValue = controlWrapper?.getState().lowValue;
        const highValue = controlWrapper?.getState().highValue;
        handleStateChange(lowValue, highValue);
    };

    return (
        <div className="flex-col w-2/6">
            <CardPieChart
                data={data}
                fields={["Score", "Count", "Num"]}
                title={"Vulnerability Distribution by Score"}
                loading={loading}
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
                                callback: handleRangeChange
                            }
                        ]
                    },
                ]}
            />
        </div>
    );
};

export default VulnerabilityScoreRangeFilter;
