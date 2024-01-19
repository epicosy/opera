import { useState } from 'react';
import { Select, Button, notification } from 'antd';
import {useQuery, useMutation, gql, ApolloClient, InMemoryCache} from '@apollo/client';
import { Repository } from '../../typings';
import {Callback} from "escalade";


const client = new ApolloClient({
    uri: 'http://localhost:3001/graphql',
    cache: new InMemoryCache(),
});


const FETCH_SOFTWARE_TYPES = gql`
    query FetchSoftwareTypes {
        productTypes {
            id
            name
        }
    }
`;

const EDIT_SOFTWARE_TYPE = gql`
    mutation EditSoftwareType($id: String!, $softwareTypeId: Int!) {
        repositorySoftwareType(id: $id, softwareTypeId: $softwareTypeId) {
            repository {
                softwareType
            }
        }
    }
`;

const SoftwareTypeComponent: React.FC<{ repo: Repository}> = ({ repo}) => {
    const [editable, setEditable] = useState<boolean>(true);
    const [selectedType, setSelectedType] = useState<string>(repo.softwareType);
    const [repoState, setRepo] = useState<Repository>(repo);

    const { loading, error, data } = useQuery(FETCH_SOFTWARE_TYPES, { client });
    const [editSoftwareType] = useMutation(EDIT_SOFTWARE_TYPE, { client });

    const softwareTypes = data?.productTypes || [];

    const handleTypeChange = (value: string) => {
        setSelectedType(value);
    };

    const handleSaveClick = async () => {
        try {
            const { data } = await editSoftwareType({
                variables: {
                    id: repo.id,
                    softwareTypeId: selectedType,
                },
            });

            // Update the software type in the local repo object
            const updatedRepo = {
                ...repoState,
                softwareType: data.repositorySoftwareType.repository.softwareType,
            };
            setRepo(updatedRepo);

            // Show success notification
            notification.success({
                message: 'Software Type Updated',
                description: 'The software type has been successfully updated.',
            });
        } catch (error) {
            // Show error notification
            notification.error({
                message: 'Error',
                description: `An error occurred while updating the software type: ${error.message}.`,
            });
        }

        setEditable(false);
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error.message}</p>;
    }

    return (
        <>
            <h5 className="mb-2 ml-2 text-md font-bold tracking-tight text-gray-900 dark:text-white">
                Software Type: {editable ? (
                <Select value={selectedType} onChange={handleTypeChange} loading={loading}>
                    {softwareTypes.map((type: { id: string; name: string }) => (
                        <Select.Option key={type.id} value={type.id}>
                            {type.name}
                        </Select.Option>
                    ))}
                </Select>
            ) : (
                <>
                    {repoState.softwareType}
                </>
            )}
            </h5>

            {editable && (
                <Button type="primary" className="ml-2" onClick={handleSaveClick}>
                    Save
                </Button>
            )}
        </>
    );
};


export default SoftwareTypeComponent;
