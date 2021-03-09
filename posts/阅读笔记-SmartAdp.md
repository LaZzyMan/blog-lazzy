---
title: 'Note:SmartAdp'
date: '2017-12-16 11:27:13'
tags: 
- Geovisualization

category: Research
image: 
---
[论文原文地址](http://www.cad.zju.edu.cn/home/ycwu/projects/smartadp.html)

----
## SmartAdp: Visual Analytics of Large-scale Taxi Trajectories for Selecting Billoard Location
## View Layout
* Dashboard View shows the information of the current solution for billboard placements.
* Map View provides a visual summary of the geospatial environment.
* Solution Preview lists the parameters and statistics of the candidate solutions.
* Solution View lays out all the solutions as glyphs to reveal the relationships among the solutions.
* Location View supports in-depth analysis at the fine-grained location level.
* Ranking View displays multi-typed ranks of the solutions.

## Analytical Task
* Spatio-temporal distribution
* Location recommendation
* Location assessment
* Solution assessment
* Solution classification
* Solution ranking

## Solution Generator
Three subviews, the dashboard view, the map view and the solution preview
### Dashboard View
The view shows the dataset, target area panel, solution area panel, and the parameter setting panel, which includes the budget, normal trajectory weight, target trajectory
weight, temporal filter (weekday/weekend), and speed filter.
### Map View
* Users are allowed to change the map style into satellite or plain map for different purposes.
* The area drawing layer provides the function of drawing polygons in the map, enabling users to specify the target and solution areas in the forms of red and
blue polygons, respectively. The editing and removing interactions in the area are also supported on the dashboard.
* Heatmap layer providse userswith two types of density maps, namely, the OD and road heatmap
The OD heatmap represents the density of the target trajectories’ pick-up and drop-off geolocations through color encoding, withthe dense red areas indicating frequent pick-up and drop-off events.
The road heatmap shows the density of the target trajectories on each road segment using the same color encoding in the OD heatmap.

### Soluiton Preview
The solution preview saves the user’s previous settings on each solution and also provides the statistical information for each of them.
The horizontally laid boxes enable users to perform a rough-level comparison among candidate solutions; thus, the solutions with poor performances can be easily detected and deleted. Besides, users are allowed to directly edit any solution
by adding or deleting billboard locations from it.

## Solution Explorer
### Solution View
The solution view aims to provide users with a visual summary of each solution and the relationships among them.Meanwhile, this view is a pivot that connects the location and ranking view, thereby
enabling users to explore the solutions from multiple perspectives and assisting them determine the optimal solution immediately.

* The solution view based on a scatterplot layout allows users to obtain a quick overview of the relationships among solutions. We compute the similarities among different solutions and utilize
Multidimensional Scaling to create the layout. The distance between solutions represents the similarity between them.
* we use the color of the inner circle to indicate the particular solution.
* The radius of the inner circle represents the total cost by default.
* A radius heatmap is attached inside the outer circle and the dark red color indicates high speed.
* The arc area outside the outer circle represents the volume of weekday and weekend reach.The arc is constantly at 180◦,the scale is equal to the total number of target trajectories. The arc subareas
lying to the left and to the right of vertical dashline represent the weekday and weekend volume of the target trajectories.
* We attach nine small radial nodes to the remaining space surrounding the glyph to show nearby POIs in different POI categories.We use the size of the nodes to encode the number of POIs. From
top to bottom, they are public transport, academic, residence, hotel, sport, life service, shopping, catering, and automobile service.
* A small arc is attached inside the radius heatmap ,it represents the boxplot of speed for the solution and the pointer point to the mid value of the boxplot.

### Location View
Users may want to further analyze the relationships at the fine-grained location level.

* we use a circle to represent a selected billboard location.
*  By employing the layout of Dorling cartogram, the relative geographical positions of these billboard locations are preserved.
*  We use the radius of a circle to encode the cost information by default and the encoding attribute can be specified by users.
*  To reveal the set relations between solutions and locations, we attach a set of radial color bars surrounding the circle to indicate the solutions that the location belongs to.
*  The circle are filled with a plain-style roadmap in a novel manner. The center of the circle represents the billboard location marked as a red cross. 
*  User are allowed to click any item to see its detail information.

### Rank View
The ranking view visualizes the detailed performance related to the attributes of each solution, including the number of billboard, cost,
speed, volume, VFM, reach, OTS, GRP, slowness (inverse of speed for ranking use), in a highly organized and interactive tabular form. To support location-level comparison, we embed boxplots [4] into the matrix. This new design enables users to glean insight into the relative performance of the solutions.