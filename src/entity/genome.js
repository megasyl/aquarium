class Genome {
    constructor(parent = {}) {
        const hasParent = !!parent.genome;
        this.maxSpeed = hasParent ? parent.genome.maxSpeed : rules.INITIAL_MAX_SPEED;
        this.size = hasParent ? parent.genome.size : rules.INITIAL_SIZE;
        this.smellDistance = hasParent ? parent.genome.smellDistance : rules.INITIAL_SMELL_DISTANCE;
        this.soundDistance = hasParent ? parent.genome.soundDistance : rules.INITIAL_SOUND_DISTANCE;

        this.minHealth = hasParent ? parent.genome.minHealth : rules.INITIAL_MIN_HEALTH;

        // One activation every 'brainActivityFrequency' frames
        this.brainActivityFrequency = hasParent ? parent.genome.brainActivityFrequency : rules.INITIAL_BRAIN_ACTIVITY_FREQUENCY;
        this.maxChrono = hasParent ? parent.genome.maxChrono : rules.INITIAL_MAX_CHRONO;
        this.maxLifeTime = hasParent ? parent.genome.maxLifeTime : rules.INITIAL_MAX_LIFETIME;
        this.constant = hasParent ? parent.genome.constant : randomFloat(rules.INITIAL_MIN_CONSTANT, rules.INITIAL_MAX_CONSTANT);
        this.color = getColor(this.constant);

        if (!hasParent) {
            for (let i = 0; i < rules.GENOME_INITIAL_MUTATION_NUMBER; i++) {
                this.mutate()
            }
        } else {
            if (Math.random() < rules.GENOME_MUTATION_RATE) {
                this.mutate()
            }
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
