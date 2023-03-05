## Procedure
Consider the following situation. You are given a list of n cities with the distance between any two cities. Now, you have to start with starting point and to visit all the cities only once each and return to the same point. What is the shortest path can you take? This problem is called the Traveling Salesman Problem (TSP).

 <ol>
<li>
  Consider a city as the starting and ending point. We can use any city as a starting point because the route is cyclic.</li>

<li>    Start traversing from the source to its adjacent nodes</li>

<li> Find the cost of each traversal and keep track of minimum cost and keep on updating the value of minimum cost stored value.</li>

<li>  In the end, return the permutation with minimum cost. </li>
</ol>
