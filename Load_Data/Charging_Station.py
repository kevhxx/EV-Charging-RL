from pandas import json_normalize
from IPython.display import FileLink
import os
import json
import pandas as pd

local_folder_path = 'C:/Users/WUR19/Desktop/GB'
contents = os.listdir(local_folder_path)
print(contents)
data_list = []

try:
    # Iterate through each JSON file in the local folder
    for filename in os.listdir(local_folder_path):
        if filename.endswith('.json'):
            # Read the JSON file
            with open(os.path.join(local_folder_path, filename), 'r', encoding='latin1') as file:
                json_data = json.load(file)
                # Extract key information
                usage_type_id = json_data.get('UsageTypeID')
                usage_cost = json_data.get('UsageCost')
                address_info = json_data.get('AddressInfo')
                connections = json_data.get('Connections')
                number_of_points = json_data.get('NumberOfPoints')
                # Add extracted information to the list
                data_list.append({'UsageTypeID': usage_type_id, 'UsageCost': usage_cost, 'AddressInfo': address_info, 'Connections': connections, 'NumberOfPoints': number_of_points})

    # Convert dictionaries in the list to a DataFrame
    data = pd.concat([pd.DataFrame([d]) for d in data_list], ignore_index=True)

except Exception as e:
    print(f"An error occurred: {e}")

# Split dictionaries in the UsageCost column into multiple columns
usage_cost_df = json_normalize(data['UsageCost'])
# Split lists in the Connections column into multiple columns
def extract_connection_info(connection):
    if isinstance(connection, list) and len(connection) > 0:
        return connection[0]
    else:
        return {}

connections_df = json_normalize(data['Connections'].apply(extract_connection_info))
# Split dictionaries in the AddressInfo column into multiple columns
address_info_df = json_normalize(data['AddressInfo'])
# Concatenate the newly generated columns back to the original DataFrame
data = pd.concat([data, usage_cost_df, connections_df, address_info_df], axis=1)
# Drop the original UsageCost, Connections, and AddressInfo columns
data.drop(['UsageCost', 'Connections', 'AddressInfo'], axis=1, inplace=True)
# CSV
data.to_csv('data.csv', index=False)
FileLink(r'data.csv')