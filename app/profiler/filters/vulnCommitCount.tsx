import React from 'react';
import CardPieChart from "../../../components/Cards/cardPieChart";

interface Props {
    data: any;
    loading: boolean;
    handleFilterChange: (select: number) => void;
}

const VulnerabilityCommitCountSelect: React.FC<Props> = ({ data, loading, handleFilterChange }) => {
    const handleStateChange = ({ chartWrapper, controlWrapper, props }:
                                   { chartWrapper: any, controlWrapper?: any, props: any }) => {
        const selectedValues = controlWrapper?.getState().selectedValues.map((v: string) => parseInt(v))
        handleFilterChange(selectedValues[0]);
    };

    return (
        <div className="flex-col w-2/6 mr-2">
            <CardPieChart
                data={data}
                fields={["Patch Count", "Occurrence"]}
                title={"Vulnerability Distribution by Patch Count"}
                loading={loading}
                controls={[
                    {
                        controlType: "CategoryFilter",
                        options: {
                            filterColumnLabel: "Patch Count",
                            ui: {
                                labelStacking: "horizontal",
                                label: "Patch Count Selection:",
                                allowTyping: false,
                                allowMultiple: false,
                            },
                        },
                        controlEvents: [
                            {
                                eventName: "statechange",
                                callback: handleStateChange
                            }
                        ]
                    },
                ]}
            />
        </div>
    );
};

export default VulnerabilityCommitCountSelect;
