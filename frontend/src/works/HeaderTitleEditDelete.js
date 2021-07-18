import { Button, H3 } from '@blueprintjs/core';

import './HeaderTitleEditDelete.css';

const HeaderTitleEditDelete = ({ heading, handleEdit, handleDelete }) => {

    // TODO put must be owner or admin to see these buttons
    // see WorkDetails.
    return (
        <div className='Header-TitleIcon-div'>
            <H3 >{heading}</H3>
            <div className='Header-Inner-div'>
                <form onSubmit={handleEdit} className='Header-TitleIcon-form'>
                    <Button 
                        icon='edit'
                        intent='warning'
                        minimal={true}
                        type='submit'
                        className=''
                    />
                </form>
                <form onSubmit={handleDelete} className='Header-TitleIcon-form' >
                    <Button 
                        icon='trash'
                        intent='warning'
                        minimal={true}
                        type='submit'
                        className=''
                    />
                </form>
            </div>
        </div>
    );
};

export default HeaderTitleEditDelete;