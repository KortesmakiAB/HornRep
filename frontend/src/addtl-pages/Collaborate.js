import { proxy, useSnapshot } from 'valtio';
import { Tab, Tabs } from '@blueprintjs/core';
import NewComposer from '../forms/NewComposer';
import NewWork from '../forms/NewWork';

export const collaborateState = proxy({
    tabId: 'work',
    setTabId(id){ this.tabId = id },
});

const Collaborate = () => {
    const collabState = useSnapshot(collaborateState)
    const handleTabChange = (tab) => collaborateState.setTabId(tab);

    return (
        <Tabs id="CollaborateTabs" selectedTabId={collabState.tabId} onChange={handleTabChange} >
            <Tab id="work" title="new Work" panel={<NewWork />} />
            <Tab id="composer" title="new Composer" panel={<NewComposer />}  />
        </Tabs>
    );
};

export default Collaborate;