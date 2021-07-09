import { Suspense } from 'react';
import { useSnapshot } from 'valtio';
import { H3, Callout, HTMLTable, Card, Elevation, Button, FormGroup, InputGroup } from '@blueprintjs/core';
import { useParams } from 'react-router-dom';

import { workDetailsState } from '../App';

// import Loading from '../tools/Loading';

import './WorkDetails.css';

const WorkDetails = () => {
    const { id } = useParams();
    // const history = useHistory();    // TODO remove?
    
    workDetailsState.loadWorkDeets(id);

    const WorkDeets = () => {

        const handleCommentChange = (evt) => {
            const { value } = evt.target;
            workDetailsState.setNewComment(value);
        };

        const handleCommentSubmit = (evt) => {
            evt.preventDefault();

            // does not add to db, but avoids page refresh.
            workDetailsState.addWorkDetailsComment({ 
                comment: workDeetsSnap.newComment,
                // TODO add username from state and current date
                // username: ,
                // commentDate: 
            });
            workDetailsState.addNewComment();
            workDetailsState.setNewComment('');
            workDetailsState.toggleHideCommentForm();
            
            // TODO or is it better to do a redirect, triggering an api call?
            // history.push(`/works/${id}`)
            
        };
        
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
                    : 'No description available.'
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
                                <p key={c.id}>
                                    {c.comment}<br />
                                    <small>-{c.username} ({c.commentDate})</small>
                                </p>
                                
                            ))}
                        </div>
                    )
                    : null
                }
            {/* TODO user must be logged in */}
            { workDeetsSnap.hideCommentForm ? 
                <Button type='button' onClick={() => workDetailsState.toggleHideCommentForm() } >add comment</Button>
                : null
            }
            </Card>
            {/* TODO user must be logged in */}
            { !workDeetsSnap.hideCommentForm ?
                <Card className='Card'>
                    <form onSubmit={handleCommentSubmit}>
                        <FormGroup label='Share your experience with this work' labelFor='comment'>
                            <InputGroup id='comment' value={workDeetsSnap.newComment} onChange={handleCommentChange} />
                        </FormGroup>
                        <Button type='button' onClick={() => workDetailsState.toggleHideCommentForm() } >Cancel</Button>
                        <Button type='submit'>Add comment</Button>
                    </form>
                </Card>
                : null
            }
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