# Recommendernode

Recommendernode is an implementation of a recommender system based on the __jaccard-index__ formula. This is built for the [sonder](http://github.com/sntiagoma/sonder) system, which modifies it's database and includes the recommendation.

For recommending it is needed that user models have a reference for they're __liked__ and __disliked__ items. Items managed on the Sonder system are:
- Movies :movie:
- Songs :song:
- Places
- Books
- Shows

This recommender system only finds new item for users vertically, and not horizontally. This is, that recommendations are based per item, and the fact that you like, say, a movie, doesn't affect the recommendations for other items. It only affects the movies recommendations.
