
# Theory

To find the global optimum, we randomly start from a point and look at the neighboring points. If we find a point that is better than the current one, we move in its direction. Then, we do the same for the new point until we reach a point where there’s no better one in its vicinity.

The traveling salesman problem (TSP) is an algorithmic problem tasked with finding the shortest route between a set of points and locations that must be visited.

One common approach to solving the TSP is to use heuristic search algorithms. Heuristic search algorithms are a class of problem-solving algorithms that use heuristics, or rules of thumb, to guide the search for a solution. In the case of the TSP, a heuristic function can be used to estimate the cost of visiting each city in a given order.


Nearest Neighbor: This algorithm starts at a random city and then repeatedly visits the nearest unvisited city until all cities have been visited. Although this algorithm is simple and fast, it often fails to find the optimal solution and can produce suboptimal routes.
