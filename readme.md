"test:staged": "jest --passWithNoTests" -> triggered every time a commit is made
utils layer -> things that are generic
domain layer -> every business rule used in presentation folder.
data layer -> database actions
infra -> database connections, database used
main layer -> where the framework stays and where the instance that call other folders.
Ex: signUp Route that'll call the signUp controller
