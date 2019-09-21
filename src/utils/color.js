const DEFAULT_SCALE = chroma.scale(['purple', 'blue', 'green', 'yellow', 'red']);


const getColor = (i) => {
    return DEFAULT_SCALE(i/*Math.random()*/).hex()
};
