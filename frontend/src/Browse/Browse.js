import { Suspense } from 'react';
import { Card, Spinner, Tab, Tabs } from "@blueprintjs/core";

import { worksState } from '../App';

import WorksByComposer from './WorksByComposer';
import WorksByTitle from './WorksByTitle';


const Browse = () => {
    worksState.worksSearch();
    
    const handleTabChange = (tab) => {
        // byTitles default is true, so it is not included as an argument.
        tab === 'title' ? worksState.worksSearch() : worksState.worksSearch({byTitles: false}) ;
    };

    const Spinner = () => {
        return (
            <Card className='Card'>
                <Spinner intent='primary'/>
            </Card>
        );
    };

    return (
        <Suspense fallback={Spinner}>
            <Tabs id="BrowseTabs" onChange={handleTabChange} defaultSelectedTabId="title">
                <Tab id="title" title="By Title" panel={<WorksByTitle  />} />
                <Tab id="composer" title="By Composer" panel={<WorksByComposer  />} panelClassName="" />
            </Tabs>
        </Suspense>
    );
};

export default Browse;