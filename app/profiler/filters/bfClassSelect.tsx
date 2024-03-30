import React from 'react';
import CardPieChart from "../../../components/Cards/cardPieChart";

interface Props {
    data: any;
    loading: boolean;
    handleFilterChange: (select: string) => void;
}

const BFClassSelect: React.FC<Props> = ({ data, loading, handleFilterChange }) => {
    const handleStateChange = ({ chartWrapper, controlWrapper, props }:
                                   { chartWrapper: any, controlWrapper?: any, props: any }) => {
        handleFilterChange(controlWrapper?.getState().selectedValues[0]);
    };

    return (
        <div className="flex-col w-2/6 mr-2">
            <CardPieChart
                data={data}
                fields={["BF Class", "Count"]}
                title={"Vulnerability Distribution by BF Class"}
                loading={loading}
                controls={[
                    {
                        controlType: "CategoryFilter",
                        options: {
                            filterColumnLabel: "BF Class",
                            ui: {
                                labelStacking: "horizontal",
                                label: "BF Class Selection:",
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

export default BFClassSelect;
