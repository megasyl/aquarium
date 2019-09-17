# Aquarium

Aquarium is a personnal project I made for fun to learn about neural networks and genetic algorithms.
It uses [Neataptic](https://wagenaartje.github.io/neataptic/) and [p5.js](https://p5js.org/)

Checkout the [live demo](https://megasyl.github.io/aquarium/) !
## Objective

The objective is to simulate an environnement for living forms whose only goal is to eat food and survive. Under an unsupervises training, they'll have to learn to recognise food and eat it, or die :(

In the future, I'd like to add features so that these life forms spontaneously develop new behaviors.

## Usage

It's a really simple project, just open index.html and enjoy. Maybe I'll refactor later...

## Current state

Some food is spawned in the environnement. A population of entities is then spawned with a simple neural network. They start to act randomly.
The neural network currently have 31 inputs.

There is 5 'static' inputs :
- health
- position (x,y)
- velocity (x,y)

And 24 'variable' inputs. I use the zero padding approach to handle multiple food detection. The life form can detect 6 foods with 4 attributes :
- the food position (x,y)
- the angle between the food and the heading of the entity
- the quantity of health in the food (I want it to vary)

I fill the empty inputs with 0s to cancel the weights

I use a naive normalization method for these inputs (window size for position, maxHealth, maxFoodAmount, etc) in order to accelerate convergence.

For now, even after almost 100 generations, the life forms are still pretty dumb, but I notice some interesting behaviors. Some are afraid of food, others stay static, and other target the food. Unfortunatly, the one who understand the goal are quickly lacking food and die while other are just lucky to find some while going straight. Maybe I need to improve my fitness evaluation :) 

To be continued ...
