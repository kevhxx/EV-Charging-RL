from Benefit_Function import haversine

"""
Parameters for Cost Function
"""
BATTERY = 85  # battery capacity, [BATTERY] = kWh
time_unit = 1  # [time_unit] = h, introduced for getting the units correctly
VELOCITY = 23 * 1000  # based on m per hour, but here dimensionless
waiting_inf = 10 ** 6   # Set a upper bound value for infinite waiting time
alpha = 0.4  # the weight value between travel time and (charging time + waiting time)


def single_cost(node, station, node_dict, cost_dict):
    """
    calculate the cost for one station
    """
    s_pos, s_x, s_dict = station[0], station[1], station[2]

    # check if distance has to be calculated
    if s_pos[0] in node_dict[node[0]]:
        distance = node_dict[node[0]][s_pos[0]]
    else:
        distance = haversine(s_pos, node)
        node_dict[node[0]][s_pos[0]] = distance
    # check if cost has to be calculated
    try:
        _ = cost_dict[node[0]]

    except KeyError:
        cost_dict[node[0]] = {}

    if s_pos[0] in cost_dict[node[0]]:
        cost = cost_dict[node[0]][s_pos[0]]
    else:
        # update all weakened_demand of all nodes, if charging_demand = 0, weakened_demand also = 0
        node[1]["weakened_demand"] = node[1]["charging_demand"] * (1 - 0.1 * node[1]["home_charging"])

        travel_time = alpha * distance / VELOCITY
        D_s = node[1]["weakened_demand"] / distance
        mu_s = s_dict["capacity"] / BATTERY
        rho_s = D_s / mu_s

        if rho_s > 1:
          W_s = waiting_inf

        else:
          W_s = rho_s / (2 * mu_s * (1 - rho_s))

        waiting_time = W_s * D_s
        charging_time = rho_s
        cost = alpha * travel_time + (1 - alpha) * (charging_time + waiting_time)
        cost_dict[node[0]][s_pos[0]] = cost
    return cost


# Indicator i(s,v)
def seeking_station(plan_list, node_list, node_dict, cost_dict):
    """
    Find the optimal charging station for each EV to minimize the total cost associated with that station
    """
    for node in node_list:
        cost_list = [single_cost(node, station, node_dict, cost_dict) for station in plan_list]
        costminindex = cost_list.index(min(cost_list))
        chosen_station = plan_list[costminindex]
        s_pos = chosen_station[0]
        node[1]["charging_station"] = s_pos[0]
        node[1]["havershine_distance"] = node_dict[node[0]][s_pos[0]]
    return node_list


# Single charging time, unit: h
def single_travel_time(node_list):

  for node in node_list:

    node[1]["travel_time"] = node[1]["havershine_distance"] * node[1]["weakened_demand"] / VELOCITY

  return node_list


# Single charging time, unit: h
def single_charging_time(station, node_list):

  s_pos, s_x, s_dict = station[0], station[1], station[2]

  # yields total number of vehicles coming to a charging station in a unit time interval
  D_s = sum([1 / node[1]["havershine_distance"] * node[1]["weakened_demand"] if node[1]["charging_station"] == s_pos[0]
            else 0 for node in node_list])

  service_rate = s_dict["capacity"] / BATTERY
  s_dict["service_rate"] = service_rate
  s_dict["charging_time"] = D_s / service_rate * time_unit

  return station

# Single waiting time, unit: h
def single_waiting_time(station, node_list):

  s_pos, s_x, s_dict = station[0], station[1], station[2]

  rho_s = s_dict["charging_time"]
  mu_s = s_dict["service_rate"]

  if rho_s >= 1:
      W_s = waiting_inf
      s_dict["waiting_time"] = waiting_inf
  else:
      W_s = rho_s / (2 * mu_s * (1 - rho_s))
      D_s = sum([1 / node[1]["havershine_distance"] * node[1]["weakened_demand"] if node[1]["charging_station"] == s_pos[0]
        else 0 for node in node_list])

      s_dict["waiting_time"] = W_s * D_s

  return station

# Overall travel time
def overall_travel_time(node_list):
    """ yields the estimated travel time of all vehicles """
    travel_time = sum([node[1]["travel_time"] for node in node_list])
    return travel_time

# Overall charging time
def overall_charging_time(plan_list):
    """
    yields the total charging time given the capacity of the CS of the charging plan
    """
    charging_time = sum([station[2]["charging_time"] for station in plan_list]) / time_unit
    return charging_time

# Overall waiting time
def overall_waiting_time(plan_list):
    """
    returns the average total waiting time of the charging plan
    """
    waiting_time = sum([station[2]["waiting_time"] for station in plan_list]) / time_unit
    return waiting_time

# Overall cost
def overall_cost(plan_list, node_list):
    """
    returns the social cost, i.e. the negative side of the charging plan
    """
    travel_time = overall_travel_time(node_list)  
    charging_time = overall_charging_time(plan_list)  
    waiting_time = overall_waiting_time(plan_list)  
    overall_cost = alpha * travel_time + (1 - alpha) * (charging_time + waiting_time)
    return overall_cost