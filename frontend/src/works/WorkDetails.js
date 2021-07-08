import { Suspense } from 'react';
import { useSnapshot } from 'valtio';
import { UL, H2, H3, H4,  Callout, HTMLTable, Card, Elevation } from '@blueprintjs/core';
import { useParams } from 'react-router-dom';

import { workDetailsState } from '../App';

// import Loading from '../tools/Loading';

import './Works.css';


const WorkDetails = () => {
    const { id } = useParams();

  
    const WorkDeets = () => {
        workDetailsState.loadWorkDeets(id);
        const workDeetsSnap = useSnapshot(workDetailsState);
        const { title, description, duration, difficulty, eraStyle, compYr, highestNote, clef,
            lowestNote, techniques, fName, lName, country, gender, accompType, accompDifficulty, movements
        } = workDeetsSnap.workDetails;

        return (
            <>
            <Card>
                <H2>{title}</H2>
                <Callout intent='success' icon={null} >
                    {description}
                </Callout>
            </Card>
            <Card elevation={Elevation.TWO} className=''>
                <H3>Work</H3>
                <HTMLTable>
                    <tbody>
                    { duration ? 
                        <tr>
                            <td>duration</td>
                            <td> {duration}</td>
                        </tr> 
                        : null 
                    }
                    { difficulty ? 
                        <tr>
                            <td>level</td>
                            <td> {difficulty}</td>
                        </tr> 
                        : null 
                    }
                    { eraStyle ? 
                        <tr>
                            <td>era/style</td>
                            <td> {eraStyle}</td>
                        </tr> 
                        : null 
                    }
                    { compYr ? 
                        <tr>
                            <td>year of composition</td>
                            <td> {compYr}</td>
                        </tr> 
                        : null 
                    }
                    { highestNote ? 
                        <tr>
                            <td>highest note</td>
                            <td> {highestNote}</td>
                        </tr> 
                        : null 
                    }
                    { lowestNote ? 
                        <tr>
                            <td>lowest note</td>
                            <td> {lowestNote}</td>
                        </tr> 
                        : null 
                    }
                    { techniques ? 
                        <tr>
                            <td>technique(s)</td>
                            <td> {techniques}</td>
                        </tr> 
                        : null 
                    }
                    { clef ? 
                        <tr>
                            <td>clef(s)</td>
                            <td> {clef}</td>
                        </tr> 
                        :null 
                    }
                    { accompType ? 
                        <tr>
                            <td>accompaniment type</td>
                            <td> {accompType}</td>
                        </tr> 
                        : null 
                    }
                    { accompDifficulty ? 
                        <tr>
                            <td>accompaniment difficulty</td>
                            <td> {accompDifficulty}</td>
                        </tr> 
                        : null 
                    }
                    </tbody>
                </HTMLTable>
            </Card>
            <Card>
                <H3>Composer</H3>
                <HTMLTable>
                    <tbody>
                        <tr>
                            <td>composer</td>
                            <td>{fName} {lName}</td>
                        </tr>
                        <tr>
                            <td>country/region</td>
                            <td>{country}</td>
                        </tr>
                        <tr>
                            <td>gender</td>
                            <td>{gender}</td>
                        </tr>

                    </tbody>
                </HTMLTable>
            </Card>
            <Card>
            { movements && movements.length > 0 
                ? (<div>
                    <H3>Movements</H3>
                    <HTMLTable>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Duration</th>
                                <th>Difficulty</th>
                                {/* <th>Highest Note</th>
                                <th>Lowest Note</th> */}
                            </tr>
                        </thead>
                        <tbody>
                        {  movements.map(m => (
                            <tr>
                                <td>{m.title}</td>
                                <td>{m.duration}</td>
                                <td>{m.difficulty}</td>
                            </tr>
                        ))}
                        </tbody>
                    </HTMLTable>
                </div>
                )
                : null
            }
            </Card>
            </>
        );
    };


    return (
        <Suspense fallback={<span>TODO Loading component.....................</span>}>
            <WorkDeets />
        </Suspense>
    );
};

export default WorkDetails;