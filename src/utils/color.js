const DEFAULT_SCALE = chroma.scale('Spectral');


const getColor = () => {
    return DEFAULT_SCALE(Math.random()).hex()
};
