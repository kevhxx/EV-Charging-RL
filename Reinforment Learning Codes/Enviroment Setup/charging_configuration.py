import itertools
import numpy as np
from math import ceil
from Data_Processing.Benefit_Function import CHARGING_POWER, haversine
from Data_Processing.Overall_Settings import K, RADIUS_MAX, my_lambda
from Data_Processing.Constraints import INSTALL_FEE
from Data_Processing.Cost_Function import BATTERY






def prepare_config(): 
    """
    Prepare the power capacities of various charging configurations and identify the most cost-effective ones.
    """
    N = len(CHARGING_POWER)  # 3 types of chargers
    urn = list(range(0, K + 1)) * N  # 8 chargers of 3 types, [0,1,...8,0,...8,0,...8]
    config_list = []  # all possible configurations
    for combination in itertools.combinations(urn, N):  # pick 3 arbitrary numbers within range
        config_list.append(list(combination)) 

    my_config_dict = {}  # cheapest configurations for each capacity level
    for config in config_list:
        if np.sum(config) > K:
            continue
        else:
            capacity = np.sum(CHARGING_POWER * config)  # Multiply and sum to get capacity
            if capacity in my_config_dict.keys():
                # check for a cheaper configuration for the same capacity
                if np.sum(INSTALL_FEE * config) < np.sum(INSTALL_FEE * my_config_dict[capacity]):
                    my_config_dict[capacity] = config
            else:
                my_config_dict[capacity] = config  

     # Use cheaper configurations for higher capacities if they cost less
    key_list = sorted(list(my_config_dict.keys())) 
    for index, key in enumerate(key_list):
        cost_list = [np.sum(INSTALL_FEE * my_config_dict[my_key]) for my_key in key_list[index:]]  
        best_cost_index = cost_list.index(min(cost_list)) + index  
        best_config = my_config_dict[key_list[best_cost_index]]  
        my_config_dict[key] = best_config 
    return my_config_dict


def initial_solution(my_config_dict, node_list, s_pos):
  """
  Get the initial solution for the charging configuration based on required capacity
  """
  W = 0  # minimum capacity constraint
  radius = 50  # why 50?
  for node in node_list:
      if haversine(s_pos, node) <= radius:   
          W += node[1]["weakened_demand"]
  W = ceil(W) * BATTERY  
  key_list = sorted(list(my_config_dict.keys()))
  for key in key_list:
      if key > W:
          break
  best_config = my_config_dict[key]  
  return best_config

"""
Calculate the maximum benefit efficiency for each node
"""
def maximum_benefit_efficiency(node_list):
  for node in node_list:
    home_charging = node[1]["home_charging"]
    coverage_max = 0  
    for other_node in node_list:
        # calculate distance with haversine approximation
        if haversine(node, other_node) <= RADIUS_MAX:   # self also counts
            coverage_max += 1
    delta_benefit = coverage_max * (1 - 0.1 * home_charging)
    delta_benefit /= 100  # scale here

    if node[1]["estate_price"] != 0:
      tmp_estate_price = node[1]["estate_price"]
    else:
      tmp_estate_price = 0.00001

    node[1]["max_benefit"] = my_lambda * delta_benefit / tmp_estate_price
  return node_list

"""
Choose the deployment of stations or chargers based on different action strategies
"""

# Action 0, 2
def choose_by_benefit(free_list):
    """
    pick location which the smallest benefit
    """
    benefit_list = [node[1]["benefit"] for node in free_list]
    pos_minindex = benefit_list.index(min(benefit_list))
    chosen_node = free_list[pos_minindex]
    return chosen_node

# Action 1, 3
def choose_by_demand(free_list):
    """
    pick location with highest weakened demand
    """
    demand_list = [node[1]["weakened_demand"] for node in free_list]
    chosen_index = demand_list.index(max(demand_list))
    chosen_node = free_list[chosen_index]
    return chosen_node

# Action 5
def relocate_by_benefit(node_list, plan_list):
    """
    choose station with the worst benefit
    """
    plan_index_list = [station[0][0] for station in plan_list]
    my_occupied_list = [node for node in node_list if node[0] in plan_index_list]
    if not my_occupied_list:
        return None
    benefit_list = [node[1]["max_benefit"] for node in my_occupied_list]
    pos_minindex = benefit_list.index(min(benefit_list))
    remove_node = my_occupied_list[pos_minindex]
    plan_index = plan_index_list.index(remove_node[0])
    remove_station = plan_list[plan_index]
    return remove_station

# Action 5
def support_stations(plan_list, free_list):
    """
    Select a station requiring support due to the highest combined waiting and charging times for charger reallocation.
    """
    # Calculate the total cost of waiting and charging time for each station
    cost_list = [station[2]["waiting_time"] + station[2]["charging_time"] for station in plan_list]

    if not cost_list:
        # If there are no stations, choose a node based on highest demand
        chosen_node = choose_by_demand (free_list)   # If there is no plan, select the node according to the highest demand
    else:
        # Identify the station with the maximum combined waiting and charging times
        index = cost_list.index(max(cost_list)) 
        station_sos = plan_list[index]  # Station identified for support
        if sum(station_sos[1]) < K:
            # If the identified station has capacity for more chargers, choose it
            chosen_node = station_sos[0]
        else:
            # If the station is at full capacity, find the nearest node to establish a new station
            dis_list = [haversine(station_sos[0], node) for node in free_list]
            min_index = dis_list.index(min(dis_list))
            chosen_node = free_list[min_index]
    return chosen_node