import React, { memo, useEffect } from "react";
import Prism from "prismjs";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";
import "prismjs/themes/prism.css";

type Props = {
    code: string;
    lang: string;
};

type LanguageMapping = {
    [key: string]: string;
};

const langaugesMapping: LanguageMapping = {
    'js': 'javascript',
    'ts': 'typescript',
    'h': 'clike',
    'cc': 'clike',
    'py': 'python',
    'jsp': 'java',
    'md': 'markdown'
};


const CodeRenderer = ({ lang, code }: Props) => {
    const language = lang.replace('.', '');

    useEffect(() => {
        //create an async function to load the lanugages using import
        async function highlight() {
            if (typeof window !== "undefined" || !language) {
                //import the language dynamically using import statement
                // TODO: fix this hack
                const lang_load: string = langaugesMapping[language] || language;

                try {
                    await import(`prismjs/components/prism-${lang_load}`);
                }
                catch (e: unknown) { // <-- note `e` has explicit `unknown` type
                    if (typeof e === "string") {
                        e.toUpperCase() // works, `e` narrowed to string
                    } else if (e instanceof Error) {
                        e.message // works, `e` narrowed to Error
                    }
                }

                Prism.highlightAll();
            }
        }
        highlight();
    }, [code]);

    return (
        <pre>
            <code className={`language-${language}`}>{code}</code>
        </pre>
    );
};

export default memo(CodeRenderer);
