# src/semantic_steve/cli.py

from .semantic_steve import SemanticSteve

def cli(controller: SemanticSteve):
    """
    Command-line interface for controlling Minecraft via the Semantic Steve API.
    This function could launch an interactive shell or process CLI arguments.
    """
    # Example CLI loop (simplified)
    print("Welcome to Semantic Steve CLI!")
    while True:
        command = input("Enter command (or 'exit' to quit): ")
        if command.lower() == "exit":
            break
        # Parse and execute command using controller
        print(f"Executing: {command}")
        # Example: controller.pathfind_to_coordinates(...)
    print("Exiting CLI.")
