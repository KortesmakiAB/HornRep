import { Suspense } from 'react';
import { useSnapshot } from 'valtio';
import { H3, Callout, HTMLTable, Card, Elevation, Button, FormGroup, InputGroup, Icon } from '@blueprintjs/core';
import { useParams } from 'react-router-dom';

import { workDetailsState } from '../App';

// import Loading from '../tools/Loading';

import './WorkDetails.css';

const WorkDetails = () => {
    const { id } = useParams();
    // const history = useHistory();    // TODO remove?
    
    workDetailsState.loadWorkDeets(id);

    const WorkDeets = () => {
        const workDeetsSnap = useSnapshot(workDetailsState);

        const handleCommentChange = (evt) => {
            const { value } = evt.target;
            workDetailsState.setNewCommentState(value);
        };

        const handleCommentSubmit = (evt) => {
            evt.preventDefault();
            workDetailsState.addNewComment();
            workDetailsState.toggleHideCommentForm();
            workDetailsState.setNewCommentState('');
            // get comments from db and add to proxy
            workDetailsState.setWorkComments(id);
        };

        const handleCommentEditClick = (evt) => {
            evt.preventDefault();
            const commentId = parseInt(evt.target.getAttribute('data-comment-id'));
            workDetailsState.setCommentEditId(commentId);
            workDeetsSnap.workDetails.comments.forEach(c => {
                if (c.id === commentId) workDetailsState.setCommentEditState(c.comment);
            });
            workDetailsState.toggleHideEditForm();
        }

        const handleEditChange = (evt) => {
            const { value } = evt.target;
            workDetailsState.setCommentEditState(value);
        };

        const handleEditSubmit = (evt) => {
            evt.preventDefault();
            workDetailsState.editComment(workDeetsSnap.commentEditId);
            workDetailsState.toggleHideEditForm();
            workDetailsState.setCommentEditState('')
            workDetailsState.setWorkComments(id);
        };

        const handleCommentDelete = (evt) => {
            evt.preventDefault();
            const commentId = evt.target.getAttribute('data-comment-id');
            //  call delete api
            workDetailsState.deleteComment(commentId);
            workDetailsState.setWorkComments(id);
        };
        
        
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
                                <div key={c.id}>
                                    {c.comment}<br />
                                    <small>-{c.username} ({c.commentDate})</small>
                                    {/* TODO user must be logged in */}
                                    <form data-comment-id={c.id} className='comment-form-edit' onSubmit={handleCommentEditClick}>
                                        <Button icon='edit' type='submit' minimal={true} className='comment-icon' />
                                    </form>
                                    <form data-comment-id={c.id} className='comment-form-delete' onSubmit={handleCommentDelete}>
                                        <Button icon='trash' type='submit' minimal={true} className='comment-icon' />
                                    </form>
                                </div>
                            ))}
                        </div>
                    )
                    : null
                }
            {/* TODO user must be logged in */}
            { workDeetsSnap.hideCommentForm ? 
                <Button type='button' onClick={() => workDetailsState.toggleHideCommentForm()} text='add comment'  ></Button>
                : null
            }
            </Card>
            {/* TODO user must be logged in */}
            { !workDeetsSnap.hideCommentForm ?
                <Card className='Card'>
                    <form onSubmit={handleCommentSubmit}>
                        <FormGroup label='Share your experience with this work' labelFor='comment'>
                            <InputGroup id='comment' value={workDeetsSnap.newCommentState} onChange={handleCommentChange} />
                        </FormGroup>
                        <Button type='button' small={true} intent='danger' className='comment-form-btn' onClick={() => workDetailsState.toggleHideCommentForm() } text='cancel' />
                        <Button type='submit' small={true} intent='primary' className='comment-form-btn'>Add comment</Button>
                    </form>
                </Card>
                : null
            }
            {/* TODO user must be logged in */}
            { !workDeetsSnap.hideEditForm ?
                <Card className='Card'>
                    <form onSubmit={handleEditSubmit}>
                        <FormGroup label='Edit your comment' labelFor='editComment'>
                            <InputGroup id='editComment' value={workDeetsSnap.commentEditState} onChange={handleEditChange} />
                        </FormGroup>
                        <Button type='button' small={true} intent='danger' className='comment-form-btn' onClick={() => workDetailsState.toggleHideEditForm() } text='cancel' />
                        <Button type='submit' small={true} intent='primary' className='comment-form-btn' text='update comment' />
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