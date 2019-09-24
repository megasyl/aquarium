const Brain = (parent) => {
    const methods = [
        neataptic.methods.mutation.ADD_NODE,
        neataptic.methods.mutation.SUB_NODE,
        neataptic.methods.mutation.ADD_CONN,
        neataptic.methods.mutation.SUB_CONN,
        neataptic.methods.mutation.MOD_WEIGHT,
        neataptic.methods.mutation.MOD_BIAS,
        neataptic.methods.mutation.MOD_ACTIVATION,
        neataptic.methods.mutation.ADD_GATE,
        neataptic.methods.mutation.SUB_GATE,
        neataptic.methods.mutation.ADD_SELF_CONN,
        neataptic.methods.mutation.SUB_SELF_CONN,
        neataptic.methods.mutation.ADD_BACK_CONN,
        neataptic.methods.mutation.SUB_BACK_CONN
    ]
    let brain;
    if (parent) {
        // Always mutate child brains !
        brain = neataptic.Network.crossOver(parent.brain, parent.brain);
        // Allow all mutation methods on the brain
        if (Math.random() < rules.BRAIN_MUTATION_RATE) {
            const mutationNumber = random(1, 2);
            for (let i = 0; i < mutationNumber; i++) {
                brain.mutate(methods[random(0, methods.length)]);
            }
        }

    } else {
        // Init a simple perceptron brain
        brain = new neataptic.Network(rules.INPUT_NUMBER, rules.OUTPUT_NUMBER);
        //brain = new neataptic.architect.Perceptron(rules.INPUT_NUMBER, random(1, 12), random(1, 12), random(1, 12), random(1, 12), rules.OUTPUT_NUMBER);

        // Init networks with randomized mutations to allow initial diversity
        for (let i = 0; i < rules.BRAIN_INITIAL_MUTATION_NUMBER; i++) {
            brain.mutate(methods[random(0, methods.length)]);
        }

    }
    return brain;
};
