import React from 'react';
import CardPieChart from "../../../components/Cards/cardPieChart";


interface Props {
    vulnsByYearDate: any;
    loading: boolean;
    handleYearFilterChange: (startYear: number, endYear: number) => void;
}


const VulnerabilityDateRangeFilter: React.FC<Props> = ({ vulnsByYearDate, loading, handleYearFilterChange }) => {
    const handleStateChange = ({ chartWrapper, controlWrapper, props }: { chartWrapper: any, controlWrapper?: any, props: any }) => {
        // Extract the year from the dates
        const startYear = controlWrapper?.getState().lowValue.getFullYear();
        const endYear = controlWrapper?.getState().highValue.getFullYear();
        handleYearFilterChange(startYear, endYear);
    };

    return (
        <div className="flex-col w-2/6 mr-2">
            <CardPieChart
                data={vulnsByYearDate}
                title="Vulnerability Distribution by Year"
                fields={["Year", "Count", "Date"]}
                loading={loading}
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
                                callback: handleStateChange
                            }
                        ]
                    },
                ]}
            />
        </div>
    );
};

export default VulnerabilityDateRangeFilter;
