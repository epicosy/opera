import {ApolloClient, InMemoryCache, gql} from '@apollo/client';
import React, { useMemo, useRef, useState } from 'react';
import { Select, Spin, Tag } from 'antd';
import type { SelectProps } from 'antd/es/select';
import debounce from 'lodash.debounce';
import type { CustomTagProps } from 'rc-select/lib/BaseSelect';

const tagRender = (props: CustomTagProps) => {
    const { label, closable, onClose } = props;
    const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
        event.preventDefault();
        event.stopPropagation();
    };
    return (
        <Tag
            color="cyan"
            onMouseDown={onPreventMouseDown}
            closable={closable}
            onClose={onClose}
            style={{ marginRight: 3 }}
        >
            {label}
        </Tag>
    );
};

export interface DebounceSelectProps<ValueType = any>
    extends Omit<SelectProps<ValueType | ValueType[]>, 'options' | 'children'> {
    fetchOptions: (search: string) => Promise<ValueType[]>;
    debounceTimeout?: number;
}

export function DebounceSelect<
    ValueType extends { key?: string; label: React.ReactNode; value: string | number } = any,
>({ fetchOptions, debounceTimeout = 800, ...props }: DebounceSelectProps<ValueType>) {
    const [fetching, setFetching] = useState(false);
    const [options, setOptions] = useState<ValueType[]>([]);
    const fetchRef = useRef(0);

    const debounceFetcher = useMemo(() => {
        const loadOptions = (value: string) => {
            fetchRef.current += 1;
            const fetchId = fetchRef.current;
            setOptions([]);
            setFetching(true);

            fetchOptions(value).then((newOptions) => {
                if (fetchId !== fetchRef.current) {
                    // for fetch callback order
                    return;
                }

                setOptions(newOptions);
                setFetching(false);
            });
        };

        return debounce(loadOptions, debounceTimeout);
    }, [fetchOptions, debounceTimeout]);

    return (
        <Select
            labelInValue
            filterOption={true}
            onSearch={debounceFetcher}
            tagRender={tagRender}
            notFoundContent={fetching ? <Spin size="small" /> : null}
            {...props}
            options={options}
            allowClear={true}
            tokenSeparators={[',', " "]}
            mode="tags"
            placeholder="Search for vulnerabilities"
        />
    );
}

export interface VulnerabilityValue {
    label: string;
    value: string;
}

export const fetchVulnerability = async (keyword: string) => {
    const client = new ApolloClient({
        uri: `http://localhost:3001/graphql`,
        cache: new InMemoryCache()
    });

    const { data } = await client.query({
        query: gql`
            query SearchVulnerability($keyword: String!) {
                searchVulnerability(keyword: $keyword) {
                    id
                }
            }
        `,
        variables: { keyword },
    });

    const vulns: VulnerabilityValue[] = data.searchVulnerability.map(
        (vulnerability: { id: string }) => ({
            label: vulnerability.id,
            value: vulnerability.id
        }
    ));

    return vulns
}


