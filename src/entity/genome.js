class Genome {
    constructor(parent = {}) {
        this.constant = parent.constant || randomFloat(rules.INITIAL_MIN_CONSTANT, rules.INITIAL_MAX_CONSTANT);
        this.maxSpeed = parent.maxSpeed || rules.INITIAL_MAX_SPEED;
        this.size = parent.size ||  rules.INITIAL_SIZE;
        this.smellDistance = parent.smellDistance || rules.INITIAL_SMELL_DISTANCE;
        this.soundDistance = parent.soundDistance || rules.INITIAL_SOUND_DISTANCE;

        this.minHealth = parent.minHealth || rules.INITIAL_MIN_HEALTH;
        // One activation every 'brainActivityFrequency' frames
        this.brainActivityFrequency = parent.brainActivityFrequency || rules.INITIAL_BRAIN_ACTIVITY_FREQUENCY;
        this.maxChrono = parent.maxChrono || rules.INITIAL_MAX_CHRONO;
        this.maxLifeTime = parent.maxLifeTime || rules.INITIAL_MAX_LIFETIME;
        this.color = parent.genome ? parent.genome.color : getColor(this.constant)

        for (let i = 0; i < rules.GENOME_INITIAL_MUTATION_NUMBER; i++) {
            this.mutate()
        }

    }

    mutate() {
        this.mutateAttributeByPercentage('constant', rules.CONSTANT_VARIATION_PERCENTAGE);
        this.mutateAttributeByPercentage('maxSpeed', rules.MAX_SPEED_VARIATION_PERCENTAGE);
        this.mutateAttributeByPercentage('size', rules.SIZE_VARIATION_PERCENTAGE);
        this.mutateAttributeByPercentage('smellDistance', rules.SMELL_DISTANCE_VARIATION_PERCENTAGE);
        this.mutateAttributeByPercentage('soundDistance', rules.SOUND_DISTANCE_VARIATION_PERCENTAGE);
        this.mutateAttributeByPercentage('minHealth', rules.INITIAL_MIN_HEALTH_VARIATION_PERCENTAGE);
        this.mutateAttributeByPercentage('brainActivityFrequency', rules.BRAIN_ACTIVITY_FREQUENCY_VARIATION_PERCENTAGE);
        this.mutateAttributeByPercentage('maxChrono', rules.MAX_CHRONO_VARIATION_PERCENTAGE);
    }

    mutateAttributeByPercentage(attribute, percentage) {
        const range = this[attribute] * (percentage / 100);
        this[attribute] += randomFloatWithNegativeRange(range);
    }
}
