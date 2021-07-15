import { Suspense } from 'react';
import { Tab, Tabs } from '@blueprintjs/core';
import NewComposer from '../forms/NewComposer';
import NewWork from '../forms/NewWork';
import SpinnerCard from '../utilities/SpinnerCard';

const Collaborate = () => {

    const handleTabChange = (tab) => {
        // byTitles default is true, so it is not included as an argument.
        // tab === 'work' ? worksState.worksSearch() : worksState.worksSearch({byTitles: false}) ;
    };

    return (
        <Suspense fallback={SpinnerCard}>
            <Tabs id="CollaborateTabs" onChange={handleTabChange} defaultSelectedTabId="work">
                <Tab id="work" title="new Work" panel={<NewWork />} />
                <Tab id="composer" title="new Composer" panel={<NewComposer />}  />
            </Tabs>
        </Suspense>
    );
};

export default Collaborate;