### Procedure


Hill Climbing works in a very simple way. We can actually show it in a step-by-step list.

1.      Start with an empty or random solution. This is called our best solution.

2.      Make a copy of the solution and mutate it slightly.

3.      Evaluate the new solution. If it’s better than the best solution, we replace the best solution with this one.

4.     Go to step two and repeat.

## Traveling Salesman Problem (TSP) By Hill Climbing

1.      We consider a city as the starting and ending point. We can use any city as a starting point because the route is cyclic.

2.      start traversing from the source to its adjacent nodes.

3.     Find the cost of each traversal and keep track of minimum cost and keep on updating the value of minimum cost stored value.

4.      In the end, return the permutation with minimum cost.
