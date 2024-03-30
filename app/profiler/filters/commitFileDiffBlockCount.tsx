import React from 'react';
import CardPieChart from "../../../components/Cards/cardPieChart";

interface Props {
    data: any;
    loading: boolean;
    handleFilterChange: (select: number) => void;
}

const CommitFileDiffBlockCountSelect: React.FC<Props> = ({ data, loading, handleFilterChange }) => {
    const handleStateChange = ({ chartWrapper, controlWrapper, props }:
                                   { chartWrapper: any, controlWrapper?: any, props: any }) => {
        const selectedValues = controlWrapper?.getState().selectedValues.map((v: string) => parseInt(v))
        handleFilterChange(selectedValues[0]);
    };

    return (
        <div className="flex-col w-2/6 mr-2">
            <CardPieChart
                data={data}
                fields={["Diff Block Count", "Occurrence"]}
                title={"Distribution of Diff Blocks per Commit File"}
                loading={loading}
                controls={[
                    {
                        controlType: "CategoryFilter",
                        options: {
                            filterColumnLabel: "Diff Block Count",
                            ui: {
                                labelStacking: "horizontal",
                                label: "Distribution of Diff Blocks per Commit File",
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

export default CommitFileDiffBlockCountSelect;
