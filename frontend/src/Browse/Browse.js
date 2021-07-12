import { Suspense } from 'react';
import { Tab, Tabs } from "@blueprintjs/core";

import { worksState } from '../App';

import WorksByComposer from './WorksByComposer';
import WorksByTitle from './WorksByTitle';


const Browse = () => {
    worksState.worksSearch();
    
    const handleTabChange = (tab) => {
        // byTitles default is true
        tab === 'title' ? worksState.worksSearch() : worksState.worksSearch({byTitles: false}) ;
    };

    return (
        <Suspense fallback={<span>TODO Loading component.....................</span>}>
            <Tabs id="BrowseTabs" onChange={handleTabChange} defaultSelectedTabId="title">
                <Tab id="title" title="By Title" panel={<WorksByTitle  />} />
                <Tab id="composer" title="By Composer" panel={<WorksByComposer  />} panelClassName="" />
            </Tabs>
        </Suspense>
    );
};

export default Browse;