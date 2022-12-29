"test:staged": "jest --passWithNoTests" -> triggered every time a commit is made
utils layer -> things that are generic
domain layer -> every business rule used in presentation folder. https://developer.android.com/topic/architecture/domain-layer
data layer -> database actions. 
infra -> database connections, database used
main layer -> where the framework stays and where the instance that call other folders.
Ex: signUp Route that'll call the signUp controller
utils -> Here goes everything that controls your app like constants, assets, enums, lang folders, routes, styles, etc.. This folder is for storing all utility functions such as formatters. generally only store pure functions in this folder since if a utility function has side effects then it is most likely not just a simple utility function.
