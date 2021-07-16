import { proxy, useSnapshot } from 'valtio';
import { FormGroup, Slider } from '@blueprintjs/core';

import { getDurationObj, sliderMax } from './Duration';

// initial maxDuration is pre-set to 15 for convenience.
// most people want works shorter than 15 minutes.
export const durationSliderState = proxy({
    // sliderArr: [0, 20],
    // setSliderArr(valArr) { this.sliderArr = valArr },

    // minDuration: '',
    // setMinDuration(d){ this.minDuration = d },
    
    duration: 15,
    setDuration(d){ this.duration = d },

    durationFormatted: '',
    setDurationFormatted(f) { this.durationFormatted = f },
});


const DurationSlider = () => {
    const durationSliderSnap = useSnapshot(durationSliderState);

    const handleSliderRelease = (minutes) => {
        const durationObj = getDurationObj(sliderMax);
        durationSliderState.setDurationFormatted(durationObj[minutes]);
    };

    return (
        <FormGroup label="duration" labelFor="duration" labelInfo="(complete work)" helperText="*Does not search individual movement duration.">
            <Slider 
                id="duration" 
                name="duration" 
                intent="primary"
                max={sliderMax}
                value={durationSliderSnap.duration} 
                onChange={(val) => durationSliderState.setDuration(val)} 
                onRelease={handleSliderRelease} 
                labelStepSize={5}
                stepSize={1}
            />
        </FormGroup>
    );
};

export default DurationSlider;