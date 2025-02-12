import numpy as np
from Benefit_Function import overall_benefit
from Cost_Function import overall_travel_time, overall_charging_time, overall_waiting_time, overall_cost

import math


"""
Parameters for Benefit Function
"""
capacity_unit = 1  # [cap_unit] = kW, introduced for getting the units correctly
CHARGING_POWER = np.array([12, 23, 40])  # [power] = kW, rounded
RADIUS_MAX = 1000  # [radius_max] = m

"""
Parameters for Cost Function
"""
BATTERY = 85  # battery capacity, [BATTERY] = kWh
time_unit = 1  # [time_unit] = h, introduced for getting the units correctly
VELOCITY = 23 * 1000  # based on m per hour, but here dimensionless
waiting_inf = 10 ** 6   # Set a upper bound value for infinite waiting time
alpha = 0.4  # the weight value between travel time and (charging time + waiting time)

"""
Parameters for Constraints
"""
K = 24  # maximal number of chargers at a station
INSTALL_FEE = np.array([450, 600, 25000])  # fee per installing a charger of level 1, 2 or 3. £
BUDGET = 1.25 * 10 ** 6  # £
price_parkingplace = 200 * 3.5 * 2  # £

my_lambda = 0.5

def existing_score(existing_plan, node_list):
    """
    computes the score of the existing plan
    """
    total_benefit = overall_benefit(existing_plan, node_list)
    travel_time = overall_travel_time(node_list)
    charging_time = overall_charging_time(existing_plan)
    waiting_time = overall_waiting_time(existing_plan)
    total_cost = overall_cost(existing_plan, node_list)
    total_score = my_lambda * total_benefit - (1 - my_lambda) * total_cost
    return total_score, total_benefit, total_cost, travel_time, charging_time, waiting_time

def normalize_score(plan_list, node_list, norm_score, norm_benefit, norm_cost, norm_travel, norm_charg, norm_wait):
    """
   Normalise the score and relevant metrics by existing plan
    """
    if not plan_list:
        return -math.inf
        
    total_benefit = overall_benefit(plan_list, node_list) / norm_benefit
    travel_time = overall_travel_time(node_list) / norm_travel
    charging_time = overall_charging_time(plan_list) / norm_charg
    waiting_time = overall_waiting_time(plan_list) / norm_wait
    total_cost = overall_cost(plan_list, node_list) / norm_cost
    total_score = (my_lambda * overall_benefit(plan_list, node_list) - (1 - my_lambda) * overall_cost(plan_list, node_list)) / norm_score
    return total_score, total_benefit, total_cost, travel_time, charging_time, waiting_time