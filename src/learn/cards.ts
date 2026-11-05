// Plain-language explanations for each algorithm: what it does, the intuition,
// where it is used in real life, and a question that checks understanding.
import { AlgorithmType } from "@/pathfinding/utils/types";
import { SortAlgorithm } from "@/sorting/types";
import { LearnCard } from "./types";

export const SORTING_CARDS: Record<SortAlgorithm, LearnCard> = {
  bubble: {
    name: "Bubble sort",
    oneLiner: "Repeatedly walks the array swapping neighbours that are out of order until a full pass makes no swaps.",
    intuition:
      "Picture bubbles in water: on every pass the biggest remaining value rises to the top. Each pass only compares neighbours, so values move one step at a time. When a pass finishes without a single swap, the array is sorted.",
    realWorld: [
      "Mostly a teaching tool: it is the simplest sort to explain and trace by hand.",
      "Its early-exit check makes it a quick way to confirm an array is already sorted in one O(n) pass.",
      "Like people in a line swapping places with the person next to them until everyone is in height order.",
    ],
    whenToUse: "Tiny or nearly sorted arrays, or when you need the simplest possible code to reason about.",
    whenNotTo: "Anything beyond a few dozen items; insertion sort does the same job faster.",
    complexity: {
      best: "O(n)",
      avg: "O(n²)",
      worst: "O(n²)",
      space: "O(1)",
      stable: "yes",
    },
    watchFor: "The largest unsorted value bubbles to the end each pass, so the sorted region grows from the right.",
    predictQuestion: {
      question: "After 3 full passes on an array of 10 values, what do you know for sure?",
      options: [
        "The 3 smallest values are at the front",
        "The 3 largest values are in their final positions at the end",
        "The first 3 positions are sorted relative to each other",
      ],
      answer: "The 3 largest values are in their final positions at the end",
      why: "Each pass carries the largest remaining value all the way right, but small values move left only one step per pass.",
    },
    misconception: {
      myth: "Bubble sort is always O(n²), even on sorted input.",
      correction:
        "With the 'stop if no swaps' check it finishes a sorted array in one O(n) pass; without that check it does run O(n²).",
    },
  },
  insertion: {
    name: "Insertion sort",
    oneLiner: "Builds a sorted prefix one item at a time by sliding each new item left into its correct spot.",
    intuition:
      "Like sorting a hand of cards: you pick up one card at a time and slide it left past the bigger cards until it fits. The left part of the array is always sorted. Nearly sorted input means each card only slides a short way.",
    realWorld: [
      "Timsort, the default sort in Python and for objects in Java, uses binary insertion sort to build small runs.",
      "C++ std::sort implementations (introsort) switch to insertion sort for small partitions.",
      "Keeping a short list sorted as new items arrive, like a leaderboard updated one score at a time.",
    ],
    whenToUse: "Small arrays, nearly sorted data, or data arriving one item at a time.",
    whenNotTo: "Large, randomly ordered arrays, where the O(n²) shifting dominates.",
    complexity: {
      best: "O(n)",
      avg: "O(n²)",
      worst: "O(n²)",
      space: "O(1)",
      stable: "yes",
    },
    watchFor:
      "The sorted region on the left grows by one each step, and the new item slides left until it meets a smaller or equal value.",
    predictQuestion: {
      question: "Which input makes insertion sort do the most work?",
      options: ["Already sorted", "Sorted in reverse", "Random order"],
      answer: "Sorted in reverse",
      why: "Every new item is smaller than everything before it, so it must slide all the way to the front.",
    },
    misconception: {
      myth: "Insertion sort and bubble sort are equally slow, so it never matters which you pick.",
      correction:
        "Both are O(n²), but insertion sort does fewer comparisons and writes in practice, which is why real libraries use it for small inputs.",
    },
  },
  selection: {
    name: "Selection sort",
    oneLiner: "Repeatedly finds the smallest remaining value and swaps it into the next position.",
    intuition:
      "Like picking a team in order: scan everyone left, choose the shortest, put them next in line, repeat. The left part is sorted and final after each step. It always scans the whole unsorted part, no matter how ordered it already is.",
    realWorld: [
      "Useful when writes are expensive (for example flash memory with limited write cycles), since it does at most n - 1 swaps.",
      "Laying out a row of items on a shelf by repeatedly grabbing the smallest one left in the box.",
      "Common in teaching as the clearest example of a 'find min, place it' loop.",
    ],
    whenToUse: "Small arrays where minimizing the number of swaps matters more than comparisons.",
    whenNotTo: "When you need stability or speed on nearly sorted data; it gets no benefit from existing order.",
    complexity: {
      best: "O(n²)",
      avg: "O(n²)",
      worst: "O(n²)",
      space: "O(1)",
      stable: "no",
    },
    watchFor: "Each pass scans the entire unsorted region but makes at most one swap at the end.",
    predictQuestion: {
      question:
        "How many comparisons does selection sort make on an array that is already sorted, compared to a random one?",
      options: ["Far fewer", "About the same", "Exactly the same"],
      answer: "Exactly the same",
      why: "It must scan every remaining item to be sure it found the minimum, so the comparison count is always n(n-1)/2.",
    },
    misconception: {
      myth: "Selection sort is stable because it only moves one item per pass.",
      correction: "The long-distance swap can jump an item past an equal one, e.g. [2a, 2b, 1] becomes [1, 2b, 2a].",
    },
  },
  merge: {
    name: "Merge sort",
    oneLiner: "Splits the array in half, sorts each half recursively, then merges the two sorted halves.",
    intuition:
      "Like two people each sorting half a deck, then combining by repeatedly taking the smaller top card from the two piles. Splitting goes down to single items, which are trivially sorted. All the real work happens in the merges.",
    realWorld: [
      "External sorting of files too big for memory: sort chunks that fit, then merge them; GNU sort works this way for large inputs.",
      "Timsort (Python, Java objects) is a merge sort that merges naturally occurring sorted runs.",
      "Merging sorted results from several database shards or search index segments.",
    ],
    whenToUse: "When you need guaranteed O(n log n), stability, or are sorting linked lists or data on disk.",
    whenNotTo: "When memory is tight, since array merge sort needs O(n) extra space.",
    complexity: {
      best: "O(n log n)",
      avg: "O(n log n)",
      worst: "O(n log n)",
      space: "O(n)",
      stable: "yes",
    },
    watchFor: "Small sorted blocks form first and then double in size as neighbouring blocks merge.",
    predictQuestion: {
      question: "Merge sort runs on an already sorted array. How does its running time compare to a random array?",
      options: ["Much faster, O(n)", "Still O(n log n)", "Slower, O(n²)"],
      answer: "Still O(n log n)",
      why: "The standard version always splits down to single items and does log n levels of merging regardless of input order.",
    },
    misconception: {
      myth: "Merge sort does the sorting while splitting.",
      correction: "Splitting just divides positions; the ordering is produced entirely by the merge step.",
    },
  },
  quick: {
    name: "Quick sort",
    oneLiner: "Picks a pivot, partitions values into smaller and larger sides, then sorts each side recursively.",
    intuition:
      "Like sorting exam papers by picking one score and making two piles: lower and higher. The pivot is now in its final spot. Repeat on each pile until the piles are tiny.",
    realWorld: [
      "Java's Arrays.sort for primitive types uses dual-pivot quicksort.",
      "C++ std::sort is typically introsort: quicksort that falls back to heap sort if recursion gets too deep.",
      "The same partition idea powers quickselect, used to find a median or the k-th smallest value without fully sorting.",
    ],
    whenToUse: "General-purpose in-memory sorting where average speed matters and stability does not.",
    whenNotTo: "When you need stability or a hard worst-case guarantee and cannot use a good pivot strategy.",
    complexity: {
      best: "O(n log n)",
      avg: "O(n log n)",
      worst: "O(n²)",
      space: "O(log n) average stack",
      stable: "no",
    },
    watchFor:
      "After each partition the pivot lands in its final position, with smaller values to its left and larger to its right.",
    predictQuestion: {
      question: "If the pivot is always the last element, which input triggers the O(n²) worst case?",
      options: ["Random order", "Already sorted", "All values distinct and shuffled"],
      answer: "Already sorted",
      why: "The pivot is always the largest value, so each partition only removes one item instead of splitting in half.",
    },
    misconception: {
      myth: "Quick sort is always the fastest sort.",
      correction:
        "It is fast on average, but bad pivots give O(n²), and insertion sort beats it on tiny or nearly sorted inputs.",
    },
  },
  heap: {
    name: "Heap sort",
    oneLiner:
      "Builds a max-heap from the array, then repeatedly moves the largest value to the end and repairs the heap.",
    intuition:
      "Think of a tournament bracket where the winner always rises to the top. Take the champion out, put them at the back of the line, and let the bracket re-settle to find the next champion. The heap lives inside the array itself, so no extra memory is needed.",
    realWorld: [
      "Introsort (used by C++ std::sort) falls back to heap sort to guarantee O(n log n) when quicksort recurses too deeply.",
      "The Linux kernel's generic sort() function is a heap sort, chosen for its O(1) extra memory and predictable time.",
      "The heap structure itself is a priority queue, used for task schedulers and for the frontier in Dijkstra's algorithm.",
    ],
    whenToUse: "When you need O(n log n) worst case with O(1) extra memory.",
    whenNotTo:
      "When stability matters or cache-friendly speed is the priority; quicksort and merge sort are usually faster in practice.",
    complexity: {
      best: "O(n log n)",
      avg: "O(n log n)",
      worst: "O(n log n)",
      space: "O(1)",
      stable: "no",
    },
    watchFor:
      "The array first rearranges into a heap with the maximum at index 0, then the sorted region grows from the right one maximum at a time.",
    predictQuestion: {
      question: "Right after the heap is built, what do you know about the array?",
      options: ["It is sorted descending", "The largest value is at index 0", "The smallest value is at the end"],
      answer: "The largest value is at index 0",
      why: "A max-heap only guarantees each parent is at least as large as its children, so only the root position is known.",
    },
    misconception: {
      myth: "A heap is a sorted array.",
      correction:
        "A heap is only partially ordered: parents beat children, but siblings and cousins can be in any order.",
    },
  },
  radix: {
    name: "Radix sort (LSD)",
    oneLiner:
      "Sorts integers digit by digit, starting from the least significant digit, using a stable bucket pass for each digit.",
    intuition:
      "Like sorting mail by postcode one digit at a time: first by the last digit, then the second to last, and so on. Because each pass is stable, ties keep the order from earlier passes. After the most significant digit pass, the whole list is sorted without ever comparing two numbers directly.",
    realWorld: [
      "Mechanical punched-card sorters sorted decks one column at a time, least significant first, which is LSD radix sort.",
      "GPU libraries such as NVIDIA's CUB and Thrust use radix sort for integer and float keys.",
      "Sorting large batches of fixed-length keys like IDs, timestamps, or IP addresses.",
    ],
    whenToUse: "Many integers or fixed-length keys with a small number of digits.",
    whenNotTo: "Variable-length or complex keys, or when values have many digits relative to n.",
    complexity: {
      best: "O(d(n + b))",
      avg: "O(d(n + b))",
      worst: "O(d(n + b))",
      space: "O(n + b)",
      stable: "yes",
    },
    watchFor:
      "After each pass the numbers are sorted by the digits processed so far, even though the full list looks unsorted until the last pass.",
    predictQuestion: {
      question: "Why must each digit pass be stable?",
      options: [
        "To save memory",
        "So the order from earlier, less significant digits is kept when later digits tie",
        "To make each pass O(n)",
      ],
      answer: "So the order from earlier, less significant digits is kept when later digits tie",
      why: "Without stability, sorting by the tens digit would scramble the ones-digit order of 21 and 25.",
    },
    misconception: {
      myth: "Radix sort breaks the O(n log n) limit, so it is always faster than comparison sorts.",
      correction:
        "It avoids comparisons, but its cost depends on digit count d; for large or wide keys d grows and the advantage disappears.",
    },
  },
};

export const PATHFINDING_CARDS: Record<AlgorithmType, LearnCard> = {
  BFS: {
    name: "Breadth-First Search",
    oneLiner:
      "Explores the grid in rings, visiting every cell at distance 1, then 2, and so on, until it reaches the goal.",
    intuition:
      "Like a ripple spreading from a stone dropped in a pond. A queue makes sure all cells at the current distance are handled before any farther ones. The first time it reaches the goal, it has used the fewest possible steps.",
    realWorld: [
      "Degrees of separation in a social network: friends are level 1, friends of friends level 2, the basis of 'people you may know'.",
      "Cheney's copying garbage collector traverses live objects breadth-first.",
      "Paint bucket flood fill in image editors spreads to neighbouring pixels, often implemented with a BFS queue.",
    ],
    whenToUse: "Fewest-steps paths on unweighted graphs or grids.",
    whenNotTo: "When moves have different costs, such as weight tiles; BFS ignores them.",
    complexity: {
      best: "O(V + E)",
      avg: "O(V + E)",
      worst: "O(V + E)",
      space: "O(V)",
      optimal: "yes for unweighted (fewest steps); no once weights matter",
      complete: "yes",
    },
    watchFor:
      "The explored area grows as an even diamond-shaped wavefront, and it walks straight through weight tiles as if they were normal.",
    predictQuestion: {
      question:
        "A short path crosses three weight tiles (cost 5 each) and a longer path avoids them. Which does BFS return?",
      options: [
        "The path with fewer steps, through the weights",
        "The path with lower total cost",
        "Whichever it happens to find first by direction order",
      ],
      answer: "The path with fewer steps, through the weights",
      why: "BFS counts steps, not cost, so weight tiles look identical to empty cells.",
    },
    misconception: {
      myth: "BFS finds the shortest path on any graph.",
      correction: "Only on unweighted graphs; with costs you need Dijkstra or A*.",
    },
  },
  DFS: {
    name: "Depth-First Search",
    oneLiner: "Follows one direction as far as it can, then backtracks to the last branch point and tries another.",
    intuition:
      "Like exploring a maze by keeping one hand on the wall and only turning back at dead ends. A stack (or recursion) remembers where to back up to. It finds a path, but not necessarily a short one.",
    realWorld: [
      "Maze generation with the 'recursive backtracker' algorithm is a randomized DFS.",
      "Build tools and package managers order dependencies with a DFS-based topological sort and detect cycles the same way.",
      "Backtracking solvers for puzzles like Sudoku explore choices depth-first.",
    ],
    whenToUse: "Checking reachability, exploring every option, or when any path is good enough.",
    whenNotTo: "When you need the shortest or cheapest path.",
    complexity: {
      best: "O(V + E)",
      avg: "O(V + E)",
      worst: "O(V + E)",
      space: "O(V)",
      optimal: "no",
      complete: "yes on a finite grid with a visited set",
    },
    watchFor:
      "It shoots off in long snaking lines and often reaches the goal by a winding route far longer than needed.",
    predictQuestion: {
      question:
        "The goal is one cell to the right of the start, but the neighbour order is up, right, down, left. What is likely to happen?",
      options: [
        "It finds the 1-step path immediately",
        "It may wander a long way upward before ever trying right",
        "It fails to find the goal",
      ],
      answer: "It may wander a long way upward before ever trying right",
      why: "DFS commits fully to the first direction and only tries others after backtracking.",
    },
    misconception: {
      myth: "DFS and BFS find the same path, just in a different order.",
      correction:
        "They visit cells in different orders and usually return different paths; only BFS guarantees the fewest steps.",
    },
  },
  DIJKSTRA: {
    name: "Dijkstra",
    oneLiner: "Finds the lowest-cost path by always expanding the unvisited cell with the smallest known total cost.",
    intuition:
      "Like water flowing out from the start where weight tiles are thick mud that slows it down. A priority queue always picks the cheapest frontier cell next. Once a cell is taken from the queue, its cost is final.",
    realWorld: [
      "Link-state internet routing protocols OSPF and IS-IS run Dijkstra's shortest path first on each router.",
      "Road navigation and GPS routing are built on Dijkstra and A* variants with extra speedups.",
      "Finding the cheapest route in a flight or transit network where edges are fares or travel times.",
    ],
    whenToUse:
      "Lowest-cost paths with non-negative weights, especially when you have no good distance estimate to the goal.",
    whenNotTo:
      "Graphs with negative edge weights (use Bellman-Ford), or when a heuristic exists and A* would explore less.",
    complexity: {
      best: "O((V + E) log V)",
      avg: "O((V + E) log V)",
      worst: "O((V + E) log V)",
      space: "O(V)",
      optimal: "yes with non-negative weights",
      complete: "yes",
    },
    watchFor: "The frontier spreads evenly in all directions but slows down and bends around clusters of weight tiles.",
    predictQuestion: {
      question: "On a grid with no weight tiles, how does Dijkstra's explored area compare to BFS?",
      options: ["Much smaller", "Essentially the same", "Much larger"],
      answer: "Essentially the same",
      why: "When every step costs 1, 'cheapest first' is the same as 'fewest steps first', so it behaves like BFS.",
    },
    misconception: {
      myth: "Dijkstra heads toward the goal.",
      correction:
        "It has no idea where the goal is; it expands by cost in every direction, which is exactly what A* fixes.",
    },
  },
  A_STAR: {
    name: "A*",
    oneLiner:
      "Finds the lowest-cost path by expanding the cell with the smallest cost-so-far plus estimated distance to the goal.",
    intuition:
      "Dijkstra with a sense of direction: it ranks cells by f = g + h, where g is the cost so far and h is a guess of the remaining distance (here Manhattan distance). Cells that point toward the goal get explored first. As long as the guess never overestimates, the path is still the cheapest.",
    realWorld: [
      "Pathfinding for units and characters in video games, such as moving troops across a strategy game map.",
      "Robot and drone motion planning on occupancy grids.",
      "Route planners use A* style goal-directed search, often with precomputed landmarks for the heuristic.",
    ],
    whenToUse: "Lowest-cost path to a single known goal when you can estimate remaining distance.",
    whenNotTo: "When you need distances to all cells, or when no useful heuristic exists (then it is just Dijkstra).",
    complexity: {
      best: "O(d) when the heuristic is perfect (d = path length)",
      avg: "depends on heuristic quality",
      worst: "O((V + E) log V)",
      space: "O(V)",
      optimal: "yes if the heuristic never overestimates",
      complete: "yes",
    },
    watchFor:
      "The explored area stretches toward the goal like a narrow cone instead of a full circle, and widens when walls or weights block the direct line.",
    predictQuestion: {
      question: "What happens if the heuristic h is set to 0 for every cell?",
      options: ["A* becomes Dijkstra", "A* becomes BFS", "A* stops being optimal"],
      answer: "A* becomes Dijkstra",
      why: "With h = 0, f = g, so it ranks cells purely by cost so far.",
    },
    misconception: {
      myth: "A bigger heuristic is always better because it searches faster.",
      correction:
        "A heuristic that overestimates can explore less but may return a more expensive path; it must stay admissible to guarantee the cheapest path.",
    },
  },
};
