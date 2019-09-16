document.addEventListener("DOMContentLoaded", function() {
    createCanvas(windowWidth, windowHeight);
    const network = new neataptic.architect.Perceptron(2, 10, 1);
    const entity = new Entity();
    entity.draw();
    console.log(network.graph)
    drawGraph(network.graph(300, 300), '.draw');
});
