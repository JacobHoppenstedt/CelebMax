import os
import re

IMAGE_FOLDER = "celebrity_images"

def remove_parentheses_from_filename(filename):
    """
    Cleans scraped names into proper format
    For example: "Brad_Pitt_(actor).png" -> "Brad_Pitt.png"
    """
    # Split off the extension
    name, ext = os.path.splitext(filename)
    # Remove parentheses text from 'name'
    cleaned = re.sub(r"\(.*?\)", "", name)
    # If you want to remove leftover underscores, do so:
    cleaned = re.sub(r"_+", "_", cleaned)  # convert multiple underscores to single
    cleaned = cleaned.strip("_")           # remove trailing/leading underscores
    new_filename = cleaned + ext
    return new_filename

def main():
    if not os.path.exists(IMAGE_FOLDER):
        print(f"Folder '{IMAGE_FOLDER}' does not exist.")
        return
    
    files = os.listdir(IMAGE_FOLDER)
    png_files = [f for f in files if f.lower().endswith(".png")]

    for old_filename in png_files:
        new_filename = remove_parentheses_from_filename(old_filename)
        # If new_filename is different, rename
        if new_filename != old_filename:
            old_path = os.path.join(IMAGE_FOLDER, old_filename)
            new_path = os.path.join(IMAGE_FOLDER, new_filename)
            # Check if 'new_path' already exists
            if os.path.exists(new_path):
                print(f"Cannot rename '{old_filename}' -> '{new_filename}' (target exists). Skipping.")
                continue
            # Perform the rename
            os.rename(old_path, new_path)
            print(f"Renamed: '{old_filename}' -> '{new_filename}'")
        else:
            print(f"No parentheses to remove in '{old_filename}', skipping.")

if __name__ == "__main__":
    main()
