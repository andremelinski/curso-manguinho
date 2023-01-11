"test:staged": "jest --passWithNoTests" -> triggered every time a commit is made
utils layer -> things that are generic
domain layer -> every business rule used in presentation folder. https://developer.android.com/topic/architecture/domain-layer
data layer -> database actions. 
infra -> database connections, database used
main layer -> where the framework stays and where the instance that call other folders.
Ex: signUp Route that'll call the signUp controller
utils -> A Utility class is understood to only have static methods and be stateless. You would not create an instance of such a class.
A Helper can be a utility class or it can be stateful or require an instance be created. I would avoid this if possible."helpful" vs "useful", a helpful tool tends to have some context (cheese grater helps to grate cheese, corn stripper helps to strip corn, speed loader helps to reload a firearm). A "utility" is expected to work in a variety of contexts (WD-40, duct tape, army-knives, glue, flashlight, etc...).
https://stackoverflow.com/questions/12192050/what-are-the-differences-between-helper-and-utility-classes
