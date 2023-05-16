import { Tag, Tabs } from 'antd';
import { Commit } from '../typings';
import Link from "next/link";
import CodeRenderer from "./CodeRenderer";

interface CommitFilesAccordionProps {
    commits: Commit[];
}

const { TabPane } = Tabs;

const CommitFilesTabList: React.FC<CommitFilesAccordionProps> = ({ commits }) => {
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
                                    <CodeRenderer code={file.patch} lang={file.extension} />
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
