import React from 'react';
import CardPieChart from "../../../components/Cards/cardPieChart";

interface Props {
    data: any;
    loading: boolean;
    handleCweFilterChange: (selectedValues: number[]) => void;
}

const VulnerabilityCWEFilter: React.FC<Props> = ({ data, loading, handleCweFilterChange }) => {
    const handleStateChange = ({ chartWrapper, controlWrapper, props }: { chartWrapper: any, controlWrapper?: any, props: any }) => {
        const selectedValues = controlWrapper?.getState().selectedValues.map((v: string) => parseInt(v));
        handleCweFilterChange(selectedValues);
    };

    return (
        <div className="flex-col w-2/6 mr-2">
            <CardPieChart
                data={data}
                fields={["CWE", "Count"]}
                title={"Vulnerability Distribution by CWE"}
                loading={loading}
                controls={[
                    {
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

export default VulnerabilityCWEFilter;
