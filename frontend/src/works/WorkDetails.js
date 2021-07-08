import { Suspense } from 'react';
import { useSnapshot } from 'valtio';
import { UL, H2, H3, H4,  Callout, HTMLTable, Card, Elevation } from '@blueprintjs/core';
import { useParams } from 'react-router-dom';

import { workDetailsState } from '../App';

// import Loading from '../tools/Loading';

import './WorkDetails.css';


const WorkDetails = () => {
    const { id } = useParams();

  
    const WorkDeets = () => {
        workDetailsState.loadWorkDeets(id);
        const workDeetsSnap = useSnapshot(workDetailsState);
        const { title, description, duration, difficulty, eraStyle, compYr, highestNote, clef, comments,
            lowestNote, techniques, fName, lName, country, gender, accompType, accompDifficulty, movements
        } = workDeetsSnap.workDetails;

        return (
            <>
            
            <Card elevation={Elevation.TWO} className='Card'>
                <H3>{title}</H3>
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
            <Card className='Card'>
                <H3>Composer</H3>
                <HTMLTable>
                    <tbody>
                    { fName || lName ? 
                        <tr>
                            <td>composer</td>
                            <td>{fName} {lName}</td>
                        </tr>
                        : null 
                    }
                    { country ? 
                        <tr>
                            <td>country/region</td>
                            <td>{country}</td>
                        </tr>
                        : null 
                    }
                    { gender ? 
                        <tr>
                            <td>gender</td>
                            <td>{gender}</td>
                        </tr>
                        : null 
                    }
                    </tbody>
                </HTMLTable>
            </Card>
            <Card className='Card'>
                <H3>Description</H3>
                { description ? 
                    <Callout intent='success' icon={null} className='Callout'>
                        {description}
                    </Callout>
                    : 'N/A'
                }
            </Card>
            <Card className='Card'>
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
                            <tr key={m.id}>
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
            <Card className='Card'>
                <H3>Community</H3>
                { comments && comments.length > 0 
                    ? (
                        <div>
                            { comments.map(c => (
                                <>
                                    <p>
                                        {c.comment}<br />
                                        <small>-{c.username} ({c.commentDate})</small>
                                    </p>
                                    
                                </>
                            ))}
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