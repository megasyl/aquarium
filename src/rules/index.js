const rules = {
    // Genome initial values
    INITIAL_MIN_CONSTANT: 0,
    INITIAL_MAX_CONSTANT: 1,
    INITIAL_MAX_SPEED: 0.5,
    INITIAL_SIZE: 3,
    INITIAL_SMELL_DISTANCE: 200,
    INITIAL_SOUND_DISTANCE: 75,
    INITIAL_MIN_HEALTH: 120,
    INITIAL_BRAIN_ACTIVITY_FREQUENCY: 10,
    INITIAL_MAX_CHRONO: 1000,
    INITIAL_MAX_LIFETIME: 2000,
    GENOME_INITIAL_MUTATION_NUMBER: 1,
    GENOME_MUTATION_RATE: 0.5,


    // Genome mutations rules
    CONSTANT_VARIATION_PERCENTAGE: 8,
    MAX_SPEED_VARIATION_PERCENTAGE: 8,
    SIZE_VARIATION_PERCENTAGE: 20,
    SMELL_DISTANCE_VARIATION_PERCENTAGE: 8,
    SOUND_DISTANCE_VARIATION_PERCENTAGE: 8,
    INITIAL_MIN_HEALTH_VARIATION_PERCENTAGE: 8,
    BRAIN_ACTIVITY_FREQUENCY_VARIATION_PERCENTAGE: 8,
    MAX_CHRONO_VARIATION_PERCENTAGE: 8,

    // Brain initial values
    INPUT_NUMBER: 13,
    OUTPUT_NUMBER: 5,
    BRAIN_INITIAL_MUTATION_NUMBER: 200,

    // Brain mutation rules
    BRAIN_MUTATION_RATE: .7,

    // Default world rules
    TOTAL_ENERGY_AMOUNT: 10000,
    FOOD_MIN_ENERGY: 100,
    FOOD_MAX_ENERGY: 100,
    INITIAL_POPULATION_SIZE: 50,
    INITIAL_FOOD_COUNT: 700,
    INITIAL_FOOD_AMOUNT: 150,
    EGG_HATCHING_TIME: 500,
    EGG_LAYING_HEALTH_PRICE_PERCENTAGE: 80,
    //assuming 60 fps => -1/sec
    HUNDER_PENALITY: 1/60,
    LIMIT_EDGES: true,
    ALLOW_ENTITY_SPAWNING: false,
    TIMESCALE: 0.3,

};
