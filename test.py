import json

def filter_ev_stations(data):
    filtered_stations = []
    for station in data:
        passed = False
        address = station.get("AddressInfo", {})
        postcode = address.get("Postcode", "")
        for i in station.get("Connections", []):
            if i.get("PowerKW", 8) <= 7:
                passed = True
        if postcode[:3] == "SW6" and passed:
            filtered_stations.append(station)

    return filtered_stations

with open("/Users/tingzhanghuang/Documents/self-effort/important/EV-Charging-RL/london_stations.json") as f:
    ev_data = json.load(f)

filtered_results = filter_ev_stations(ev_data)
# print(json.dumps(filtered_results, indent=4, ensure_ascii=False))

with open("/Users/tingzhanghuang/Documents/self-effort/important/EV-Charging-RL/london_stations_filtered.json", "w") as f:
    json.dump(filtered_results, f, indent=4, ensure_ascii=False)

# print number of stations
print(len(filtered_results))