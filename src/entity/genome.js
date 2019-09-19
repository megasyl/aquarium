class Genome {
    constructor(parent) {
        if (parent) {
            this.parent = parent;
            this.mutate();
            return;
        }
        this.constant = random(rules.INITIAL_MIN_CONSTANT, rules.INITIAL_MAX_CONSTANT);
        this.maxSpeed = rules.INITIAL_MAX_SPEED;
        this.size = rules.INITIAL_SIZE;
        this.smellDistance = rules.INITIAL_SMELL_DISTANCE;
        this.soundDistance = rules.INITIAL_SOUND_DISTANCE;
        this.color = {
            R: rules.INITIAL_R_COLOR,
            G: rules.INITIAL_G_COLOR,
            B: rules.INITIAL_B_COLOR
        };
        this.minHealth = rules.INITIAL_MIN_HEALTH;
        // One activation every 'brainActivityFrequency' frames
        this.brainActivityFrequency = rules.INITIAL_BRAIN_ACTIVITY_FREQUENCY;
    }

    mutate() {
        this.mutateAttributeByPercentage('constant', rules.CONSTANT_VARIATION_PERCENTAGE);
        this.mutateAttributeByPercentage('maxSpeed', rules.MAX_SPEED_VARIATION_PERCENTAGE);
        this.mutateAttributeByPercentage('size', rules.CONSTANT_VARIATION_PERCENTAGE);
        this.mutateAttributeByPercentage('smellDistance', rules.SMELL_DISTANCE_VARIATION_PERCENTAGE);
        this.mutateAttributeByPercentage('soundDistance', rules.SOUND_DISTANCE_VARIATION_PERCENTAGE);
        this.mutateAttributeByPercentage('minHealth', rules.INITIAL_MIN_HEALTH_VARIATION_PERCENTAGE);
        this.mutateAttributeByPercentage('brainActivityFrequency', rules.BRAIN_ACTIVITY_FREQUENCY_VARIATION_PERCENTAGE);
        this.mutateColorByPercentage('R', rules.COLOR_VARIATION_PERCENTAGE);
        this.mutateColorByPercentage('G', rules.COLOR_VARIATION_PERCENTAGE);
        this.mutateColorByPercentage('B', rules.COLOR_VARIATION_PERCENTAGE);
    }

    mutateAttributeByPercentage(attribute, percentage) {
        const min = this.parent[attribute] * -(percentage / 100);
        const max = this.parent[attribute] * (percentage / 100);
        this[attribute] += random(min, max);
    }

    mutateColorByPercentage(letter, percentage) {
        const min = this.parent.color[letter] * -(percentage / 100);
        const max = this.parent.color[letter] * (percentage / 100);
        this.color[letter] += random(min, max);
    }
}
