import { Card, Elevation, H4, UL } from "@blueprintjs/core";
import { Link } from 'react-router-dom';

const WorkCard = ({props}) => {
    const { id, title, fName, lName, duration, difficulty, eraStyle } = props;

    return (
        <Card interactive={true} elevation={Elevation.TWO} className='Card'>
            <Link to={`/works/${id}`}><H4>{title}</H4></Link>
            <UL>
                <li><b>composer:</b> {fName} {lName}</li>
                <li><b>duration:</b> "{duration}"</li>
                <li><b>level:</b> {difficulty}</li>
                <li><b>era/style:</b> {eraStyle}</li>
                <Link to={`/works/${id}`}>more details...</Link>
            </UL>
        </Card>
    );
};

export default WorkCard;