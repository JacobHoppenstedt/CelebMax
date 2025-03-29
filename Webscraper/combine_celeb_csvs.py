import os
import pandas as pd

def combine_celeb_csvs(input_folder="celebritynames", output_file="all_celeb_names.csv"):
    """
    Reads all CSV files in `input_folder`, extracts only the 'title' column,
    removes underscores from the names, and concatenates them into a single CSV named `output_file`.
    """

    # List all .csv files in the input folder
    csv_files = [f for f in os.listdir(input_folder) if f.endswith(".csv")]

    # Prepare a list to hold dataframes
    df_list = []

    for file in csv_files:
        file_path = os.path.join(input_folder, file)
        
        # Read the CSV; 'title' must be a column in each file
        df = pd.read_csv(file_path)
        
        # Extract only the 'title' column
        # If your CSV has a different column name or case (e.g. 'Title'),
        # adjust accordingly.
        if 'title' in df.columns:
            df = df[['title']].copy()

            # Remove underscores from the 'title' column
            df['title'] = df['title'].astype(str).str.replace('_', ' ', regex=False)
            df_list.append(df)
        else:
            print(f"Warning: 'title' column not found in {file_path}, skipping.")
    
    # Concatenate all dataframes
    if df_list:
        combined = pd.concat(df_list, ignore_index=True)
        
        # (Optional) if you want to drop duplicates, uncomment:
        # combined.drop_duplicates(inplace=True)

        # Save the combined file
        combined.to_csv(output_file, index=False)
        print(f"Combined CSV created: {output_file}  (Total rows: {len(combined)})")
    else:
        print("No valid CSV files found or 'title' column missing in all files.")

if __name__ == "__main__":
    combine_celeb_csvs()
