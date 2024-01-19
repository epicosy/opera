import { Tag, Tabs, Button, notification } from 'antd';
import { Commit } from '../typings';
import Link from "next/link";
import CodeRenderer from "./CodeRenderer";
import {useMutation, gql, ApolloClient, ApolloError, InMemoryCache} from '@apollo/client';

const client = new ApolloClient({
    uri: 'http://localhost:3001/graphql',
    cache: new InMemoryCache(),
});

interface CommitFilesAccordionProps {
    commits: Commit[];
}

const LOAD_FILE = gql`
    mutation LoadFile($id: String!) {
        loadFile(id: $id) {
            file{
                id
                content
                extension
            }
        }
    }
`;


const { TabPane } = Tabs;

const CommitFilesTabList: React.FC<CommitFilesAccordionProps> = ({ commits }) => {

    const [loadFile, { loading }] = useMutation(LOAD_FILE, { client });

    const handleLoadFile = async (id) => {
        try {
            const { data } = await loadFile({ variables: { id } });
            const file = data.loadFile.file;
            // Handle the loaded file data (e.g., display in a modal, update state, etc.)
            notification.success({ message: 'File Loaded Successfully' });
        } catch (error) {
            // TODO: improve error handling to display the error message received from the GraphQL server
            if (error instanceof ApolloError) {
                notification.error({ message: error.message });
            } else {
                notification.error({ message: "Failed to Load File" });
            }
        }
    };

    return (
        <Tabs>
            {commits.map((commit, index) => (
                <TabPane
                    tab={
                        <>
                            <Link
                                href={`http://localhost:3005/commits/${commit.id}`}
                                target="_blank"
                                className="text-blue-600 dark:text-blue-500 hover:underline"
                            >
                                {commit.id}{' '}
                            </Link>
                            <Tag color={commit.kind.toLowerCase().includes('patch') ? 'green' : 'grey'}>{commit.kind}</Tag>
                            {commit.available === true && <Tag color="cyan">Available</Tag>}
                            {commit.available === false && <Tag color="red">Unavailable</Tag>}
                        </>
                    }
                    key={index}
                    disabled={commit.available === false || commit.available === null}
                >
                    <Tabs>
                        {commit.files.map((file, fileIndex) => {
                            return (
                                <TabPane tab={file.filename} key={fileIndex}>
                                    {file.content ?
                                        (<CodeRenderer code={file.content} lang={file.extension} />) :
                                        (<Button type="primary" loading={loading} onClick={() => handleLoadFile(file.id)}
                                                 className="inline-flex items-center rounded-md bg-green-50 px-2 py-1
                                                 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20" >
                                            Load File
                                        </Button>)
                                    }
                                </TabPane>
                            );
                        })}
                    </Tabs>
                </TabPane>
            ))}
        </Tabs>
    );
};

export default CommitFilesTabList;
