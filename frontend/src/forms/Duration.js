import { proxy, useSnapshot } from 'valtio';
import { FormGroup, RangeSlider } from '@blueprintjs/core';

// initial maxDuration is pre-set to 20 for convenience.
// most people want works shorter than 20 minutes.
export const durationState = proxy({
    sliderArr: [0, 20],
    setSliderArr(valArr) { this.sliderArr = valArr },

    minDuration: '',
    setMinDuration(d){ this.minDuration = d },
    
    maxDuration: '',
    setMaxDuration(d){ this.maxDuration = d },
});

export const sliderMax = 40;
export const getDurationObj = (maxDur) => {
    // object containing 'HH:MM:SS' values which correspond to num of minutes (from form data) as keys
    const durationObj = {};
    for (let i= 1; i <= maxDur; i++) {
        if (i < 10) durationObj[i] = `00:0${i}:00`;
        else durationObj[i] = `00:${i}:00`;
    }
    return durationObj;
}

const Duration = () => {
    const durationSnap = useSnapshot(durationState);

    const handleSliderRelease = (minMaxArr) => {
        const minKey = minMaxArr[0];
        const maxKey = minMaxArr[1];
        const duration = getDurationObj(sliderMax)
        durationState.setMinDuration(duration[minKey]);
        durationState.setMaxDuration(duration[maxKey]);
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