const Brain = (parent) => {
    let brain;
    if (parent) {
        // Always mutate child brains !
        brain = neataptic.Network.crossOver(parent.brain, parent.brain);
        // Allow all mutation methods on the brain
        brain.mutate([...neataptic.methods.mutation]);
    } else {
        // Init a brain with given input/output but no connection
        const networkDefinition = [new neataptic.Group(rules.INPUT_NUMBER), new neataptic.Group(rules.OUTPUT_NUMBER)];
        brain = neataptic.architect.Construct(networkDefinition);
    }
    return brain;
};
