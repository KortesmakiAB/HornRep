import { useSnapshot } from 'valtio';

import { worksState } from '../App';

import WorkCard from '../works/WorkCard';
// import Loading from '../tools/Loading';


const WorksByComposer = () => {
    const worksSnap = useSnapshot(worksState);

    return (
            <div>
                { worksSnap.worksList.map(w => <WorkCard  key={w.id}  props={w} />) }
            </div>
    );
};

export default WorksByComposer;