import { proxy, useSnapshot } from 'valtio';
import { FormGroup, RangeSlider } from '@blueprintjs/core';

import { searchFormState } from '../App';

// initial maxDuration is pre-set to 20 for convenience.
// most people want works shorter than 20 minutes.
const durationState = proxy({
    sliderArr: [0, 20],
    setSliderArr(valArr) { this.sliderArr = valArr },
});

const Duration = () => {
    const durationSnap = useSnapshot(durationState);

    // object containing 'HH:MM:SS' values which correspond to num of minutes (from form data) as keys
    const duration = {};
    const sliderMax = 40;
    for (let i= 1; i <= sliderMax; i++) {
        if (i < 10) duration[i] = `00:0${i}:00`;
        else duration[i] = `00:${i}:00`;
    }

    const handleSliderRelease = (minMaxArr) => {
        const minKey = minMaxArr[0];
        const maxKey = minMaxArr[1];
        searchFormState.setFormField('minDuration', duration[minKey]);
        searchFormState.setFormField('maxDuration', duration[maxKey]);
    };

    return (
        <FormGroup label="duration" labelFor="duration" labelInfo="(complete work)" helperText="*Does not search individual movement duration.">
            <RangeSlider 
                id="duration" 
                name="duration" 
                intent="primary"
                max={sliderMax}
                value={durationSnap.sliderArr} 
                onChange={(valArr) => durationState.setSliderArr(valArr)} 
                onRelease={handleSliderRelease} 
                labelStepSize={5}
                stepSize={1}
            />
        </FormGroup>
    );
};

export default Duration;