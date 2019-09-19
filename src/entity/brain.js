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
        brain.mutate(methods[random(0, methods.length)]);
    } else {
        // Init a simple perceptron brain
        brain = new neataptic.Network(rules.INPUT_NUMBER, rules.OUTPUT_NUMBER)
    }
    return brain;
};
