import { proxy, useSnapshot } from "valtio";
import { FormGroup, Checkbox } from "@blueprintjs/core";

export const difficultyState = proxy({
    checkboxesDifficulty: {
        'novice': false,
        'intermediate': false,
        'advanced': false,
    },
    setCheckboxesDifficulty(diff){ this.checkboxesDifficulty[diff] = !this.checkboxesDifficulty[diff] }
});

const Difficulty = () => {
    const handleDifficultyCheckboxChange = (evt) => {
        const difficulty = evt.target.getAttribute('data-diff');
        difficultyState.setCheckboxesDifficulty(difficulty);
    };

    const difficultySnap = useSnapshot(difficultyState);

    return (
        <FormGroup label="difficulty" labelFor="difficulty">
            <Checkbox 
                data-diff="novice" 
                name="difficulty" 
                label="novice" 
                inline="true" 
                value={difficultySnap.checkboxesDifficulty.novice} 
                onChange={handleDifficultyCheckboxChange} 
            />
            <Checkbox 
                data-diff="intermediate" 
                name="difficulty" 
                label="intermediate" 
                inline="true" 
                value={difficultySnap.checkboxesDifficulty.intermediate} 
                onChange={handleDifficultyCheckboxChange} 
            />
            <Checkbox 
                data-diff="advanced" 
                name="difficulty" 
                label="advanced" 
                inline="true" 
                value={difficultySnap.checkboxesDifficulty.advanced} 
                onChange={handleDifficultyCheckboxChange} 
            />
        </FormGroup>
    );
};

export default Difficulty;