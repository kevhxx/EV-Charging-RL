import numpy as np
from math import sin, cos, sqrt, atan2, radians

"""
Parameters for Benefit Function
"""
capacity_unit = 1  # [cap_unit] = kW, introduced for getting the units correctly
CHARGING_POWER = np.array([12, 23, 40])  # [power] = kW, rounded
RADIUS_MAX = 1000  # [radius_max] = m

def haversine(s_pos, node):
    """
    Calculate the havershine distance which is the approximate distance of two GPS points, middle computational cost  
    """
    lon1, lat1 = s_pos[1]['x'], s_pos[1]['y']
    R_earth = 6372800  # approximate radius of earth. [R_earth] = m
    lon2, lat2 = node[1]['x'], node[1]['y']
    dlon = radians(lon2 - lon1)
    dlat = radians(lat2 - lat1)
    a = sin(dlat / 2) ** 2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlon / 2) ** 2
    c = 2 * atan2(sqrt(a), sqrt(1 - a))
    distance = R_earth * c  # [distance] = m
    if distance < 0.1:  # to avoid ZeroDivisionError
        distance = 0.1
    return distance

# Update why need
def update_node_benefit(node_list, plan_list):
    """
    see which nodes are covered by the charging plan
    """
    for node in node_list:
      decay = 0
      home_charging = node[1]["home_charging"]
      coverage = node_coverage(plan_list, node)
      for ith in range(coverage):
        decay += 1 / (ith + 1)
      single_benefit = decay * (1 - 0.1 * home_charging)
      node[1]["benefit"] = single_benefit

# Capacity
def charging_capacity(station):
    """
    returns the summed up charging capacity of the CS
    """
    s_pos, s_x, s_dict = station[0], station[1], station[2]
    total_capacity = np.sum(CHARGING_POWER * s_x)
    s_dict["capacity"] = total_capacity  # [capacity] = kw
    return station

# Influential Radius
def influential_radius(station):
    """
    gives the radius of the nodes whose charging demand the CS could satisfy
    """
    s_pos, s_x, s_dict = station[0], station[1], station[2]
    total_capacity = s_dict["capacity"]
    radius_s = RADIUS_MAX * 1 / (1 + np.exp(-total_capacity / (100 * capacity_unit)))
    s_dict["influential_radius"] = radius_s  # [radius] = m
    return station

# Coverage/ single benefit
def node_coverage(plan_list, node):
    """
    yields the number of stations covering the node within their influence radius
    """
    coverage= 0
    home_charging = node[1]["home_charging"]
    for station in plan_list:
        s_pos, s_x, s_dict = station[0], station[1], station[2]
        radius_s = s_dict["influential_radius"]
        distance = haversine(s_pos, node)
        if distance <= radius_s:
            coverage += 1
    return coverage

# Overall Benefit
def overall_benefit(plan_list, node_list):
    """
    returns the social benefit of the charging plan (our definition of benefit)
    """
    benefit = 0
    for node in node_list:
        decay = 0
        home_charging = node[1]["home_charging"]
        coverage = node_coverage(plan_list, node)
        for ith in range(coverage):
          decay += 1 / (ith + 1)  # diminishing the benefit when each additional station included in
        single_benefit = decay * (1 - 0.1 * home_charging)
        benefit += single_benefit
    benefit /= len(node_list)
    return benefit