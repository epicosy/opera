import { gql } from '@apollo/client';

export const CREATE_PROFILE = gql`
    mutation CreateProfile($name: String!, $startYear: Int, $endYear: Int, $cweIds: [Int], $startScore: Float, $endScore: Float,
        $hasCode: Boolean, $hasExploit: Boolean, $hasAdvisory: Boolean, $minChanges: Int, $maxChanges: Int,
        $minFiles: Int, $maxFiles: Int, $extensions: [String]) {
        createProfile(name: $name, startYear: $startYear, endYear: $endYear, cweIds: $cweIds, startScore: $startScore,
            endScore: $endScore, hasCode: $hasCode, hasExploit: $hasExploit, hasAdvisory: $hasAdvisory,
            minChanges: $minChanges, maxChanges: $maxChanges, minFiles: $minFiles, maxFiles: $maxFiles,
            extensions: $extensions) {
            profile{
                id
            }
        }
    }
`;

export const GET_PROFILE = gql`
    query getProfile($startYear: Int, $endYear: Int, $cweIds: [Int], $startScore: Float, $endScore: Float,
        $hasCode: Boolean, $hasExploit: Boolean, $hasAdvisory: Boolean, $singleCommit: Boolean, $minChanges: Int, 
        $maxChanges: Int, $minFiles: Int, $maxFiles: Int, $extensions: [String]){
        profileCount(startYear: $startYear, endYear: $endYear, cweIds: $cweIds, startScore: $startScore,
            endScore: $endScore, hasCode: $hasCode, hasExploit: $hasExploit, hasAdvisory: $hasAdvisory,
            singleCommit: $singleCommit, minChanges: $minChanges, maxChanges: $maxChanges, minFiles: $minFiles, 
            maxFiles: $maxFiles, extensions: $extensions){
            year{
                key
                value
            }
            cwe{
                key
                value
            }
            score{
                key
                value
            }
            changes{
                key
                value
            }
            files{
                key
                value
            }
            extensions{
                key
                value
            }
            total
        }
    }
`;


export const FETCH_PROFILES = gql`
    query FetchProfiles {
        profiles {
            id
            name
        }
    }
`;