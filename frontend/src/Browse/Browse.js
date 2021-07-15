import { Suspense } from 'react';
import { Tab, Tabs } from "@blueprintjs/core";

import { worksState } from '../App';

import WorksByComposer from './WorksByComposer';
import WorksByTitle from './WorksByTitle';
import SpinnerCard from '../utilities/SpinnerCard';

const Browse = () => {
    worksState.worksSearch();
    
    const handleTabChange = (tab) => {
        // byTitles default is true, so it is not included as an argument.
        tab === 'title' ? worksState.worksSearch() : worksState.worksSearch({byTitles: false}) ;
    };

    return (
        <Suspense fallback={SpinnerCard}>
            <Tabs id="BrowseTabs" onChange={handleTabChange} defaultSelectedTabId="title">
                <Tab id="title" title="by Title" panel={<WorksByTitle  />} />
                <Tab id="composer" title="by Composer" panel={<WorksByComposer  />} panelClassName="" />
            </Tabs>
        </Suspense>
    );
};

export default Browse;