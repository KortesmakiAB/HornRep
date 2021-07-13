import { useSnapshot } from 'valtio';

import { worksState } from '../App';

import WorkCard from '../works/WorkCard';


const WorksByTitle = () => {
    const worksSnap = useSnapshot(worksState);

    return (
        <div>
            { worksSnap.worksList.map(w => <WorkCard  key={w.id}  props={w} />) }
        </div>
    );
};

export default WorksByTitle;