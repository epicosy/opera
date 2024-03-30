import React from 'react';
import CardPieChart from "../../../components/Cards/cardPieChart";

interface Props {
    data: any;
    loading: boolean;
    handleExtensionsFilterChange: (selectedValues: string[]) => void;
}

const CommitFileExtensionRangeFilter: React.FC<Props> = ({ data, loading, handleExtensionsFilterChange }) => {
    const handleStateChange = ({ chartWrapper, controlWrapper }: { chartWrapper: any, controlWrapper?: any }) => {
        const selectedValues = controlWrapper?.getState().selectedValues;
        handleExtensionsFilterChange(selectedValues);
    };

    return (
        <div className="flex-col w-2/6 mr-2">
            <CardPieChart
                data={data}
                fields={["Extension", "Count"]}
                title={"Distribution of files by extension"}
                loading={loading}
                controls={[
                    {
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

export default CommitFileExtensionRangeFilter;
