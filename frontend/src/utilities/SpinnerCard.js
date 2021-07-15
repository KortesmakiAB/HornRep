import { Card, Spinner } from '@blueprintjs/core';

const SpinnerCard = () => {
    return (
        <Card className='Card'>
            <Spinner intent='primary'/>
        </Card>
    );
};

export default SpinnerCard;